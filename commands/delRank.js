module.exports = {
    name: `delRank`,
    execute(message, args){
        if (!message.member.roles.has(adminRole.id)) {
            return message.channel.send(`This requires admin permissions.`);
        }
        else if (!args.length) {
            return message.channel.send(`Please provide a rank to delete. Type !ranks for a list.`);
        }

        else if (args.length > 1) {
            return message.channel.send(`Please only list one rank to delete.`);
        }

        else if ((message.guild.roles.find(role => role.name === args[0]) == null) && (message.guild.channels.find(channel => channel.name === args[0]) == null)) {
            return message.channel.send(`Cannot find rank to delete.`);
        }

        else {
            deleteRank(message, args);
            return message.channel.send(`Deleted ${args[0]}.`);
        }
    },
};