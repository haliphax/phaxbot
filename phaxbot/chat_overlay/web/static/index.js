(async function(){
	/** number of milliseconds before messages disappear */
	const DESTRUCT_TIMER = 90 * 1000;
	/** configuration object */
	const config = await fetch('/chat_overlay/init').then(r => r.json());
	/** vue shared store */
	const store = {
		messages: [],
	};

	document.addEventListener('animationend', e => {
		if (e.animationName == 'slide-out') {
			document.querySelector('.message.expired').remove();
			store.messages.shift();
		}
	});

	Vue.component('chat-message', {
		data() {
			return {
				store: store,
			}
		},
		methods: {
			animationEnd(e) {
				if (e.animationName == 'slide-in')
					this.message.displaying = false;
			},
			clean(text) {
				return text.replace(/\x01/g, '&lt;');
			},
		},
		computed: {
			badges() {
				return Object.keys(this.message.tags.badges || {}).map(v => {
					const version = this.message.tags.badges[v];
					const pool = (config.badges.channel.hasOwnProperty(v)
						? config.badges.channel : config.badges.global);

					return pool[v].versions[version].image_url_1x;
				});
			},
			classes() {
				const classes = ['message'];

				if (this.message.displaying) classes.push('displaying');
				if (this.message.expired) classes.push('expired');

				return classes;
			},
			parsedMessage() {
				const message = this.message;
				let parsed = message.message.replace(/</g, '\x01');

				if (message.tags.emotes === null)
					return this.clean(parsed);

				let all = [];

				for (const key of Object.keys(message.tags.emotes)) {
					const emote = message.tags.emotes[key];

					for (const range of emote) {
						const split = range.split('-');

						all.push({
							emote: key,
							start: parseInt(split[0]),
							end: parseInt(split[1]),
						});
					}
				}

				all.sort((a, b) => a.start - b.start);

				let offset = 0;

				for (const emote of all) {
					const tag = `<img class="emoji" src="https://static-cdn.jtvnw.net/emoticons/v2/${emote.emote}/default/dark/1.0" />`;
					const keyword = parsed.slice(offset + emote.start, offset + emote.end + 1);

					parsed = parsed.slice(0, offset + emote.start)
						+ tag + parsed.slice(offset + emote.end + 1);
					offset = offset + tag.length - keyword.length;
				}

				return this.clean(parsed);
			},
		},
		props: ['message'],
		template: /*html*/`
			<li :class="classes" @animationend="animationEnd">
				<span class="user">
					<span class="badges">
						<img class="badge"
							v-for="badge in badges" :src="badge" />
					</span>
					<span class="username"
						:style="{ color: message.tags['color'] }">
						{{ message.tags['display-name'] }}
					</span>
				</span>
				<span class="text"
					v-html="parsedMessage">
				</span>
			</li>
		`,
	});

	Vue.component('chat-overlay', {
		data() {
			return {
				store: store,
			};
		},
		template: /*html*/`
			<ul class="messages">
				<chat-message v-for="m in store.messages" :key="m.id" :message="m">
				</chat-message>
			</ul>
		`,
	});

	/** Twitch client */
	const twitch = new tmi.Client({ channels: [config.user.username] });

	twitch.on('message', (channel, tags, message, self) => {
		store.messages.push({
			message: message,
			tags: tags,
			displaying: true,
			expired: false,
		});

		setTimeout(() => { store.messages.find(v => !v.expired).expired = true; },
			DESTRUCT_TIMER);
	});
	twitch.connect();

	new Vue({ el: 'body > div:first-child' });
}());
