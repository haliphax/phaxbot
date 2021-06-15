import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-purple', {
	data() {
		return {
			stub: 'purple',
		};
	},
	mixins: [AvatarMixIn],
});

store.commit('registerAvatar',
	['avatar-purple', 'avatars/purple/styles.css']);
