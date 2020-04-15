const { forbiddenRanks } = require("../config.json");
const index = require("../index.js");

module.exports = {
  name: "reset",
  admin: true,
  args: true,
  description: "Resets the channel and role for a course.",
  usage: "`!reset <course>`",
  log: true,
  async execute(message, args) {
    if (!args.length) {
      return message.channel.send(
        "Please include the name of the channel you wish to reset."
      );
    }
    else if (args.length > 1) {
      return message.channel.send(
        "Please only include one rank to reset (no spaces)."
      );
    }
    else if (
      message.guild.roles.cache.find(role => role.name === args[0]) == null &&
      message.guild.channels.cache.find(channel => channel.name === args[0]) == null
    ) {
      return message.channel.send("Cannot find rank to reset.");
    }
    else if (!/^[a-zA-Z]{4}-[1-4]\d\d$/.test(args[0])) {
      return message.channel.send("This doesn't look like a course channel to me.");
    }
    else {
      const channel = message.guild.channels.cache.find(
        channel => channel.name === args[0]
      );
      if (channel != null) await channel.delete();
      await index.newRank(message, args);
      return message.channel.send(`Reset ${args[0]}.`);
    }
  }
};
