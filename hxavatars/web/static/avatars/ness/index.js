import { Animation, AvatarMixIn, store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-ness', {
	data() {
		return {
			idleAnimations: [
				new Animation(1, 'backpack'),
				new Animation(1, 'look'),
				new Animation(1, 'dance'),
				new Animation(1, 'point'),
			],
			stub: 'ness',
			walkProbability: 0.15,
			// maximum number of seconds to wait between decisions
			waitMaximum: 10,
			// minimum number of seconds to wait between decisions
			waitMinimum: 5,
		};
	},
	mixins: [AvatarMixIn],
});

store.commit('registerAvatar',
	['avatar-ness', 'avatars/ness/styles.css']);
