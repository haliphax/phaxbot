import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-purple', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar purple">
			<avatar-label :avatar="avatar"></avatar-label>
		</div>
	`,
});

store.commit('registerAvatar',
	['avatar-purple', 'avatars/purple/styles.css']);
