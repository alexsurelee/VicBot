
module.exports = {
	name: `delrank`,
	args: true,
	admin: true,
	usage: `\`!delrank <course>\``,
	description: `Deletes a classes' role and channel.`,
	async execute(message, args){
		if (!args.length) {
			return message.channel.send(`Please provide a rank to delete. Type !ranks for a list.`);
		}

		else if (args.length > 1) {
			return message.channel.send(`Please only list one rank to delete.`);
		}

		else if ((message.guild.roles.find(role => role.name === args[0]) == null) && (message.guild.channels.find(channel => channel.name === args[0]) == null)) {
			return message.channel.send(`Cannot find rank to delete.`);
		}

		else {
			if (message.guild.roles.find(role => role.name === args[0]) != null) await message.guild.roles.find(role => role.name === args[0]).delete();
        	if (message.guild.channels.find(channel => channel.name === args[0]) != null) await message.guild.channels.find(channel => channel.name === args[0]).delete();
        	return message.channel.send(`Deleted ${args[0]}.`);
		}
	},
};