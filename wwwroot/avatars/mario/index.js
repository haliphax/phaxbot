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

store.commit('registerAvatar',
	['avatar-mario', 'avatars/mario/styles.css']);
