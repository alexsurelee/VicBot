const { aliasRanks } = require(`../config.json`);

module.exports = {
	name: `alias`,
	args: true,
	admin: false,
	usage: `\`!alias <alias>\``,
	description: `Lists the papers allocated to an alias.`,
	async execute(message, args){
		for (let i = 0; i < args.length; i++){
            if(!message.guild.roles.some(role => role.name === args[i])){
                message.channel.send(`Couldn't find ${args[i]}`);
                continue;
            }
            if(aliasRanks.indexOf(args[i]) === -1){
                message.channel.send(`${args[0]} is not an alias.`);
                continue;
            }
            var role = message.guild.roles.find(role => role.name === args[i]);
			let aliasChannels = `${role.name} currently includes: `;
			message.guild.channels.array().forEach(element => {
				if(role.permissionsIn(element).has(`VIEW_CHANNEL`) && element.parent !== null && element.parent === message.guild.channels.find(category => category.name === `papers`)) aliasChannels += `${element}` + `\t`
			});
			message.channel.send(aliasChannels);
		}
	},
};