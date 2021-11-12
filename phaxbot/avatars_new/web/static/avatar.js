import constants from './constants.js';

export default class {
	constructor(game, username, key = 'mario') {
		const def = game.avatarDefs[key];

		this.username = username;
		this.key = key;
		this.face = Math.random() < 0.5
			? constants.FACE_LEFT
			: constants.FACE_RIGHT;

		const anim = game.anims.anims.entries[`${key}.face.${this.face}`];

		this.sprite = game.add.sprite(0, 0, key, anim.frames[0].textureFrame)
			.setOrigin(0.5, 1)
			.setScale(def.metadata.scale)
			.play(anim);
		this.halfWidth = this.sprite.width / 2;
		this.sprite.setPosition(
			this.halfWidth + Math.floor(Math.random()
				* (constants.SCREEN_WIDTH - this.halfWidth)),
			constants.SCREEN_HEIGHT);
	}

	update() {
		// TODO: update
	}
};
