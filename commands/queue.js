const index = require('../index.js');
module.exports = {
	name: 'queue',
	args: false,
	admin: false,
	log: false,
	description: 'Displays the currently queue.',
	usage: '`!queue`',
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`__**Song queue:**__${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}**Now playing:** ${serverQueue.songs[0].title}`);
	}
};