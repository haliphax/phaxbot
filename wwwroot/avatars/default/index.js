import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
Vue.component('avatar-default', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar default">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-default', 'avatars/default/styles.css']);
