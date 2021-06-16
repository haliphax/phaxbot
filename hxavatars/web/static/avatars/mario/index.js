import { AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-mario', {
	data() {
		return {
			stub: 'mario',
		};
	},
	mixins: [AvatarMixIn],
});

	store.commit('registerAvatar',
		['avatar-mario', 'avatars/mario/styles.css']);
