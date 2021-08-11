(async function(){
	/** configuration object */
	const config = await fetch('/chat_overlay/init').then(r => r.json());
	/** vue shared store */
	const store = {
		messages: [],
	};

	Vue.component('chat-message', {
		methods: {
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

				all.sort((a, b) => a.start < b.start);

				let offset = 0;

				for (const emote of all) {
					const tag = `<img class="message-text message-emoji" src="https://static-cdn.jtvnw.net/emoticons/v2/${emote.emote}/default/dark/1.0" />`;

					parsed = parsed.slice(0, offset + emote.start)
						+ tag + parsed.slice(offset + emote.end + 1);
					offset = offset - emote.emote.length + tag.length - 2;
				}

				return this.clean(parsed);
			},
		},
		props: ['message'],
		template: /*html*/`
			<li class="message message-item">
				<span class="message-item message-badges">
					<img class="message-badges message-badge"
						v-for="badge in badges" :src="badge" />
				</span>
				<span class="message-item message-username"
					:style="{ color: message.tags['color'] }">
					{{ message.tags['display-name'] }}:
				</span>
				<span class="message-item message-text"
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
			<ul class="messages messages-list">
				<chat-message v-for="m in store.messages" :key="m.id" :message="m">
				</chat-message>
			</ul>
		`,
	});

	/** Twitch client */
	const twitch = new tmi.Client({ channels: [config.user.username] });

	twitch.on('message', (channel, tags, message, self) => {
		store.messages.push({ message: message, tags: tags });
	});
	twitch.connect();

	new Vue({ el: 'body > div:first-child' });
}());
