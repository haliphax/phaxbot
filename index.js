'use strict';

/** URL stem for CORS proxy */
const CORS_PROXY = document.getElementById('data-cors-proxy')
	.getAttribute('value');
/** Twitch user to load chatters from */
const TWITCH_USER = document.getElementById('#data-twitch-user')
	.getAttribute('value');

/** base avatar component */
Vue.component('stream-avatar', {
	props: ['user'],
	template: `
		<div><strong>{{ user }}</strong></div>
	`,
});

/** simple avatar object */
const Avatar = class {
	constructor(user) {
		this.user = user;
		this.component = 'stream-avatar';
		this.tags = new Set();
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
		twitchUser: TWITCH_USER,
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
				result = {};

			for (let i = 0; i < keys.length; i++) {
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
				avatar = new Avatar(payload.user);

			avatar.tags = payload.tags;
			Object.assign(copy, ctx.state.avatars);
			copy[payload.user] = avatar;
			ctx.commit('avatars', copy);
		},
		removeAvatar(ctx, payload) {
			const copy = {};

			Object.assign(copy, ctx.state.avatars);
			delete copy[payload];
			ctx.commit('avatars', copy);
		},
		updateAvatars(ctx) {
			const keys = Object.keys(ctx.state.avatars),
				flat = Object.keys(ctx.state.chatters)
					.map(v => ctx.state.chatters[v])
					.reduce((p, v) => p.concat(v), []),
				flatObj = {};

			for (let i = 0; i < flat.length; i++)
				flatObj[flat[i]] = 1;

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];

				if (! flatObj.hasOwnProperty(key))
					ctx.dispatch('removeAvatar', key);
			}

			for (let i = 0; i < flat.length; i++) {
				const chatter = flat[i];

				if (typeof ctx.state.avatars[chatter] == 'undefined') {
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
	await fetch(`${CORS_PROXY}https://tmi.twitch.tv/group/user/${store.twitchUser}/chatters`)
		.then(r => r.json()).then(d => {
			store.dispatch('updateChatters', d.chatters);
			store.dispatch('updateAvatars');
		});
};

updateAvatars();
setInterval(updateAvatars, 10000);

// TODO animate avatars
