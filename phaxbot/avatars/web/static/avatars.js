import 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js';
import 'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.js';

const EXCLUDE = [
	'nightbot',
	'phaxb0t',
	'rewardtts',
	'soundalerts',
	'streamcaptainbot',
	'streamelements',
];

'use strict';

/** simple avatar object */
const Avatar = class {
	constructor(user, component) {
		this.user = user;
		this.component = component;
		this.existing = false;
		this.x = 0;
	}
};

/** simple chatter object */
const Chatter = class {
	constructor(user) {
		this.user = user;
		this.tags = new Set();
	}
};

/** simple animation event object */
const Animation = class {
	constructor(weight, className) {
		this.weight = weight;
		this.className = className;
	}
};

/** main Vuex store */
const store = new Vuex.Store({
	state: {
		availableAvatars: [],
		avatarLimit: 20,
		avatars: {},
		chatters: {},
		choices: {},
		excludeChatters: EXCLUDE,
		excludeRandom: ['hide'],
		restricted: {},
	},
	getters: {
		avatarsArray(state) {
			return Object.keys(state.avatars).map(v => state.avatars[v]);
		},
	},
	mutations: {
		avatars(state, val) {
			state.avatars = val;
		},
		chatters(state, val) {
			const result = {},
				limit = Math.min(state.avatarLimit, val.length);

			for (let i = 0; i < limit; i++) {
				const chatter = val[i];

				if (state.excludeChatters.indexOf(chatter) >= 0)
					continue;

				let chatterObj = null;

				if (result.hasOwnProperty(chatter))
					chatterObj = result[chatter];
				else
					chatterObj = new Chatter(chatter);

				chatterObj.tags.add(chatter);
				result[chatter] = chatterObj;
			}

			state.chatters = result;
		},
		choices(state, val) {
			state.choices = val;
		},
		config(state, val) {
			for (const p in val)
				if (typeof state[p] != 'undefined'
					&& typeof val[p] != 'undefined')
				{
					state[p] = val[p];
				}
		},
		excludeRandom(state, val) {
			state.excludeRandom = val;
		},
		registerAvatar(state, val) {
			const assets = val.slice(1),
				key = val[0];

			if (state.availableAvatars.indexOf(key) >= 0)
				return;

			state.availableAvatars.push(key);

			for (let i = 0; i < assets.length; i++) {
				const s = document.createElement('link');

				s.type = 'text/css';
				s.rel = 'stylesheet';
				s.href = `${assets[i]}?_=${Date.now()}`;
				document.body.appendChild(s);
			}
		},
		restricted(state, val) {
			state.restricted = val;
		},
	},
	actions: {
		addAvatar(ctx, payload) {
			const copy = {};
			let avatar;

			if (Object.keys(ctx.state.choices).indexOf(payload.user) < 0) {
				const
					filteredAvatars = ctx.state.availableAvatars.filter(
						v => ctx.state.excludeRandom.indexOf(v.substring(7)) < 0),
					randomAvatar = filteredAvatars[
						Math.floor(Math.random() * filteredAvatars.length)];

				avatar = new Avatar(payload, randomAvatar);
			}
			else {
				avatar = new Avatar(payload,
					`avatar-${ctx.state.choices[payload.user]}`);
			}

			Object.assign(copy, ctx.state.avatars);
			copy[payload.user] = avatar;
			ctx.commit('avatars', copy);
		},
		async json(state, val) {
			const data = val;

			for (let i = 0; i < data.avatars.length; i++)
				await import(`./avatars/${data.avatars[i]}/index.js`
					+ `?_=${Date.now()}`);

			if (data.hasOwnProperty('excludeRandom'))
				await store.commit('excludeRandom', data.excludeRandom);

			if (data.hasOwnProperty('restricted'))
				await store.commit('restricted', data.restricted);
		},
		choices(ctx, payload) {
			const keys = Object.keys(payload),
				users = Object.keys(ctx.state.avatars);

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (users.indexOf(key) < 0)
					continue;

				const value = payload[key],
					avatar = ctx.state.avatars[key];

				avatar.existing = true;
				avatar.component = `avatar-${value}`;
			}

			ctx.commit('choices', payload);
		},
		removeAvatar(ctx, payload) {
			const copy = {};

			Object.assign(copy, ctx.state.avatars);
			delete copy[payload.user];
			ctx.commit('avatars', copy);
		},
		updateAvatars(ctx) {
			const keys = Object.keys(ctx.state.avatars),
				flat = Object.keys(ctx.state.chatters)
					.map(v => ctx.state.chatters[v])
					.reduce((p, v) => p.concat(v), []),
				flatObj = {};

			for (let i = 0; i < flat.length; i++)
				flatObj[flat[i].user] = 1;

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (! flatObj.hasOwnProperty(key))
					ctx.dispatch('removeAvatar', key);
			}

			for (let i = 0; i < flat.length; i++) {
				const chatter = flat[i];

				if (typeof ctx.state.avatars[chatter.user] == 'undefined')
					ctx.dispatch('addAvatar', chatter);
			}
		},
	},
});

