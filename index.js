'use strict';

/** URL stem for CORS proxy */
const CORS_PROXY = document.getElementById('data-cors-proxy')
	.getAttribute('value');
/** Twitch user to load chatters from */
const TWITCH_USER = document.getElementById('data-twitch-user')
	.getAttribute('value');
/** maximum number of avatars allowed on screen */
const AVATAR_LIMIT = 20;
/** chance of avatar choosing to walk (between 0 and 1) */
const PROBABILITY_WALK = 0.25;
/** window for random wait time between avatar decisions (in seconds) */
const WAIT_WINDOW = 20;
/** minimum number of seconds to wait between avatar decisions */
const WAIT_MIN = 5;

/** base avatar component */
Vue.component('stream-avatar', {
	data() {
		return {
			destination: null,
		};
	},
	props: ['avatar'],
	methods: {
		act() {
			if (Math.random() < PROBABILITY_WALK) {
				this.destination = this.getRandomX();

				if (this.destination < this.$el.offsetLeft)
				{
					this.$el.classList.remove('right');
					this.$el.classList.add('left');
				}
				else {
					this.$el.classList.remove('left');
					this.$el.classList.add('right');
				}

				const direction = this.$el.offsetLeft < this.destination
					? 1 : -1;

				this.$el.classList.add('walking');
				this.walk(direction);

				return;
			}

			setTimeout(this.act,
				(WAIT_MIN + Math.round(Math.random()
					* (WAIT_WINDOW - WAIT_MIN))) * 1000);
		},
		getRandomX() {
			return Math.round(Math.random()
				* (window.innerWidth - this.$el.clientWidth));
		},
		walk(direction) {
			this.$el.style.left = (this.$el.offsetLeft + direction) + 'px';

			if (this.$el.offsetLeft == this.destination) {
				this.destination = null;
				this.$el.classList.remove('walking');
				this.act();

				return;
			}

			setTimeout(() => this.walk(direction), 100);
		}
	},
	template: `
		<div class="avatar">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
	mounted() {
		this.$el.style.left = this.getRandomX() + 'px';
		this.act();
	},
});

/** simple avatar object */
const Avatar = class {
	constructor(user) {
		this.user = user;
		this.component = 'stream-avatar';
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
		avatars: {},
		chatters: {},
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
		twitchUser(state, val) {
			state.twitchUser = val;
		},
		chatters(state, val) {
			const keys = Object.keys(val),
				result = {},
				limit = Math.min(AVATAR_LIMIT, keys.length);

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
	},
	actions: {
		addAvatar(ctx, payload) {
			const copy = {},
				avatar = new Avatar(payload);

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
		updateChatters(ctx, payload) {
			ctx.commit('chatters', payload);
		},
	},
});

/** pull list of chatters and adjust avatars */
const updateAvatars = async () => {
	// requires cors-container - https://github.com/Rob--W/cors-anywhere
	await fetch(`${CORS_PROXY}https://tmi.twitch.tv/group/user/${TWITCH_USER}/chatters`)
		.then(r => r.json()).then(d => {
			store.dispatch('updateChatters', d.chatters);
			store.dispatch('updateAvatars');
		});
};

updateAvatars();
setInterval(updateAvatars, 10000);

new Vue({
	computed: {
		...Vuex.mapGetters(['avatarsArray']),
	},
	el: '#main',
	store: store,
});
