import {
	createMachine,
	interpret,
} from 'https://unpkg.com/xstate@4/dist/xstate.web.js';
import constants from './constants.js';
import { getValidHorizontalCoordinate, uuid } from './util.js';

'use strict';

export default class {
	constructor(game, avatarDefs, username, key = 'mario') {
		const def = avatarDefs[key];

		/** @type {string} The avatar owner's username */
		this.username = username;
		/** @type {string} The avatar's sprite name */
		this.key = key;
		/** @type {string} The direction the avatar's sprite is facing */
		this.face = constants.FACE_LEFT;

		this.changeFace();

		const anim = game.anims.anims.entries[`${key}.face.${this.face}`];

		/** @type {Phaser.GameObjects.Sprite} The avatar's sprite */
		this.sprite = game.physics.add.sprite(0, 0, key)
			.setOrigin(0.5, 1)
			.setScale(def.metadata.scale);
		/**
		 * @type {number}
		 * Half the width of the avatar's sprite; used in calculations */
		this.halfWidth = this.sprite.width / 2;

		this.sprite.setPosition(
			getValidHorizontalCoordinate(this), constants.SCREEN_HEIGHT);

		/** The name of the next state to transition to */
		this.nextState = null;

		/** The state machine's currently active state */
		this.currentState = createMachine(
			{
				id: uuid(),
				initial: 'idling',
				states: {
					deciding: {
						entry: ['decide'],
						on: {
							DECIDED: [
								{ target: 'walking', cond: () => this.nextState == 'walking' },
								{ target: 'idling', cond: () => this.nextState == 'idling' },
							],
						},
					},
					idling: {
						after: { '4000': 'deciding', },
						entry: ['idle'],
					},
					walking: {
						after: { '4000': 'deciding', },
						entry: ['walk'],
					},
				},
			},
			{
				actions: {
					decide: (context, event) => {
						const rand = Math.random();

						if (rand < 0.5) {
							console.log('decided to walk');
							this.nextState = 'walking';
						}
						else {
							console.log('decided to idle');
							this.nextState = 'idling';
						}

						this.stateService.send('DECIDED');
					},
					idle: (context, event) => {
						console.log('idling');
						this.sprite.body.velocity.x = 0;
						this.sprite.play(`${this.key}.idle.${this.face}`);
					},
					walk: (context, event) => {
						console.log('walking');
						this.changeFace();
						this.sprite.play(`${this.key}.walking.${this.face}`);
						this.sprite.body.velocity.x = (20 + Math.random() * 40)
							* (this.face == constants.FACE_LEFT ? -1 : 1);
					},
				}
			},
		);

		/** The state service used for communiating with this avatar's state
		 * machine */
		this.stateService = interpret(this.currentState);

		this.stateService.onTransition(state => this.currentState = state);
		this.stateService.start();
		this.stateService.send('idle');

		this.ready();
	}

	ready() {
		if (this.sprite.body == undefined)
			return setTimeout(this.ready.bind(this), 100);
	}

	update() {
		//
	}

	// extensions

	changeFace() {
		this.face = Math.random() < 0.5
			? constants.FACE_LEFT
			: constants.FACE_RIGHT;
	}
};
