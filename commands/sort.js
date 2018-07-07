module.exports = {
    name: 'sort',
    execute(message){
        if (!message.member.roles.has(adminRole.id)) {
            return message.channel.send(`This requires admin permissions.`);
        }
        else {
            message.react(`🕦`);
            await organise(message);
            // await message.reactions.sweep(reac => reac.emoji.toString() === "🕦");
            // await message.reactions.get("🕦").users.remove(client.id);
            await message.reactions.deleteAll();
            return message.react(`✅`);
        }
    }
}