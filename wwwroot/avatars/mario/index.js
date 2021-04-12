import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
Vue.component('avatar-mario', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar mario">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
});

if (store.state.availableAvatars.indexOf('mario') < 0)
	store.commit('registerAvatar',
		['avatar-mario', 'avatars/mario/styles.css']);
