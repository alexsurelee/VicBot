const index = require(`../index.js`);

module.exports = {
	name: `rank`,
	aliases: [`role`],
	args: true,
	description: `Add or remove class ranks.`,
	usage: `\`!rank <course> [course ...]\``,
	async execute(message, args){
		if(message.channel.name === `bots`){
			args.forEach(function(rank) {
				index.rank(message, rank);
			});
		}
	}
};