import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
Vue.component('avatar-purple', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar purple">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-purple', 'avatars/purple/styles.css']);
