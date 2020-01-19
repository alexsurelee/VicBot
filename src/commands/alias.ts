import { MessageEmbed } from "discord.js";

module.exports = {
  name: "alias",
  args: true,
  admin: false,
  log: false,
  usage: "`!alias <alias>`",
  description: "Lists the papers allocated to an alias.",
  async execute(message, args) {
    const aliasRegex = /^\d{3}-level$/;
    for (let i = 0; i < args.length; i++) {
      if (!message.guild.roles.some(role => role.name === args[i])) {
        message.channel.send(`Couldn't find ${args[i]}`);
        continue;
      }
      if (!aliasRegex.test(args[i])) {
        message.channel.send(`${args[0]} is not an alias.`);
        continue;
      }
      const role = message.guild.roles.find(role => role.name === args[i]);
      let channels = "```";
      let count = 1;
      message.guild.channels.array().forEach(channel => {
        if (role.permissionsIn(channel).has("VIEW_CHANNEL")) {
          if (index.isPaper(channel)) {
            channels += channel.name;
            if (count % 4 === 0) channels += "\n";
            else channels += "\t";
            count++;
          }
        }
      });
      channels += "```";
      message.channel.send(
        new MessageEmbed().setTitle(args[i]).setDescription(channels)
      );
    }
  }
};
