const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

let forbiddenRanks = [];
forbiddenRanks.push("Admins", "Vanity", "baaa-admin", "vuwbotbestbot", 
"Dyno", "Mr. Upsy, Your Lifting Friend", "Lord/Lady of Java", "Hero of the Purge", "bots", "Muted", "the-swamp");

let forbiddenChannels = [];
forbiddenChannels.push("general", "media", "memes", "bots");

client.on('ready', () => {
    client.user.setUsername("VicBot");
    client.user.setActivity('bugs, probably.', { type: 'STREAMING'});
    console.log('Ready!');
});

// actually log in
client.login(token);


// listening for messages
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let adminRole = message.guild.roles.find(role => role.name === 'Admins');
    let papersCategory = message.guild.channels.find(category => category.name === 'papers');

    // creating a rank
    if (command === 'addrank') {  
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`This requires admin permissions.`);
        }      
        else if (!args.length) {
            return message.channel.send(`Please include the name of the rank you wish to create.`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Please only include one rank to create (no spaces).`);
        }

        else if(!args[0].includes('-')){
            return message.channel.send(`Classes should include the - symbol`);
        }

        else if(message.guild.roles.find(role => role.name === args[0]) != null){
            return message.channel.send(`Couldn't create class - role already exists.`);
        }

        else if(message.guild.channels.find(role => role.name === args[0]) != null){
            return message.channel.send(`Couldn't create class - channel already exists.`);
        }

        else{
            createRank(message, args, papersCategory);
            return message.channel.send(`Created ${args[0]} successfully.`);
        }
    }

    /*
    else if(command === 'play'){
        if(message.channel.type !== 'text') return;

        const { voiceChannel } = message.member;

        if(!voiceChannel){
            return message.reply('Please join a voice channel first.');
        }
        else if(!args.length){
            return message.channel.send(`Please add a youtube link`);
        }

        else{
        voiceChannel.join().then(connection => {
            const stream = ytdl(args[0], {filter: 'audioonly' });
            const dispatcher = connection.play(stream);
            dispatcher.on('end', () => voiceChannel.leave());
        })};
    }
    */

    else if(command === 'reset'){
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`This requires admin permissions.`);
        }      
        else if (!args.length) {
            return message.channel.send(`Please include the name of the channel you wish to reset.`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Please only include one rank to reset (no spaces).`);
        }

        else if((message.guild.roles.find(role => role.name === args[0]) == null) && (message.guild.channels.find(channel => channel.name === args[0]) == null)){
            return message.channel.send(`Cannot find rank to reset.`);
        }

        else if(message.guild.channels.find(channel => channel.name === args[0]).parent !== papersCategory){
            return message.channel.send(`You can only reset channels in the papers category.`);
        }

        else if(forbiddenRanks.includes(args[0])){
            return message.channel.send(`You probably shouldn't reset this, and at the moment I'm not going to let you.`);
        }

        else{
            await deleteRank(message, args);
            await createRank(message, args, papersCategory);
        }
    }

    else if (command === 'delrank') {  
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`This requires admin permissions.`);
        }      
        else if (!args.length) {
            return message.channel.send(`Please provide a rank to delete. Type !ranks for a list.`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Please only list one rank to delete.`);
        }

        else if((message.guild.roles.find(role => role.name === args[0]) == null) && (message.guild.channels.find(channel => channel.name === args[0]) == null)){
            return message.channel.send(`Cannot find rank to delete.`);
        }

        else{
            deleteRank(message, args);
            return message.channel.send(`Deleted ${args[0]}.`);
        }
    }

    // adding or removing a rank depending on whether they have the role assigned.
    else if(command === 'rank'){
        if (!args.length) {
            return message.channel.send(`Please provide a class to join. Type !ranks for a list.`);
        }
        else{
            args.forEach(function(item, index, array){
                addRank(message, item);
            });
        }
    }

    // prints out a rank list
    else if(command === 'ranks'){
        let rankArray = message.guild.roles.array();
        let rankStringArray = new Array();
        rankArray.forEach(function(item, index, array){
            if((item.name.includes("-") && item.name.length === 8) || item.name === "ethics"){
                rankStringArray.push(item.name);
            }
        })
        rankStringArray.sort();
        let rankString = "\`\`\`\n";
        let count = 1;
        rankStringArray.forEach(function(item, index, array){
            rankString += item + `\t`;
            if(count % 3 === 0) rankString += `\n`; 
            count++;
        })
        rankString += "\n\`\`\`";
        return message.channel.send({embed: {
            color: 0x004834,
            description: rankString
        }});
    }

    // organises the papers category alphabetically
    else if(command === 'organise'){
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`This requires admin permissions.`);
        }
        else{ 
            message.react("🕦");
            await organise(message);
            // await message.reactions.sweep(new Function('return this === "🕦"'), 'this');
            await message.reactions.get("🕦").users.remove(client.id);
            await message.reactions.deleteAll();
            return message.react("✅");
        }
    }

    else if(command === 'micropad'){
        message.channel.send("<:micropad:339927818181935105> is the easy to use powerful notepad app developed by our very own Nick. Check it out at https://getmicropad.com");
    }
});

