import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-mario', {
	mixins: [AvatarMixIn],
	template: `
		<div class="avatar mario">
			<avatar-label :avatar="avatar"></avatar-label>
		</div>
	`,
});

	store.commit('registerAvatar',
		['avatar-mario', 'avatars/mario/styles.css']);
