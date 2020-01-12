const index = require("../index.js");
module.exports = {
  name: "addrank",
  args: true,
  admin: true,
  log: true,
  description: "Creates a new class role and channel.",
  usage: "`!addrank <course>`",
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
    else if (!args[0].includes("-")) {
      return message.channel.send("Classes should include the `-` symbol");
    }
    else if (args[0].includes("+")) {
      return message.channel.send(
        "You cannot include the `+` symbol in a rank."
      );
    }
    else if (args[0].length !== 8) {
      return message.channel.send(
        "Classes should be 8 characters long, e.g. `engr-101`"
      );
    }
    else if (
      message.guild.roles.find(role => role.name === args[0]) != null
    ) {
      return message.channel.send(
        "Couldn't create class - role already exists."
      );
    }
    else if (
      message.guild.channels.find(role => role.name === args[0]) != null
    ) {
      return message.channel.send(
        "Couldn't create class - channel already exists."
      );
    }
    else {
      // regex to ensure that they're alphanumeric
      const letters = /^[0-9a-zA-Z]+$/;
      for (let i = 0; i < args[0].length; i++)
        if (!args[0].charAt(i).match(letters) && args[0].charAt(i) !== "-")
          return message.channel.send(
            "Classes should only be alphanumeric and contain the `-` character."
          );
      await index.newRank(message, args);
      const rankChannel = message.guild.channels.find(
        channel => channel.name === args[0]
      );
      return message.channel.send(`Created ${rankChannel} successfully.`);
    }
  }
};
