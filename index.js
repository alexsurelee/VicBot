const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

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

    if (command === 'addclass') {  
        if(!message.member.roles.has(adminRole.id)){
            return message.channel.send(`Gotta be an admin fam`);
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
            }]);
            await message.guild.channels.find("name", args[0]).setParent(papersCategory);
            return message.channel.send(`Success!`);
        }
    }

    else if(command === 'class'){
        if (!args.length) {
            return message.channel.send(`You didn't provide a class to join!`);
        }
    
        else if(args.length > 1){
            return message.channel.send(`Should only contain one class.`);
        }

        else if(!args[0].includes('-')){
            return message.channel.send(`Classes should include the - symbol`);
        }

        else if(message.guild.roles.find("name", args[0]) == null){
            return message.channel.send(`Role doesn't exist! If this isn't a typo, ask an admin to create it!`);
        }

        else if(message.guild.channels.find("name", args[0]) == null){
            return message.channel.send(`Channel doesn't exist! If this isn't a typo, ask an admin to create it!`);
        }

        else{
            await message.member.addRole(message.guild.roles.find("name", args[0]));
            return message.reply(`Added you to ${args[0]} successfully!`);
        }
    }
});


// actually log in
client.login(token);