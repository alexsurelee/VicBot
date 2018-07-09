module.exports = {
    name: 'deleteRank',
    args: true,
    admin: true,
    async execute(message, args){
        if (message.guild.roles.find(role => role.name === args[0]) != null) await message.guild.roles.find(role => role.name === args[0]).delete();
        if (message.guild.channels.find(channel => channel.name === args[0]) != null) await message.guild.channels.find(channel => channel.name === args[0]).delete();
        return;
    }
}