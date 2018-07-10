const { aliasRanks } = require(`../config.json`);

module.exports = {
	name: `alias`,
	args: true,
	admin: true,
	usage: `\`!alias <alias> <course> [course ...]\``,
	description: `Changes the papers allocated to an alias.`,
	async execute(message, args){
		if (message.guild.roles.find(role => role.name === args[0]) === null) {
			return message.channel.send(`Couldn't find ${args[0]}`);
		}
		else if (aliasRanks.indexOf(args[0]) === -1) {
			return message.channel.send(`${args[0]} is not an appropriate rank.`);
		}
		else {
			var role = message.guild.roles.find(role => role.name === args[0]);
			for (let i = 1; i < args.length; i++){
				if (role.guild.channels.find(channel => channel.name === args[i]) === null) return message.channel.send(`Couldn't find ${args[i]}`);
				var channel = role.guild.channels.find(ch => ch.name === args[i]);
				if (role.permissionsIn(channel).has(`VIEW_CHANNEL`)) {
					await channel.updateOverwrite(role, { VIEW_CHANNEL: null });
					return message.channel.send(`Removed ${role.name} from ${args[i]}`);
				}
				else {
					await channel.updateOverwrite(role, { VIEW_CHANNEL: true });
					message.channel.send(`Added ${role.name} to ${args[i]}`);
				}
			}

		}
	},
};