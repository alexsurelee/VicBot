const index = require(`../index.js`);
module.exports = {
	name: `np`,
	args: false,
	admin: false,
	log: false,
	description: `Displays the currently playing song.`,
	usage: `\`!np\``,
	async execute(message){
		const serverQueue = index.getQueue(message.guild.id);
		if (!serverQueue) return message.channel.send(`There is nothing playing.`);
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	}
};