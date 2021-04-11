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
		AVATAR_LIMIT: 20,
		CORS_PROXY: 'http://localhost:8080/',
		TWITCH_USER: 'haliphax',
		availableAvatars: [],
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
		chatters(state, val) {
			const keys = Object.keys(val),
				result = {},
				limit = Math.min(state.AVATAR_LIMIT, keys.length);

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
			state.availableAvatars.push(val);
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
			await fetch(`${ctx.state.CORS_PROXY}https://tmi.twitch.tv/group/user/${ctx.state.TWITCH_USER}/chatters`)
				.then(r => r.json()).then(async d => {
					ctx.commit('chatters', d.chatters);
					ctx.dispatch('updateAvatars');
				});
		},
	},
});

Vue.component('stream-avatars', {
	props: ['corsProxy', 'limit', 'twitchUser'],
	computed: {
		...Vuex.mapGetters(['avatarsArray']),
	},
	template: `
		<div>
			<component v-for="avatar in $store.getters.avatarsArray"
				:is="avatar.component" :key="avatar.user.user" :avatar="avatar" />
		</div>
	`,
	mounted() {
		store.commit('config', {
			CORS_PROXY: this.$props.corsProxy,
			AVATAR_LIMIT: this.$props.limit,
			TWITCH_USER: this.$props.twitchUser,
		});
		store.dispatch('fetch');
		setInterval(() => store.dispatch('fetch'), 10000);
	},
});

export { Avatar, Chatter, store };
