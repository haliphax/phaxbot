'use strict';

/** simple avatar object */
const Avatar = class {
	constructor(user, component) {
		this.user = user;
		this.component = component;
	}
};

/** simple chatter object */
const Chatter = class {
	constructor(user) {
		this.user = user;
		this.tags = new Set();
	}
};

/** main Vuex store */
const store = new Vuex.Store({
	state: {
		availableAvatars: [],
		avatarLimit: 20,
		avatars: {},
		avatarsUrl: 'avatars.json',
		chatters: {},
		corsProxy: 'http://localhost:8080/',
		twitchUser: 'haliphax',
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
			const keys = Object.keys(val),
				result = {},
				limit = Math.min(state.avatarLimit, keys.length);

			for (let i = 0; i < limit; i++) {
				const key = keys[i],
					chatters = val[key];

				for (let j = 0; j < chatters.length; j++) {
					const chatter = chatters[j];
					let chatterObj = null;

					if (result.hasOwnProperty(chatter))
						chatterObj = result[chatter];
					else
						chatterObj = new Chatter(chatter);

					chatterObj.tags.add(key);
					result[chatter] = chatterObj;
				}
			}

			state.chatters = result;
		},
		config(state, val) {
			for (const p in val)
				if (typeof state[p] != 'undefined'
					&& typeof val[p] != 'undefined')
				{
					state[p] = val[p];
				}
		},
		registerAvatar(state, val) {
			const sliced = val.slice(1);

			state.availableAvatars.push(val[0]);

			for (let i = 0; i < sliced.length; i++) {
				const s = document.createElement('link');

				s.type = 'text/css';
				s.rel = 'stylesheet';
				s.href = sliced[i];
				document.body.appendChild(s);
			}
		},
	},
	actions: {
		addAvatar(ctx, payload) {
			const copy = {},
				randomAvatar = ctx.state.availableAvatars[
					Math.floor(Math.random()
						* ctx.state.availableAvatars.length)],
				avatar = new Avatar(payload, randomAvatar);

			Object.assign(copy, ctx.state.avatars);
			copy[payload.user] = avatar;
			ctx.commit('avatars', copy);
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

				if (typeof ctx.state.avatars[chatter.user] == 'undefined') {
					ctx.dispatch('addAvatar', chatter);
				}
			}
		},
		async fetch(ctx) {
			// requires cors-container - https://github.com/Rob--W/cors-anywhere
			await fetch(`${ctx.state.corsProxy}https://tmi.twitch.tv/group/user/${ctx.state.twitchUser}/chatters`)
				.then(r => r.json()).then(async d => {
					ctx.commit('chatters', d.chatters);
					ctx.dispatch('updateAvatars');
				});
		},
	},
});

/** Vue mixin for default avatar behavior */
const AvatarMixIn = Vue.extend({
	data() {
		return {
			// chance of avatar choosing to walk (between 0 and 1)
			walkProbability: 0.25,
			// maximum number of seconds to wait between decisions
			waitMaximum: 17,
			// minimum number of seconds to wait between decisions
			waitMinimum: 5,
			// number of milliseconds between "walking" the avatar 1 pixel
			walkInterval: 100,
		};
	},
	props: ['avatar'],
	methods: {
		act() {
			if (Math.random() < this.walkProbability) {
				const destination = this.getRandomX();

				if (destination < this.$el.offsetLeft)
				{
					this.$el.classList.remove('right');
					this.$el.classList.add('left');
				}
				else {
					this.$el.classList.remove('left');
					this.$el.classList.add('right');
				}

				this.$el.classList.add('walking');
				this.walk(destination);

				return;
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
			const direction = this.$el.offsetLeft < destination
				? 1 : -1;

			this.$el.style.left = (this.$el.offsetLeft + direction) + 'px';

			if (this.$el.offsetLeft == destination) {
				this.$el.classList.remove('walking');
				this.act();

				return;
			}

			setTimeout(() => this.walk(destination), this.walkInterval);
		}
	},
	mounted() {
		if (Math.random() < 0.5)
			this.$el.classList.add('right');

		this.$el.style.left = this.getRandomX() + 'px';
		this.act();
	},
});

Vue.component('stream-avatars', {
	props: ['avatarLimit', 'avatarsUrl', 'corsProxy', 'twitchUser'],
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
		store.commit('config', {
			avatarLimit: this.$props.avatarLimit,
			avatarsUrl: this.$props.avatarsUrl,
			corsProxy: this.$props.corsProxy,
			twitchUser: this.$props.twitchUser,
		});

		if (store.state.avatarsUrl) {
			await fetch(store.state.avatarsUrl).then(r => r.json())
				.then(async d => {
					for (let i = 0; i < d.avatars.length; i++)
						await import(`./avatars/${d.avatars[i]}/index.js`);
				});
		}

		await store.dispatch('fetch');
		setInterval(() => store.dispatch('fetch'), 10000);
	},
});

export { Avatar, AvatarMixIn, Chatter, store };
