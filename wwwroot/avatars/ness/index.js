import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
Vue.component('avatar-ness', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar ness">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-ness', 'avatars/ness/styles.css']);
