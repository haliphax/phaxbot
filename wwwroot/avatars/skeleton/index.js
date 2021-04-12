import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** skeleton avatar component */
Vue.component('avatar-skeleton', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar skeleton">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-skeleton', 'avatars/skeleton/styles.css']);
