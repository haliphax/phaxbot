import constants from './constants.js';

export default class {
	constructor(game, username, key = 'mario') {
		this.username = username;
		this.key = key;
		this.sprite = game.add.sprite(0, 0, key, 0)
			.setOrigin(0.5, 1)
			.setScale(game.avatarDefs[key].scale)
			.setPosition(100, constants.SCREEN_HEIGHT);
	}

	update() {
		// TODO: update
	}
};
