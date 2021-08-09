import 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js';
import './tmi.min.js';

'use strict';

const store = {
	messages: [],
}

Vue.component('chat-message', {
	computed: {
		parsedMessage() {
			const message = this.message;
			let parsed = message.message;

			if (message.tags.emotes === null)
				return parsed;

			Object.keys(message.tags.emotes).map(key => {
				const emotes = message.tags.emotes[key];
				let offset = 0;

				emotes.forEach(range => {
					const tag = `<img class="message-text message-emoji" src="https://static-cdn.jtvnw.net/emoticons/v2/${key}/default/dark/1.0" /> `,
						split = range.split('-'),
						start = parseInt(split[0]),
						end = parseInt(split[1]);

					parsed = parsed.slice(0, offset + start) + tag
						+ parsed.slice(offset + end + 1);
					offset += tag.length - end + start - 1;
				});
			});

			return parsed;
		},
	},
	props: ['message'],
	template: /*html*/`
		<li class="message message-item">
			<span class="message-item message-username"
				:style="'color: ' + message.tags['color']">
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
const twitch = new tmi.Client({ channels: ['haliphax'] });

twitch.on('message', (channel, tags, message, self) => {
	store.messages.push({ message: message, tags: tags });
	console.log(channel, tags, message);
});
twitch.connect();

new Vue({ el: 'body > div:first-child' });