/** Vue mixin for default avatar behavior */
const AvatarMixIn = Vue.extend({
	data() {
		return {
			// unique identifier for the avatar
			stub: '',
			// list of Animation objects to choose from for idle event
			idleAnimations: [],
			// if events should be disabled (e.g. on the list page)
			inactive: false,
			// if the component is currently being mounted
			mounting: true,
			// x coordinate of avatar on screen
			x: 0,
			// chance of avatar choosing to walk (between 0 and 1)
			walkProbability: 0.25,
			// maximum number of seconds to wait between decisions
			waitMaximum: 17,
			// minimum number of seconds to wait between decisions
			waitMinimum: 5,
			// number of milliseconds between "walking" the avatar 1 pixel
			walkInterval: 100 + Math.floor(Math.random() * 20) - 10,
		};
	},
	props: ['avatar'],
	methods: {
		act() {
			if (this.$el.dataset.eventClass) {
				this.$el.classList.remove(this.$el.dataset.eventClass);
				delete this.$el.dataset.eventClass;
			}

			if (Math.random() < this.walkProbability) {
				const destination = this.getRandomX();

				if (destination < this.x)
				{
					this.$el.classList.remove('right');
					this.$el.classList.add('left');
				}
				else {
					this.$el.classList.remove('left');
					this.$el.classList.add('right');
				}

				this.$el.classList.remove('idle');
				this.$el.classList.add('walking');
				this.walk(destination);

				return;
			}
			else {
				if (this.idleAnimations.length == 0) {
					this.$el.classList.add('idle');
				}
				else {
					const
						total = this.idleAnimations.reduce(
							(p, v) => p + v.weight, 0),
						roll = Math.ceil(Math.random() * total);
					let current = 0;

					for (let i = 0; i < this.idleAnimations.length; i++) {
						const anim = this.idleAnimations[i];

						if (roll <= anim.weight + current) {
							this.$el.dataset.eventClass = anim.className;
							this.$el.classList.add(anim.className);

							break;
						}

						current += anim.weight;
					}
				}
			}

			setTimeout(this.act,
				(this.waitMinimum + Math.floor(Math.random()
					* (this.waitMaximum - this.waitMinimum))) * 1000);
		},
		getRandomX() {
			return Math.floor(Math.random()
				* (window.innerWidth - this.$el.clientWidth));
		},
		walk(destination) {
			const direction = this.x < destination
				? 1 : -1;

			this.x += direction;

			if (this.x == destination) {
				this.$el.classList.remove('walking');
				this.act();

				return;
			}

			setTimeout(() => this.walk(destination), this.walkInterval);
		}
	},
	watch: {
		x(val) {
			if (!(this.mounting && this.avatar.existing))
				this.avatar.x = val;

			this.$el.style.left = val + 'px';
		},
	},
	mounted() {
		if (typeof this.avatar == 'undefined')
			return;

		if (this.avatar.existing)
			this.x = this.avatar.x;
		else if (this.mounting)
			this.x = this.getRandomX();

		if (Math.random() < 0.5)
			this.$el.classList.add('right');
		else
			this.$el.classList.add('left');

		this.mounting = false;
		this.act();
	},
	template: `
		<span :class="'avatar ' + stub">
			<avatar-label :avatar="avatar"></avatar-label>
			<div class="sprite"></div>
		</span>
	`,
});

Vue.component('avatar-label', {
	computed: {
		username() {
			if (typeof this.avatar == 'undefined'
				|| !this.avatar.user.hasOwnProperty('user'))
			{
				return;
			}

			return this.avatar.user.user;
		},
	},
	props: ['avatar'],
	template: `
		<span class="avatar-label">{{ username }}</span>
	`
});

Vue.component('stream-avatars', {
	props: [
		'avatarLimit',
		'excludeChatters',
	],
	computed: {
		...Vuex.mapGetters(['avatarsArray']),
	},
	template: `
		<div>
			<component v-for="avatar in $store.getters.avatarsArray"
				:is="avatar.component" :key="avatar.user.user"
				:avatar="avatar" />
		</div>
	`,
	async mounted() {
		await store.commit('config', {
			excludeChatters: this.$props.excludeChatters,
		});

		const socket = io.connect();

		socket.on('init', async d => {
			let chattersLoaded = false;

			await store.dispatch('json', d);

			socket.on('chatters', async d => {
				await store.commit('chatters', d);
				await store.dispatch('updateAvatars');

				if (!chattersLoaded)
					socket.emit('ready.choices');

				chattersLoaded = true;
			});

			socket.on(
				'choices', async d => await store.dispatch('choices', d));

			socket.emit('ready.chatters');
		});
	},
});

export { Animation, Avatar, AvatarMixIn, Chatter, store };
