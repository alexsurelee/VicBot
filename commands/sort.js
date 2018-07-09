module.exports = {
    name: 'sort',
    admin: true,
    async execute(message){
        message.react(`🕦`);
        await organise(message);
        // await message.reactions.sweep(reac => reac.emoji.toString() === "🕦");
        // await message.reactions.get("🕦").users.remove(client.id);
        await message.reactions.deleteAll();
        return message.react(`✅`);
    }
}