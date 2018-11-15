module.exports = {
	name: `purge`,
	args: true,
	admin: true,
	description: `Deletes the previous x messages, including the command itself.`,
	usage: `\`!purge <number of messages>\``,
	async execute(message, args){
		if(isNaN(args[0])) return message.channel.send(`Please specify a number of messages to purge.`);
		return message.channel.bulkDelete(args[0]);
	},
};