// adds user to a specified rank
async function addRank(message, rank){
    if(forbiddenRanks.includes(rank)){
        return message.channel.send(`Sorry, you cannot join ${rank}.`);
    }

    else if(message.guild.roles.find(role => role.name === rank) == null){
        return message.channel.send(`${rank} role doesn't exist. Consider asking an @admin to create it.`);
    }

    /*
    else if(message.guild.channels.find(channel => channel.name === rank) == null){
        return message.channel.send(`${rank} channel doesn't exist. Consider asking an @admin to create it.`);
    }
    */

    else if(!message.guild.roles.find(role => role.name === rank).members.has(message.author.id)){
        await message.member.roles.add(message.guild.roles.find(role => role.name === rank));
        return message.reply(`Added you to ${rank} successfully.`);
    }

    else{
        await message.member.roles.remove(message.guild.roles.find(role => role.name === rank));
        return message.reply(`Removed you from ${rank} successfully.`);
    }
}

// organises the papers category
async function organise(message){
    let channelArray = message.guild.channels.array();
    let paperLength = 0;
    let paperNameArray = [];

    channelArray.forEach(function(item, index, array){
        if(item.parent != null){
            if(item.parent.name === "papers"){
                paperLength++;
                paperNameArray.push(item.name);
            }
        }
    })
    await paperNameArray.sort();

    for(i = 0 ; i < paperLength ; i++){
        if(message.guild.channels.find(channel => channel.name === paperNameArray[i]).position != i)
            await message.guild.channels.find(channel => channel.name === paperNameArray[i]).setPosition(i);
    }
}

// checking for 3+ pin reactions to pin a message
client.on('messageReactionAdd', async reaction => {
    if(!forbiddenChannels.includes(reaction.message.channel.name)){
        if(reaction.emoji.name === "📌"){
            if(reaction.count >= 3 && !reaction.message.pinned){
                await reaction.message.pin();
            }
        }
    }
});

async function deleteRank(message, args){
    if(message.guild.roles.find(role => role.name === args[0]) != null) await message.guild.roles.find(role => role.name === args[0]).delete();
    if(message.guild.channels.find(channel => channel.name === args[0]) != null) await message.guild.channels.find(channel => channel.name === args[0]).delete();
    return;
}

async function createRank(message, args, papersCategory){
    await message.guild.roles.create({
        data: {
            name: args[0],
            hoist: false,
            mentionable: false,
        }
    });
    await message.guild.channels.create( args[0], {
        type: 'text',
        overwrites: [
        {
            id: message.guild.id,
            denied: ['VIEW_CHANNEL'],
        },
        {
            id: message.guild.roles.find(role => role.name === args[0]).id,
            allowed: ['VIEW_CHANNEL'],
        },
        {
            id: message.guild.roles.find(role => role.name === 'bots').id,
            allowed: ['VIEW_CHANNEL'],
        },
        ],
        parent: papersCategory,
    });
    await organise(message);

    // pull the course title to be extra af
    let name = args[0].slice(0, 4) + args[0].slice(5, args[0].length);
    let title = "";
    let currentYear = (new Date()).getFullYear();
    const https = require('https');
    https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        JSON.parse(data, function(key, value){
            if(key === "title"){
                message.guild.channels.find(channel => channel.name === args[0]).setTopic(value);
            }
        })
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
    console.log(title);
    return;
}

