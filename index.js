const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

let forbiddenRanks = [];
forbiddenRanks.push("Admins", "Vanity", "baaa-admin", "vuwbotbestbot", "Dyno", "Mr. Upsy, Your Lifting Friend", "Lord/Lady of Java", "Hero of the Purge", "bots", "Muted");

let forbiddenChannels = [];
forbiddenChannels.push("general", "media", "memes", "bots");

client.on('ready', () => {
    console.log('Ready!');
});


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
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Should only contain one argument.`);
        }

        else if(!args[0].includes('-')){
            return message.channel.send(`Channels/ranks should include the - symbol`);
        }

        else if(message.guild.roles.find("name", args[0]) != null){
            return message.channel.send(`Role already exists!`);
        }

        else if(message.guild.channels.find("name", args[0]) != null){
            return message.channel.send(`Channel already exists!`);
        }

        else{
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

            // sort the thing now that you've added a role
            await organise(message);
            return message.channel.send(`Created ${args[0]}.`);
        }
    }

    else if (command === 'delrank') {  
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`This requires admin permissions.`);
        }      
        else if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Should only contain one argument.`);
        }

        else if(!args[0].includes('-')){
            return message.channel.send(`Channels/ranks should include the - symbol`);
        }

        else if(message.guild.roles.find("name", args[0]) == null){
            return message.channel.send(`Role doesn't exist!`);
        }

        else if(message.guild.channels.find("name", args[0]) == null){
            return message.channel.send(`Channel doesn't exist!`);
        }

        else{
            await message.guild.roles.find("name", args[0]).delete();
            await message.guild.channels.find("name", args[0]).delete();
            return message.channel.send(`Deleted ${args[0]}.`);
        }
    }

    // adding or removing a rank depending on whether they have the role assigned.
    else if(command === 'rank'){
        if (!args.length) {
            return message.channel.send(`You didn't provide a class to join!`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Should only contain one class.`);
        }

        else if(forbiddenRanks.includes(args[0])){
            return message.channel.send(`You cannot add this rank.`);
        }

        else if(message.guild.roles.find("name", args[0]) == null){
            return message.channel.send(`Role doesn't exist! If this isn't a typo, ask an admin to create it!`);
        }

        else if(message.guild.channels.find("name", args[0]) == null){
            return message.channel.send(`Channel doesn't exist! If this isn't a typo, ask an admin to create it!`);
        }

        else if(!message.guild.roles.find("name", args[0]).members.has(message.author.id)){
            await message.member.addRole(message.guild.roles.find("name", args[0]));
            return message.reply(`Added you to ${args[0]} successfully!`);
        }

        else{
            await message.member.removeRole(message.guild.roles.find("name", args[0]));
            return message.reply(`Removed you from ${args[0]} successfully!`);
        }
    }

    // prints out a rank list
    //TODO: Make it pretty.
    else if(command === 'ranks'){
        let rankArray = message.guild.roles.array();
        let rankString = "";
        rankArray.forEach(function(item, index, array){
            if(item.name.includes("-")) rankString += item.name + `\n`;
        })
        return message.channel.send(rankString);
    }

    // organises the papers category alphabetically
    else if(command === 'organise'){
       return organise(message);
    }
});

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
        await message.guild.channels.find("name", paperNameArray.shift()).setPosition(i);
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

// actually log in
client.login(token);