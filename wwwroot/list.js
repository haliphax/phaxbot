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
		<div>
			<slot>
				<div class="jumbotron">
					<h1 class="display-4">Available avatars</h1>
					<p class="lead">
						These avatars are available to represent you on-stream.
						Use the <code>!avatar</code> command to select one from
						the list.
					</p>
					<p>
						If you do not wish to be represented by an avatar
						on-stream, use <code>!avatar hide</code> to prevent
						your username from being processed.
					</p>
				</div>
			</slot>
			<table class="avatars-list table table-striped">
				<tbody>
					<tr v-for="avatar in avatars">
						<th scope="row"
							class="text-monospace text-right w-50">
							{{ avatar }}
						</th>
						<td class="text-left">
							<component :is="'avatar-' + avatar"></component>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	`,
});

new Vue({
	el: '#main',
	store: store,
});
