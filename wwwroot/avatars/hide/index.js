import { store } from '../../avatars.js';

'use strict';

/** default avatar component */
export default Vue.component('avatar-hide', {
	template: `<div class="avatar" style="display: none !important;"></div>`,
});

store.commit('registerAvatar', ['avatar-hide']);
