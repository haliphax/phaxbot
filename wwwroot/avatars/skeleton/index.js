import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** skeleton avatar component */
export default Vue.component('avatar-skeleton', {
	data() {
		return {
			stub: 'skeleton',
		};
	},
	mixins: [AvatarMixIn],
});

store.commit('registerAvatar',
	['avatar-skeleton', 'avatars/skeleton/styles.css']);
