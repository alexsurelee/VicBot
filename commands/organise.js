module.exports = {
    name: `organise`,
    args: false,
    admin: true,
    async execute(message, args){
        const channelArray = message.guild.channels.array();
        let paperLength = 0;
        const paperNameArray = [];

        channelArray.forEach(function(item) {
            if (item.parent != null){
                if (item.parent.name === `papers`) {
                    paperLength++;
                    paperNameArray.push(item.name);
                }
            }
    });

        await paperNameArray.sort();

        for (let i = 0; i < paperLength; i++)
            if (message.guild.channels.find(channel => channel.name === paperNameArray[i]).position != i)
                await message.guild.channels.find(channel => channel.name === paperNameArray[i]).setPosition(i);    
    },
};