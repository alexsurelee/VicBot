/* global Map, require */
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const { Util } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
let prefix = process.env.PREFIX;
let token = process.env.TOKEN;
let googleApiKey = process.env.GOOGLE_API_KEY;
try{
	if(fs.existsSync('./botConfig.json')) {
		const {PREFIX, TOKEN, GOOGLE_API_KEY} = require('./botConfig.json');
		if(!prefix) {
			prefix = PREFIX;
		}
		if(!token) {
			token = TOKEN;
		}
		if(!googleApiKey) {
			googleApiKey = GOOGLE_API_KEY;
		}
	}
}
catch(err) {
	console.error(err);
}
const youtube = new YouTube(googleApiKey);
const queue = new Map();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const { forbiddenRanks, socialRanks, adminRank, username, logChannel } = require('./config.json');
let oneCategory;
let twoCategory;
let threeCategory;
let fourCategory;
let adminRole;

client.on('ready', () => {
	client.user.setUsername(username);
	client.user.setActivity(`${prefix}help | tinyurl.com/VicBot`, { type: 'PLAYING' });
	console.log(`Instance started at ${new Date()}\n`);
});

// preventing some errors from killing the whole thing
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
process.on('unhandledError', error => console.error(`Unhandled Error:\n${error}`));
client.on('disconnect', error => console.error(`Disconnected! \n${error}`));
client.on('error', console.error);

/**
 *
 */
