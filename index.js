const Discord = require(`discord.js`);
const fs = require(`fs`);
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// creates a map of command strings to their methods.
	client.commands.set(command.name, command);
}

const { prefix, token } = require(`./botConfig.json`);
const { forbiddenRanks, forbiddenChannels, aliasRanks, socialRanks } = require(`./config.json`);
let oneCategory;
let twoCategory;
let threeCategory;
let fourCategory;
let adminRole;

client.on(`ready`, () => {
	client.user.setUsername(`VicBot`);
	client.user.setActivity(`!help`, { type: `PLAYING` });
	console.log(`Instance started at ${new Date()}\n`);
});

// actually log in
client.login(token);

// preventing some errors from killing the whole thing
process.on(`unhandledRejection`, error => console.error(`Uncaught Promise Rejection:\n${error}`));
process.on(`unhandledError`, error => console.error(`Unhandled Error:\n${error}`));
client.on(`disconnect`, error => console.error(`Disconnected! \n${error}`));
client.on(`error`, console.error);

// listening for messages
client.on(`message`, async message => {
	// redirecting old commands
	if(message.content.startsWith(`;rank`))
		return message.channel.send(`Please use "!rank".`);

	// limiting to predefined prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// hard-coded "admins" role
	// TODO: allow manual definition of role (not based on permission or name)
	adminRole = message.guild.roles.find(role => role.name === `Admins`);
	oneCategory = message.guild.channels.find(category => category.name === `100-level`);
	twoCategory = message.guild.channels.find(category => category.name === `200-level`);
	threeCategory = message.guild.channels.find(category => category.name === `300-level`);
	fourCategory = message.guild.channels.find(category => category.name === `400-level`);


	// checking to ensure the command or an alias of the command exists
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;

	if (command.admin && !message.member.roles.has(adminRole.id))
		return message.channel.send(`This requires admin permissions.`);

	if(command.args && !args.length){
		let reply = `Please include the appropriate arguments, ${message.author}`;

		if(command.usage)
			reply += `\ne.g.: \`${command.usage}\``;

		return message.channel.send(reply);
	}

	try{
		command.execute(message, args);
	}
	catch(error){
		console.error(error);
		message.reply(`there was an error trying to execute that command!`);
	}
});

/**
 * Checks against permissions and forbidden roles, then adds or removes the role from the user which sent the message.
 * @param {Discord.Message} message the message sent
 * @param {string} rank the rank to be added or removed
 */
exports.rank = async function(message, rank) {
	if(/^[a-zA-Z]{4}[1-4]\d\d$/.test(rank))
		rank = rank.slice(0, 4) + `-` + rank.slice(4, 7);

	if (message.guild.roles.find(role => role.name === rank) == null)
		rank = rank.toLowerCase();

	if (forbiddenRanks.includes(rank)) {
		return message.channel.send(`Sorry, you cannot join ${rank}.`);
	}

	else if (message.guild.roles.find(role => role.name === rank) == null) {
		return message.channel.send(`${rank} role doesn't exist. Consider asking an @admin to create it.`);
	}

	else if (!message.guild.roles.find(role => role.name === rank).members.has(message.author.id)) {
		await message.member.roles.add(message.guild.roles.find(role => role.name === rank));
		if(!aliasRanks.includes(rank) && !socialRanks.includes(rank)){
			const rankChannel = message.guild.channels.find(channel => channel.name === rank);
			return message.reply(`Added you to ${rankChannel} successfully.`);
		}
		else{
			return message.reply(`Added you to ${rank} successfully.`);
		}
	}

	else {
		await message.member.roles.remove(message.guild.roles.find(role => role.name === rank));
		if(!aliasRanks.includes(rank)){
			const rankChannel = message.guild.channels.find(channel => channel.name === rank);
			return message.reply(`Removed you from ${rankChannel} successfully.`);
		}
		else{
			return message.reply(`Removed you from ${rank} successfully.`);
		}
	}
};

/**
 * Sorts the channels within the 'papers' category.
 * @param {Discord.Message} message the message sent
 */
