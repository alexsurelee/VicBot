const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

let forbiddenRanks = [];
forbiddenRanks.push("Admins", "Vanity", "baaa-admin", "vuwbotbestbot", 
"Dyno", "Mr. Upsy, Your Lifting Friend", "Lord/Lady of Java", "Hero of the Purge", "bots", "Muted", "the-swamp");

let forbiddenChannels = [];
forbiddenChannels.push("general", "media", "memes", "bots");

client.on('ready', () => {
    client.user.setUsername("VicBot");
    client.user.setActivity('Bugs by SaltySheep', { type: 'LISTENING'});
    console.log('Ready!');
});
// actually log in
client.login(token);


// listening for messages
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    let adminRole = message.guild.roles.find("name", "Admins");
    let papersCategory = message.guild.channels.find("name", "papers");

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

        else if(message.guild.roles.find("name", args[0]) != null){
            return message.channel.send(`Couldn't create class - role already exists.`);
        }

        else if(message.guild.channels.find("name", args[0]) != null){
            return message.channel.send(`Couldn't create class - channel already exists.`);
        }

        else{
            createRank(message, args, papersCategory);
            return message.channel.send(`Created ${args[0]} successfully.`);
        }
    }

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


        else if((message.guild.roles.find("name", args[0]) == null) && (message.guild.channels.find("name", args[0]) == null)){
            return message.channel.send(`Cannot find rank to reset.`);
        }

        else if(message.guild.channels.find("name", args[0]).parent !== papersCategory){
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

        else if((message.guild.roles.find("name", args[0]) == null) && (message.guild.channels.find("name", args[0]) == null)){
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
    
        else if(args.length > 1){
            return message.channel.send(`Please only include one class.`);
        }

        else if(forbiddenRanks.includes(args[0])){
            return message.channel.send(`Sorry, you cannot add this rank.`);
        }

        else if(message.guild.roles.find("name", args[0]) == null){
            return message.channel.send(`Role doesn't exist. Consider asking an @admin to create it.`);
        }

        else if(message.guild.channels.find("name", args[0]) == null){
            return message.channel.send(`Channel doesn't exist. Consider asking an @admin to create it.`);
        }

        else if(!message.guild.roles.find("name", args[0]).members.has(message.author.id)){
            await message.member.addRole(message.guild.roles.find("name", args[0]));
            return message.reply(`Added you to ${args[0]} successfully.`);
        }

        else{
            await message.member.removeRole(message.guild.roles.find("name", args[0]));
            return message.reply(`Removed you from ${args[0]} successfully.`);
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
        // return message.channel.send(rankString);
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
            return organise(message);
        }
    }
});

// organises the papers category
async function organise(message){
    let channelArray = message.guild.channels.array();
    let paperLength = 0;
    let paperNameArray = [];

    channelArray.forEach(function(item, index, array){
        console.log(`name: ${item.name}`)
        if(item.parent != null){
            if(item.parent.name === "papers"){
                paperLength++;
                paperNameArray.push(item.name);
                console.log(`if it's in papers: ${item.name}`);
            }
        }
        console.log(`parent name: ${item.parent}`)
    })
    console.log(`\n`);
    await paperNameArray.sort();
    paperNameArray.forEach(function(item, index, array){
        console.log(item);
    })
    for(i = 0 ; i < paperLength ; i++){
        //if(message.guild.channels.find("name", paperNameArray[i]).position != i)
            await message.guild.channels.find("name", paperNameArray[i]).setPosition(i);
    }
    message.channel.send("Sorted, hopefully.");
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
    if(message.guild.roles.find("name", args[0]) != null) await message.guild.roles.find("name", args[0]).delete();
            if(message.guild.channels.find("name", args[0]) != null) await message.guild.channels.find("name", args[0]).delete();
            return;
}

async function createRank(message, args, papersCategory){
    await message.guild.createRole({
        name: args[0],
        hoist: false,
        mentionable: false,
    });
    await message.guild.createChannel(args[0], "text", [{
        id: message.guild.id,
        deny: ['READ_MESSAGES'],
    },
    {
        id: message.guild.roles.find("name", args[0]).id,
        allow: ['READ_MESSAGES'],
    },
    {
        id: message.guild.roles.find("name", "bots").id,
        allow: ['READ_MESSAGES'],
    }
    ]);
    await message.guild.channels.find("name", args[0]).setParent(papersCategory);


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
                message.guild.channels.find("name", args[0]).setTopic(value);
            }
        })
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
    console.log(title);

    return;
}

