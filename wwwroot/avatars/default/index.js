import { store } from '../../avatars.js';

'use strict';

/** chance of avatar choosing to walk (between 0 and 1) */
const PROBABILITY_WALK = 0.25;
/** window for random wait time between avatar decisions (in seconds) */
const WAIT_WINDOW = 23;
/** minimum number of seconds to wait between avatar decisions */
const WAIT_MIN = 7;

/** default avatar component */
Vue.component('avatar-default', {
	props: ['avatar'],
	methods: {
		act() {
			if (Math.random() < PROBABILITY_WALK) {
				const destination = this.getRandomX();

				if (destination < this.$el.offsetLeft)
				{
					this.$el.classList.remove('right');
					this.$el.classList.add('left');
				}
				else {
					this.$el.classList.remove('left');
					this.$el.classList.add('right');
				}

				const direction = this.$el.offsetLeft < destination
					? 1 : -1;

				this.$el.classList.add('walking');
				this.walk(destination, direction);

				return;
			}

			setTimeout(this.act,
				(WAIT_MIN + Math.floor(Math.random()
					* (WAIT_WINDOW - WAIT_MIN))) * 1000);
		},
		getRandomX() {
			return Math.round(Math.random()
				* (window.innerWidth - this.$el.clientWidth));
		},
		walk(destination, direction) {
			this.$el.style.left = (this.$el.offsetLeft + direction) + 'px';

			if (this.$el.offsetLeft == this.destination) {
				this.$el.classList.remove('walking');
				this.act();

				return;
			}

			setTimeout(() => this.walk(destination, direction), 100);
		}
	},
	template: `
		<div class="avatar default">
			<span class="avatar-label">{{ avatar.user.user }}</span>
		</div>
	`,
	mounted() {
		this.$el.style.left = this.getRandomX() + 'px';
		this.act();
	},
});

store.commit('registerAvatar',
	['avatar-default', 'avatars/default/styles.css']);
