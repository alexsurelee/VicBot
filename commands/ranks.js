module.exports = {
    name: 'ranks',
    description: 'List the available user ranks.',
    execute(message, args){
        let rankArray = message.guild.roles.array();
        let rankStringArray = new Array();
        rankArray.forEach(function(item, index, array){
            if((item.name.includes("-") && item.name.length === 8) || item.name === "ethics"){
                rankStringArray.push(item.name);
            }
        })
        rankStringArray.sort();
        let rankString = "\`\`\`\n";
        let count = 1;
        rankStringArray.forEach(function(item, index, array){
            rankString += item + `\t`;
            if(count % 3 === 0) rankString += `\n`; 
            count++;
        })
        rankString += "\n\`\`\`";
        return message.channel.send({embed: {
            color: 0x004834,
            description: rankString
        }});
    },
};