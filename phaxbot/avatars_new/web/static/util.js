import constants from './constants.js';

'use strict';

/**
 * Asynchronously await a timeout.
 *
 * @param {number} ms The number of milliseconds to wait
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get a valid x coordinate for a sprite; considers the width of the sprite in
 * order to appear fully on screen.
 *
 * @param {Avatar} avatar
 * @returns
 */
const getValidHorizontalCoordinate = (avatar) =>
	avatar.halfWidth + Math.floor(Math.random()
		* (constants.SCREEN_WIDTH - avatar.halfWidth));

/**
 * Generates a UUID.
 *
 * @returns {string} The UUID
*/
const uuid = () =>
	'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'.replace(/[^-]/g, c =>
		(c == 'x'
			? (crypto.getRandomValues(new Uint8Array(1))[0] & 15).toString(16)
			: (crypto.getRandomValues(new Uint8Array(1))[0] & 5).toString()));

export {
	delay,
	getValidHorizontalCoordinate,
	uuid,
}
