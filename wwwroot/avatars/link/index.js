import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-link', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar link">
			<avatar-label :avatar="avatar"></avatar-label>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-link', 'avatars/link/styles.css']);
