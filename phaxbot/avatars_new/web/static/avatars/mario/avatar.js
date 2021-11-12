import Avatar from '../../avatar.js';

const metadata = {
	animations: {
		face: {
			left: [3],
			right: [4],
			frameRate: 1,
		},
		walk: {
			left: [2, 1, 0],
			right: [5, 6, 7],
			frameRate: 6,
		},
	},
	frameHeight: 32,
	frameWidth: 18,
	scale: 4,
};

class ExtendedAvatar extends Avatar {
	//
}

export { metadata, ExtendedAvatar }
