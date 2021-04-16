import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** skeleton avatar component */
export default Vue.component('avatar-skeleton', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar skeleton">
			<avatar-label :avatar="avatar"></avatar-label>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-skeleton', 'avatars/skeleton/styles.css']);
