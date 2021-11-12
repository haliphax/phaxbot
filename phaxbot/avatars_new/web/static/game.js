import Avatar from './avatar.js';
import constants from './constants.js';
import emitter from './emitter.js';
import WebFontFile from './webfontfile.js';

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

				await import(`${stem}/avatar.js`).then(m => {
					const module = m.default;

					this.avatarDefs[avatar] = module;
					this.load.spritesheet(avatar, `${stem}/avatar.gif`, {
						frameHeight: module.frameHeight,
						frameWidth: module.frameWidth,
					});

					for (let animKey of Object.keys(module.animations)) {
						const anim = module.animations[animKey];

						for (let variation of Object.keys(anim))
							this.anims.create({
								key: `${avatar}.${animKey}.${variation}`,
								frames: this.anims.generateFrameNumbers(
									avatar, { frames: anim[variation] }),
								frameRate: anim.frameRate,
								repeat: -1,
							});
					}
				});
			}
		});
	}

	create() {
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
		this.avatars[username] = new Avatar(this, username, key);
	}
}
