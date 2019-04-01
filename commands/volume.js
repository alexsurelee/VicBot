const index = require('../index.js');
module.exports = {
	name: 'volume',
	args: true,
	admin: false,
	log: false,
	description: 'Changes the current music volume.',
	usage: '`!volume <number>`',
	async execute(message, args){
		const serverQueue = index.getQueue(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`I set the volume to: **${args[0]}**`);
	}
};