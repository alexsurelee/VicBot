const index = require(`../index.js`);
module.exports = {
	name: `skip`,
	args: false,
	admin: false,
	log: false,
	description: `Skips the currently playing song.`,
	usage: `\`!skip\``,
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send(`You are not in a voice channel!`);
		if (!serverQueue) return message.channel.send(`There is nothing playing that I could skip for you.`);
		serverQueue.connection.dispatcher.end(`Skip command has been used!`);
		return undefined;
	}
};