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

if (store.state.availableAvatars.indexOf('skeleton') < 0)
	store.commit('registerAvatar',
		['avatar-skeleton', 'avatars/skeleton/styles.css']);
