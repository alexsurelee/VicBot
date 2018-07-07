module.exports = {
    name: 'alias',
    execute(message, args){
        if (!args.length) {
            return message.channel.send(`Adds or removes accordingly the channels available to a given rank, e.g. \`!alias swen-2018 comp-102 comp-103\``);
        }
        else if (!message.member.roles.has(adminRole.id)) {
            return message.channel.send(`This requires admin permissions.`);
        }
        else if (message.guild.roles.find(role => role.name === args[0]) == null) {
            return message.channel.send(`Couldn't find ${args[0]}`);
        }
        else if (aliasRanks.indexOf(args[0]) === -1) {
            return message.channel.send(`${args[0]} is not an appropriate rank.`);
        }
        else {
            const role = message.guild.roles.find(role => role.name === args[0]);
            for (let i = 1; i < args.length; i++)
                await superRankSet(message, role, args[i]);
    
        }
    }
}