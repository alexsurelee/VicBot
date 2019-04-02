const index = require('../index.js');
module.exports = {
	name: 'resume',
	args: false,
	admin: false,
	log: false,
	description: 'Resumes the currently playing song.',
	usage: '`!resume`',
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}
		return message.channel.send('There is nothing playing.');
	}
};