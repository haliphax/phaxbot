import 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js';
import { store } from './avatars.js';

'use strict';

Vue.component('avatars-list', {
	props: ['avatarsUrl'],
	data() {
		return {
			avatars: [],
		};
	},
	async created() {
		const avatars = [];

		await fetch(this.avatarsUrl || 'avatars.json').then(r => r.json())
			.then(async d => {
				for (let i = 0; i < d.avatars.length; i++) {
					if (d.avatars[i] == 'hide')
						continue;

					const avatar = d.avatars[i],
						s = document.createElement('link')

					await import(`./avatars/${avatar}/index.js`);

					s.rel = 'stylesheet';
					s.href = `avatars/${avatar}/styles.css`;
					document.body.appendChild(s);
					avatars.push(avatar);
				}
			});

		this.avatars = avatars;
	},
	template: `
		<table class="avatars-list">
			<caption>Available avatars</caption>
			<tbody>
				<tr v-for="avatar in avatars">
					<th scope="row">{{ avatar }}</th>
					<td>
						<component :is="'avatar-' + avatar"></component>
					</td>
				</tr>
			</tbody>
		</table>
	`,
});

new Vue({
	el: '#main',
	store: store,
});
