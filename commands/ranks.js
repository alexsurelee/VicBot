module.exports = {
    name: 'ranks',
    execute(message){
        const rankArray = message.guild.roles.array();
    const paperStringArray = new Array();
    const aliasStringArray = new Array();
    const socialStringArray = new Array();
    rankArray.forEach(function(item) {
        if (item.name.includes(`-`) && item.name.length === 8 && socialRanks.indexOf(item.name) === -1 && aliasRanks.indexOf(item.name) === -1)
            paperStringArray.push(item.name);

        else if (aliasRanks.indexOf(item.name) !== -1)
            aliasStringArray.push(item.name);

        else if (socialRanks.indexOf(item.name) !== -1)
            socialStringArray.push(item.name);

    });
    paperStringArray.sort(); socialStringArray.sort(); aliasStringArray.sort();
    let paperString = `\`\`\`\n`; let socialString = `\`\`\`\n`; let aliasString = `\`\`\`\n`;
    let count = 1;
    paperStringArray.forEach(function(item) {
        paperString += item;
        if (count % 4 === 0) paperString += `\n`; else paperString += `\t`;
        count++;
    });
    paperString += `\n\`\`\``;
    count = 1;
    socialStringArray.forEach(function(item) {
        socialString += item;
        if (count % 4 === 0) socialString += `\n`; else socialString += `\t`;
        count++;
    });
    socialString += `\n\`\`\``;
    count = 1;
    aliasStringArray.forEach(function(item) {
        aliasString += item;
        if (count % 4 === 0) aliasString += `\n`; else aliasString += `\t`;
        count++;
    });
    aliasString += `\n\`\`\``;

    return message.channel.send({
        embed: {
            color: 0x004834,
            title: `Ranks`,
            fields: [{
                name: `Papers`,
                value: paperString,
            },
            {
                name: `Social`,
                value: socialString,
            },
            {
                name: `Aliases`,
                value: aliasString,
            }],
        },
    });
}