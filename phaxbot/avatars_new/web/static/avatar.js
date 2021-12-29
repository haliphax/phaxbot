import {
	createMachine,
	interpret,
} from 'https://unpkg.com/xstate@4/dist/xstate.web.js';
import constants from './constants.js';
import { getValidHorizontalCoordinate, uuid } from './util.js';

'use strict';

export default class {
	constructor(game, avatarDefs, username, key = 'mario') {
		/** @type {string} The avatar owner's username */
		this.username = username;
		/** @type {string} The avatar's sprite name */
		this.key = key;
		/** @type {string} The direction the avatar's sprite is facing */
		this.face = Math.random() < constants.CHANCE_TO_CHANGE
			? constants.FACE_LEFT
			: constants.FACE_RIGHT;
		/** @type {Phaser.GameObjects.Sprite} The avatar's sprite */
		this.sprite = game.physics.add.sprite(0, 0, key)
			.setOrigin(0.5, 1)
			.setScale(avatarDefs[key].metadata.scale);
		/**
		 * @type {number}
		 * Half the width of the avatar's sprite; used in calculations */
		this.halfWidth = this.sprite.width / 2;
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
								{ target: 'walking', cond: (_, evt) => evt.next == 'walking' },
								{ target: 'idling', cond: (_, evt) => evt.next == 'idling' },
							],
						},
					},
					idling: {
						entry: ['idle'],
						on: { DECIDE: ['deciding'], },
					},
					walking: {
						entry: ['walk'],
						on: { DECIDE: ['deciding'], },
					},
				},
			},
			{
				actions: {
					decide: (context, event) => {
						const rand = Math.random();
						let next = null;

						if (rand < constants.CHANCE_TO_WALK) {
							console.debug('decided to walk');
							next = 'walking';
						}
						else {
							console.debug('decided to idle');
							next = 'idling';
						}

						this.stateService.send({
							type: 'DECIDED',
							next: next,
							prev: this.currentState.value,
						});
					},
					idle: (context, event) => {
						console.debug('idling');
						this.sprite.body.velocity.x = 0;
						this.sprite.play(`${this.key}.idle.${this.face}`);
						setTimeout(
							this.stateService.send.bind(this, 'DECIDE'),
							Math.random() * constants.TIMEOUT_MAX);
					},
					walk: (context, event) => {
						console.debug('walking');

						let swap = Math.random() < (
							event.prev == 'walking'
								? constants.CHANCE_TO_CHANGE_IF_WALKING
								: constants.CHANCE_TO_CHANGE);

						if (swap)
							this.changeFace();

						if (swap || event.prev != 'walking') {
							this.sprite.body.velocity.x =
								(constants.WALK_MIN_VELOCITY + Math.random()
									* constants.WALK_MAX_VELOCITY)
								* (this.face == constants.FACE_LEFT ? -1 : 1);
							this.sprite.play(`${this.key}.walking.${this.face}`);
						}

						setTimeout(
							this.stateService.send.bind(this, 'DECIDE'),
							Math.random() * constants.TIMEOUT_MAX);
					},
				}
			},
		);
		/** The state service used for communiating with this avatar's state
		 * machine */
		this.stateService = interpret(this.currentState);

		this.sprite.setPosition(
			getValidHorizontalCoordinate(this), constants.SCREEN_HEIGHT);
		this.stateService.onTransition(state => {
			this.previousState = this.currentState.name;
			this.currentState = state;
		});
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
		this.face = this.face == constants.FACE_LEFT
			? constants.FACE_RIGHT
			: constants.FACE_LEFT;
		console.debug(`facing ${this.face}`);
	}
};