client.on('message', async message => {
	// redirecting old commands
	if(!message.content.startsWith(prefix) && message.content.startsWith(';rank'))
		return message.channel.send(`Please use "${prefix}rank".`);

	// limiting to predefined PREFIX
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	adminRole = message.guild.roles.find(role => role.name === adminRank);
	oneCategory = message.guild.channels.find(category => category.name === '100-level');
	twoCategory = message.guild.channels.find(category => category.name === '200-level');
	threeCategory = message.guild.channels.find(category => category.name === '300-level');
	fourCategory = message.guild.channels.find(category => category.name === '400-level');


	// checking to ensure the command or an alias of the command exists
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) return;

	if (command.admin && (!message.member.roles.has(adminRole.id) && !message.member.hasPermission('ADMINISTRATOR')))
		return message.channel.send('This requires admin permissions.');

	if(command.args && !args.length){
		let reply = 'Please include the appropriate arguments';

		if(command.usage)
			reply += `\ne.g.: \`${command.usage}\``;

		return message.reply(reply);
	}

	try{
		command.execute(message, args);
		if(command.log) {
			this.log(commandName, message);
		}
	}
	catch(error){
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

/**
 *
 */
client.on('guildMemberAdd', async member => {
	const embed = new Discord.MessageEmbed()
		.setAuthor('Member Joined', member.user.displayAvatarURL())
		.setDescription(`${member} ${member.user.tag}`)
		.setFooter(`ID: ${member.user.id}`)
		.setColor('GREEN')
		.setTimestamp();
	member.guild.channels.find(channel => channel.name === logChannel).send(embed);
});

client.on('guildMemberRemove', async member => {
	const embed = new Discord.MessageEmbed()
		.setAuthor('Member Left', member.user.displayAvatarURL())
		.setDescription(`${member} ${member.user.tag}`)
		.setFooter(`ID: ${member.user.id}`)
		.setColor('RED')
		.setTimestamp();
	member.guild.channels.find(channel => channel.name === logChannel).send(embed);
});

/**
 *
 */
client.on('voiceStateUpdate', async (oldState, newState) => {
	const voiceRole = newState.guild.roles.find(role => role.name === 'inVoice');
	if(newState.channel) {
		newState.member.roles.add(voiceRole);
	}
	else {
		newState.member.roles.remove(voiceRole);
	}
});

/**
 * Checks against permissions and forbidden roles, then adds or removes the role from the user which sent the message.
 * @param {Discord.Message} message the message sent
 * @param {string} rank the rank to be added or removed
 */
exports.rank = async function(message, rank) {
	const aliasRegex = /^\w\w\w\w-\d\d\d\d$/;
	if(/^[a-zA-Z]{4}[1-4]\d\d$/.test(rank))
		rank = rank.slice(0, 4) + '-' + rank.slice(4, 7);

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
		if(!aliasRegex.test(rank) && !socialRanks.includes(rank)){
			const rankChannel = message.guild.channels.find(channel => channel.name === rank);
			return message.reply(`Added you to ${rankChannel} successfully.`);
		}
		else{
			return message.reply(`Added you to ${rank} successfully.`);
		}
	}

	else {
		await message.member.roles.remove(message.guild.roles.find(role => role.name === rank));
		if(!aliasRegex.test(rank)){
			const rankChannel = message.guild.channels.find(channel => channel.name === rank);
			return message.reply(`Removed you from ${rankChannel} successfully.`);
		}
		else{
			return message.reply(`Removed you from ${rank} successfully.`);
		}
	}
};

/**
 * Logs the use of the command in the log channel.
 * @param {string} commandName name of the command used
 * @param {Discord.Message} message the message sent
 */
exports.log = async function(commandName, message) {
	const commandChannel = message.guild.channels.find(channel => channel.name === message.channel.name);
	const embed = new Discord.MessageEmbed()
		.setAuthor(message.author.tag, message.author.avatarURL())
		.setDescription(`Used \`${commandName}\` command in ${commandChannel}\n${message.cleanContent}`)
		.setTimestamp();
	message.guild.channels.find(channel => channel.name === logChannel).send(embed);
};

/**
 * Sorts the channels within the 'papers' category.
 * @param {Discord.Message} message the message sent
 */
exports.organise = async function(message) {
	const isClass = (word) => word.charAt(5) === '1' || word.charAt(5) === '2' || word.charAt(5) === '3' || word.charAt(5) === '4';

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
	channelArray.forEach( (item) => {
		if (item.name.charAt(5) === '1') {
			if (item.parent.name !== '100-level')
				item.setParent(oneCategory);
			oneLength++;
			oneNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === '2') {
			if (item.parent.name !== '200-level')
				item.setParent(twoCategory);
			twoLength++;
			twoNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === '3') {
			if (item.parent.name !== '300-level')
				item.setParent(threeCategory);
			threeLength++;
			threeNameArray.push(item.name);
		}
		else if (item.name.charAt(5) === '4') {
			if (item.parent.name !== '400-level')
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
client.on('messageReactionAdd', async reaction => {
	if (reaction.emoji.name === '📌')
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
	if(args[0].charAt(5) === '1') levelParent = oneCategory;
	else if(args[0].charAt(5) === '2') levelParent = twoCategory;
	else if(args[0].charAt(5) === '3') levelParent = threeCategory;
	else if(args[0].charAt(5) === '4') levelParent = fourCategory;

	await message.guild.channels.create(args[0], {
		type: 'text',
		permissionOverwrites: [
			{
				id: message.guild.id,
				deny: ['VIEW_CHANNEL'],
			},
			{
				id: message.guild.roles.find(role => role.name === args[0]).id,
				allow: ['VIEW_CHANNEL'],
			},
			{
				id: message.guild.roles.find(role => role.name === 'bots').id,
				allow: ['VIEW_CHANNEL'],
			},
		],
		parent: levelParent,
	});
	await this.organise(message);


	// pull the course title and set the topic
	const name = args[0].slice(0, 4) + args[0].slice(5, args[0].length);

	const currentYear = (new Date()).getFullYear();
	const https = require('https');
	https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
		let data = '';

		// Adding the data chunks to the string
		resp.on('data', (chunk) => {
			data += chunk;
		});

		// Parsing the string for the course title
		resp.on('end', () => {
			JSON.parse(data, function(key, value) {
				if (key === 'title')
					message.guild.channels.find(channel => channel.name === args[0]).setTopic(value);

			});
		});

	}).on('error', (err) => {
		console.log('Error: ' + err.message);
	});
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

/**
 *
 * @param {Discord.TextChannel} channel
 * @returns {Promise<boolean>}
 *
 */
exports.isPaper = function(channel) {
	if(!channel.parent) return false;
	if(channel.type !== 'text') return false;

	return channel.parent.name === '100-level' || channel.parent.name === '200-level'
	|| channel.parent.name === '300-level' || channel.parent.name === '400-level';
};

/**
 *
 * @param code
 * @param i
 * @param j
 * @param k
 * @param message
 * @returns {Promise<void>}
 */
exports.getCourse = async function(code, i, j, k, message) {
	const https = require('https');
	const name = code+i+j+k;
	const currentYear = (new Date()).getFullYear();
	const index = require('./index.js');
	https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
		let data = '';

		// Adding the data chunks to the string
		resp.on('data', (chunk) => {
			data += chunk;
		});


		// Parsing the string for the course title
		resp.on('end', () => {
			JSON.parse(data, function(key, value) {
				if (key === 'id' && value && /^[a-zA-Z]{4}[1-4]\d\d$/.test(value)){
					const hyphenatedName = value.slice(0, 4) + '-' + value.slice(4, 7);
					const arrayRank = [hyphenatedName];
					if(!message.guild.channels.find(channel => channel.name === hyphenatedName)) index.newRank(message, arrayRank);
				}
			});
		});

	}).on('error', (err) => {
		console.log('Error: ' + err.message);
	});
};

/**
 * Returns the current queue object so it can be utilised by command methods.
 * @param id guild id
 * @returns {any}
 */
exports.getQueue = function(id) {
	return queue.get(id);
};

/**
 *
 * @param message
 * @param args
 * @returns {Promise<*>}
 */
exports.playSong = async function(message, args) {
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const searchString = args.slice(0).join(' ');
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT')) {
		return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
	}
	if (!permissions.has('SPEAK')) {
		return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
	}

	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id);
			await handleVideo(video2, message, voiceChannel, true);
		}
		return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
	}
	else {
		let response;
		let video;
		try {
			video = await youtube.getVideo(url);
		}
		catch (error) {
			try {
				const videos = await youtube.searchVideos(searchString, 10);
				let index = 0;
				message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
				try {
					response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
						max: 1,
						time: 10000,
						errors: ['time']
					});
				}
				catch (err) {
					console.error(err);
					return message.channel.send('No or invalid value entered, cancelling video selection.');
				}
				const videoIndex = parseInt(response.first().content);
				video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			}
			catch (err) {
				console.error(err);
				return message.channel.send('🆘 I could not obtain any search results.');
			}
		}
		return handleVideo(video, message, voiceChannel);
	}
};

/**
 *
 * @param video
 * @param msg
 * @param voiceChannel
 * @param playlist
 * @returns {Promise<*>}
 */
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			queueConstruct.connection = await voiceChannel.join();
			play(msg.guild, queueConstruct.songs[0]);
		}
		catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	}
	else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

/**
 *
 * @param guild
 * @param song
 */
function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

client.login(token);
