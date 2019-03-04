module.exports = {
	name: `micropad`,
	args: false,
	usage: `\`!micropad\``,
	description: `Provides information about micropad.`,
	async execute(message) {
		if(message.author.id === `125855147610865664`) {
			message.channel.send(
				`<:micropad:339927818181935105> is the easy to use powerful notepad app developed by our very own Nick. Check it out at https://getmicropad.com`
			);
		}
		else {
			message.channel.send(
				`<:micropad:339927818181935105> Micropad is the best notepad app. Nobody makes notepad apps as good as me. Check it out at https://getmicropad.com`
			);
		}
	},
};
