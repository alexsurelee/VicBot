const index = require('../index.js');
module.exports = {
	name: 'stop',
	args: false,
	admin: false,
	log: false,
	description: 'Stops the currently playing song.',
	usage: '`!stop`',
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return message.channel.send('Stopped music.');
	}
};