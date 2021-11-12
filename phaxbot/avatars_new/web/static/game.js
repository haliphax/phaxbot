import constants from './constants.js';
import emitter from './emitter.js';
import WebFontFile from './webfontfile.js';

'use strict';

/** main game scene */
export default class Game extends Phaser.Scene {
	constructor() {
		super();

		this.avatars = {};
		this.avatarDefs = {};

		// event handlers
		emitter.on('new', this.onNew.bind(this));
	}

	async preload() {
		this.load.addFile(new WebFontFile(this.load, constants.FONT_FAMILY));

		await fetch('./config.json').then(r => r.json()).then(async d => {
			for (let avatar of d.avatars) {
				const stem = `./avatars/${avatar}`

				await import(`${stem}/avatar.js`).then(async m => {
					this.avatarDefs[avatar] = {
						metadata: m.metadata,
						class: m.ExtendedAvatar,
					};
					this.load.spritesheet(avatar, `${stem}/avatar.gif`, {
						frameHeight: m.metadata.frameHeight,
						frameWidth: m.metadata.frameWidth,
					});
				});
			}
		});
	}

	create() {
		for (let avatar of Object.keys(this.avatarDefs)) {
			const def = this.avatarDefs[avatar];

			for (let animKey of Object.keys(def.metadata.animations)) {
				const anim = def.metadata.animations[animKey];

				for (let variation of
					Object.keys(anim).filter(v => v != 'frameRate'))
				{
					this.anims.create({
						key: `${avatar}.${animKey}.${variation}`,
						frames: this.anims.generateFrameNumbers(
							avatar, { frames: anim[variation] }),
						frameRate: anim.frameRate,
						repeat: -1,
					});
				}
			}
		}

		this.physics.world
			.setBounds(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
			.setBoundsCollision(true, true, false, true);
	}

	update(time, delta) {
		for (let avatar of Object.values(this.avatars))
			avatar.update();
	}

	// events

	onNew(username, key = 'mario') {
		if (this.avatars.hasOwnProperty(username))
			return;

		this.avatars[username] =
			new this.avatarDefs[key].class(this, username, key);
	}
}
