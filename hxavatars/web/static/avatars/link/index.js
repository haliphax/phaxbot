import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-link', {
	data() {
		return {
			stub: 'link',
		};
	},
	mixins: [AvatarMixIn],
});

store.commit('registerAvatar',
	['avatar-link', 'avatars/link/styles.css']);
