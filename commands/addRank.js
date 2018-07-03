module.exports = {
    name: 'addRank',
    execute(message, rank){
        if(forbiddenRanks.includes(rank)){
            return message.channel.send(`Sorry, you cannot join ${rank}.`);
        }
    
        else if(message.guild.roles.find(role => role.name === rank) == null){
            return message.channel.send(`${rank} role doesn't exist. Consider asking an @admin to create it.`);
        }
    
        else if(!message.guild.roles.find(role => role.name === rank).members.has(message.author.id)){
            await message.member.roles.add(message.guild.roles.find(role => role.name === rank));
            return message.reply(`Added you to ${rank} successfully.`);
        }
    
        else{
            await message.member.roles.remove(message.guild.roles.find(role => role.name === rank));
            return message.reply(`Removed you from ${rank} successfully.`);
        }
    }
}