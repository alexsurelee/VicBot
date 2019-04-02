const index = require('../index.js');
module.exports = {
	name: 'play',
	args: true,
	admin: false,
	log: false,
	description: 'Plays a song from YouTube.',
	usage: '`!play <url>`',
	async execute(message, args){
		await index.playSong(message, args);
	}
};