const index = require("../index.js");
module.exports = {
  name: "addsocial",
  args: true,
  admin: true,
  log: true,
  description: "Creates a new social rank.",
  usage: "`!addsocial <name>`",
  async execute(message, args) {
    args[0] = args[0].toLowerCase();
    if (!args.length) {
      return message.channel.send(
        "Please include the name of the rank you wish to create."
      );
    }
    else if (args.length > 1) {
      return message.channel.send(
        "Please only include one rank to create (no spaces)."
      );
    }
    else if (args[0].includes("+")) {
      return message.channel.send(
        "You cannot include the `+` symbol in a rank."
      );
    }
    else if (
      message.guild.roles.cache.find(role => role.name === args[0]) != null
    ) {
      return message.channel.send(
        "Couldn't create rank - role already exists."
      );
    }
    else if (
      message.guild.channels.cache.find(role => role.name === args[0]) != null
    ) {
      return message.channel.send(
        "Couldn't create rank - channel already exists."
      );
    }
    else {
      await index.newSocial(message, args);
      const rankChannel = message.guild.channels.cache.find(
        channel => channel.name === args[0]
      );
      return message.channel.send(`Created ${rankChannel} successfully.`);
    }
  }
};
