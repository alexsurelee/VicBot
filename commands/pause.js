const index = require(`../index.js`);
module.exports = {
	name: `pause`,
	args: false,
	admin: false,
	log: false,
	description: `Pauses the currently playing song.`,
	usage: `\`!pause\``,
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send(`⏸ Paused the music for you!`);
		}
		return message.channel.send(`There is nothing playing.`);
	}
};