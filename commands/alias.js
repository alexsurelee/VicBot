const Discord = require("discord.js");
const index = require("../index.js");
const fs = require("fs");

module.exports = {
  name: "alias",
  args: true,
  admin: false,
  log: false,
  usage: "`!alias <alias> [alias]`",
  description: "Lists the papers allocated to an alias.",
  async execute(message, args) {
    for (let i = 0; i < args.length; i++) {
      if (!index.aliasRegex.test(args[i])) {
        message.channel.send(`${args[i]} is not an alias.`);
        continue;
      }
      let channels = "```";
      let count = 1;
      if (fs.existsSync(__dirname + "/../data/aliases.json")) {
        const aliases = require(__dirname + "/../data/aliases.json");
        const courses = aliases[args[i]];
        for(let j = 0; j < courses.length; j++) {
          channels += courses[j];
          if (count % 4 === 0) channels += "\n";
          else channels += "\t";
          count++;
        }
      }
      channels += "```";
      message.channel.send(
        new Discord.MessageEmbed().setTitle(args[i]).setDescription(channels)
      );
    }
  }
};
