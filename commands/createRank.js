module.exports = {
    name: 'createRank',
    execute(message, args){
        if (!message.member.roles.has(adminRole.id)) {
            return message.channel.send(`This requires admin permissions.`);
        }
        else if (!args.length) {
            return message.channel.send(`Please include the name of the rank you wish to create.`);
        }
    
        else if (args.length > 1) {
            return message.channel.send(`Please only include one rank to create (no spaces).`);
        }
    
        else if (!args[0].includes(`-`)) {
            return message.channel.send(`Classes should include the - symbol`);
        }
    
        else if (message.guild.roles.find(role => role.name === args[0]) != null) {
            return message.channel.send(`Couldn't create class - role already exists.`);
        }
    
        else if (message.guild.channels.find(role => role.name === args[0]) != null) {
            return message.channel.send(`Couldn't create class - channel already exists.`);
        }
    
        else {
            await newRank(message, args, papersCategory);
            return message.channel.send(`Created ${args[0]} successfully.`);
        }
    }
}