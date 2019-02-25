const Discord = require(`discord.js`);
const { aliasRanks, socialRanks } = require(`../config.json`);

module.exports = {
	name: `ranks`,
	args: false,
	admin: false,
	description: `List the available user ranks.`,
	usage: `\`!ranks\``,
	async execute(message){
		const rankArray = message.guild.roles.array();
		const firstYearArray = new Array();
		const secondYearArray = new Array();
		const thirdYearArray = new Array();
		const fourthYearArray = new Array();
		const aliasStringArray = new Array();
		const socialStringArray = new Array();
		rankArray.forEach( (role) => {
			if (role.name.includes(`-`) && role.name.length === 8 && socialRanks.indexOf(role.name) === -1 && aliasRanks.indexOf(role.name) === -1){
				if(role.name.charAt(5) === `1`) firstYearArray.push(role.name);
				else if(role.name.charAt(5) === `2`) secondYearArray.push(role.name);
				else if(role.name.charAt(5) === `3`) thirdYearArray.push(role.name);
				else if(role.name.charAt(5) === `4`) fourthYearArray.push(role.name);
			}

			else if (aliasRanks.indexOf(role.name) !== -1)
				aliasStringArray.push(role.name);

			else if (socialRanks.indexOf(role.name) !== -1)
				socialStringArray.push(role.name);
		});
		firstYearArray.sort(); secondYearArray.sort(); thirdYearArray.sort(); fourthYearArray.sort(); socialStringArray.sort(); aliasStringArray.sort();
		let firstYearString = `\`\`\`\n`;
		let secondYearString = `\`\`\`\n`;
		let thirdYearString = `\`\`\`\n`;
		let fourthYearString = `\`\`\`\n`;
		let socialString = `\`\`\`\n`;
		let aliasString = `\`\`\`\n`;
		let count = 1;
		firstYearArray.forEach( (item) => {
			firstYearString += item;
			if (count % 4 === 0) firstYearString += `\n`; else firstYearString += `\t`;
			count++;
		});
		firstYearString += `\n\`\`\``;
		count = 1;
		secondYearArray.forEach( (item) => {
			secondYearString += item;
			if (count % 4 === 0) secondYearString += `\n`; else secondYearString += `\t`;
			count++;
		});
		secondYearString += `\n\`\`\``;
		count = 1;
		thirdYearArray.forEach( (item) => {
			thirdYearString += item;
			if (count % 4 === 0) thirdYearString += `\n`; else thirdYearString += `\t`;
			count++;
		});
		thirdYearString += `\n\`\`\``;
		count = 1;
		fourthYearArray.forEach( (item) => {
			fourthYearString += item;
			if (count % 4 === 0) fourthYearString += `\n`; else fourthYearString += `\t`;
			count++;
		});
		fourthYearString += `\n\`\`\``;
		count = 1;
		socialStringArray.forEach( (item) => {
			socialString += item;
			if (count % 4 === 0) socialString += `\n`; else socialString += `\t`;
			count++;
		});
		socialString += `\n\`\`\``;
		count = 1;
		aliasStringArray.forEach( (item) => {
			aliasString += item;
			if (count % 4 === 0) aliasString += `\n`; else aliasString += `\t`;
			count++;
		});
		aliasString += `\n\`\`\``;

		const firstAndSecond = new Discord.MessageEmbed()
			.setTitle(`Papers`)
			.addField(`Usage`, `You can add and/or remove multiple ranks in one \`!rank\` command \ne.g. \`!rank <course> [course ...]\``, false)
			.addField(`First Year`, firstYearString, true)
			.addField(`Second Year`, secondYearString, true);

		const thirdAndFourth = new Discord.MessageEmbed()
			.addField(`Third Year`, thirdYearString, true)
			.addField(`Fourth Year`, fourthYearString, true);

		const socialAndOthers = new Discord.MessageEmbed()
			.addField(`Social`, `Opt-in or out channels for particular social settings.\n` + socialString)
			.addField(`Aliases`, `Global roles that will automatically place you in the default papers for your major, depending what year your started study.\n` + aliasString);

		message.channel.send(firstAndSecond);
		message.channel.send(thirdAndFourth);
		return message.channel.send(socialAndOthers);
	}
};