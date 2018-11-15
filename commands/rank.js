const index = require("../index.js");

module.exports = {
    name: `rank`,
    aliases: [`role`],
    args: true,
    description: `Add or remove class ranks.`,
    usage: `\`!rank <course> [course ...]\``,
    async execute(message, args){
        if(args.length === 1) message.channel.send(`Note you can add and remove multiple ranks in one command! e.g. \`!rank comp-102 comp-103\``);
        args.forEach(function(rank) {
			index.rank(message, rank);
		});
    }
}