exports.organise = async function(message) {
	function isClass(word) {
		return word.charAt(5) === `1` || word.charAt(5) === `2` || word.charAt(5) === `3` || word.charAt(5) === `4`;
	}
	const channelArray = message.guild.channels.array();
	const roles = message.guild.roles.array();
	roles.filter(role => isClass(role.name));
	let oneLength = 0;
	let twoLength = 0;
	let threeLength = 0;
	let fourLength = 0;
	const oneNameArray = [];
	const twoNameArray = [];
	const threeNameArray = [];
	const fourNameArray = [];

	// places each channel into an array and sorts the array
	channelArray.forEach(function(item) {
		// if (item.parent != null)
		// if(item.parent.name === `100-level`) {
		// 	oneLength++;
		// 	oneNameArray.push(item.name);
		// }
		// else if(item.parent.name === `200-level`) {
		// 	twoLength++;
		// 	twoNameArray.push(item.name);
		// }
		// else if(item.parent.name === `300-level`) {
		// 	threeLength++;
		// 	threeNameArray.push(item.name);
		// }
		// else if(item.parent.name === `400-level`) {
		// 	fourLength++;
		// 	fourNameArray.push(item.name);
		// }
		if (item.name.charAt(5) === `1`) {
			if (item.parent.name !== `100-level`)
				item.setParent(oneCategory);
			oneLength++;
			oneNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === `2`) {
			if (item.parent.name !== `200-level`)
				item.setParent(twoCategory);
			twoLength++;
			twoNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === `3`) {
			if (item.parent.name !== `300-level`)
				item.setParent(threeCategory);
			threeLength++;
			threeNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === `4`) {
			if (item.parent.name !== `400-level`)
				item.setParent(fourCategory);
			fourLength++;
			fourNameArray.push(item.name);
		}
	});
	await oneNameArray.sort();
	await twoNameArray.sort();
	await threeNameArray.sort();
	await fourNameArray.sort();

	// if the channel is not in the same location as its sorted array location, move it.
	for (let i = 0; i < oneLength; i++)
		if (message.guild.channels.find(channel => channel.name === oneNameArray[i]).position != i)
			await message.guild.channels.find(channel => channel.name === oneNameArray[i]).setPosition(i);

	for (let i = 0; i < twoLength; i++)
		if (message.guild.channels.find(channel => channel.name === twoNameArray[i]).position != i)
			await message.guild.channels.find(channel => channel.name === twoNameArray[i]).setPosition(i);

	for (let i = 0; i < threeLength; i++)
		if (message.guild.channels.find(channel => channel.name === threeNameArray[i]).position != i)
			await message.guild.channels.find(channel => channel.name === threeNameArray[i]).setPosition(i);

	for (let i = 0; i < fourLength; i++)
		if (message.guild.channels.find(channel => channel.name === fourNameArray[i]).position != i)
			await message.guild.channels.find(channel => channel.name === fourNameArray[i]).setPosition(i);

};

/**
 * Checks if three or more users have reacted with 📌, and pins the message.
 */
client.on(`messageReactionAdd`, async reaction => {
	if (!forbiddenChannels.includes(reaction.message.channel.name))
		if (reaction.emoji.name === `📌`)
			if (reaction.count >= 3 && !reaction.message.pinned)
				await reaction.message.pin();
});

/**
 * Creates a role and channel for the course specified
 *  - Restricts it to the role created and bots
 *  - Pulls the course title from the victoria website and sets the category
 *  - Places the channel within the 'papers' category
 *  - Sorts the 'papers' category to ensure the channel is in the correct alphabetical location.
 * @param {Discord.Message} message the message sent
 * @param {string[]} args array of strings in the message
 */
exports.newRank = async function(message, args) {
	await message.guild.roles.create({
		data: {
			name: args[0],
			hoist: false,
			mentionable: false,
		},
	});
	let levelParent;
	if(args[0].charAt(5) === `1`) levelParent = oneCategory;
	else if(args[0].charAt(5) === `2`) levelParent = twoCategory;
	else if(args[0].charAt(5) === `3`) levelParent = threeCategory;
	else if(args[0].charAt(5) === `4`) levelParent = fourCategory;

	await message.guild.channels.create(args[0], {
		type: `text`,
		overwrites: [
			{
				id: message.guild.id,
				denied: [`VIEW_CHANNEL`],
			},
			{
				id: message.guild.roles.find(role => role.name === args[0]).id,
				allowed: [`VIEW_CHANNEL`],
			},
			{
				id: message.guild.roles.find(role => role.name === `bots`).id,
				allowed: [`VIEW_CHANNEL`],
			},
		],
		parent: levelParent,
	});
	await this.organise(message);


	// pull the course title and set the topic
	const name = args[0].slice(0, 4) + args[0].slice(5, args[0].length);

	const currentYear = (new Date()).getFullYear();
	const https = require(`https`);
	https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
		let data = ``;

		// Adding the data chunks to the string
		resp.on(`data`, (chunk) => {
			data += chunk;
		});

		// Parsing the string for the course title
		resp.on(`end`, () => {
			JSON.parse(data, function(key, value) {
				if (key === `title`)
					message.guild.channels.find(channel => channel.name === args[0]).setTopic(value);

			});
		});

	}).on(`error`, (err) => {
		console.log(`Error: ` + err.message);
	});
	return;
};

/**
 * Deletes the channel and/or role specified.
 * @param {Message} message the message sent
 * @param {string[]} args array of strings in the message
 */
exports.deleteRank = async function(message, args) {
	if (message.guild.roles.find(role => role.name === args[0]) != null) await message.guild.roles.find(role => role.name === args[0]).delete();
	if (message.guild.channels.find(channel => channel.name === args[0]) != null) await message.guild.channels.find(channel => channel.name === args[0]).delete();
	return;
};

