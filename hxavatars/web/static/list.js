import 'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js';
import { store } from './avatars.js';

'use strict';

Vue.component('avatars-list', {
	data() {
		return {
			exclude: [],
		};
	},
	props: ['avatarsUrl'],
	computed: {
		...Vuex.mapState(['availableAvatars']),
		...Vuex.mapState(['restricted']),
		avatars() {
			return this.availableAvatars.map(v => v.replace(/^avatar-/, ''))
				.filter(v => this.exclude.indexOf(v) < 0);
		},
	},
	async created() {
		await fetch(this.avatarsUrl || '/api/avatars').then(r => r.json())
			.then(async d => {
				if (d.hasOwnProperty('excludeList'))
					this.exclude = d.excludeList;

				await this.$store.dispatch('json', d);
			});
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
							class="text-right w-50">
							<span class="d-block text-monospace">
								{{ avatar }}
							</span>
							<small class="text-muted"
								v-if="Object.keys(restricted).indexOf(avatar) >= 0">
								Restricted to:
								<span class="badge badge-primary"
									v-for="role in restricted[avatar]">
									{{ role }}
								</span>
							</small>
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
