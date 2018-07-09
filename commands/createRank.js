module.exports = {
    name: 'createRank',
    args: true,
    admin: true,
    async execute(message, args){
        if (!args.length) {
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
            await message.guild.roles.create({
                data: {
                    name: args[0],
                    hoist: false,
                    mentionable: false,
                },
            });
            await message.guild.channels.create(args[0], {
                type: `text`,
                overwrites: [
                    {
                        id: message.guild.id,
                        denied: [`VIEW_CHANNEL`],
                    },
                    {
                        id: message.guild.roles.find(role => role.name === args[0]).id,
                        allowed: [`VIEW_CHANNEL`],
                    },
                    {
                        id: message.guild.roles.find(role => role.name === `bots`).id,
                        allowed: [`VIEW_CHANNEL`],
                    },
                ],
                parent: papersCategory,
            });
            await organise(message);
        
            // pull the course title to be extra af
            const name = args[0].slice(0, 4) + args[0].slice(5, args[0].length);
            const title = ``;
            const currentYear = (new Date()).getFullYear();
            const https = require(`https`);
            https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
                let data = ``;
        
                // A chunk of data has been recieved.
                resp.on(`data`, (chunk) => {
                    data += chunk;
                });
        
                // The whole response has been received. Print out the result.
                resp.on(`end`, () => {
                    JSON.parse(data, function(key, value) {
                        if (key === `title`)
                            message.guild.channels.find(channel => channel.name === args[0]).setTopic(value);
        
                    });
                });
        
            }).on(`error`, (err) => {
                console.log(`Error: ` + err.message);
            });
            console.log(title);
            return message.channel.send(`Created ${args[0]} successfully.`);
        }
    }
}