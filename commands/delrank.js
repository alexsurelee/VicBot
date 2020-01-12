module.exports = {
  name: "delrank",
  args: true,
  admin: true,
  log: true,
  usage: "`!delrank <course>`",
  description: "Deletes a class's role and channel.",
  async execute(message, args) {
    args[0] = args[0].toLowerCase();
    if (!args.length) {
      return message.channel.send(
        "Please provide a rank to delete. Type !ranks for a list."
      );
    }
    else if (args.length > 1) {
      return message.channel.send("Please only list one rank to delete.");
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
      message.guild.roles.find(role => role.name === args[0]) == null &&
      message.guild.channels.find(channel => channel.name === args[0]) == null
    ) {
      return message.channel.send("Cannot find rank to delete.");
    }
    else {
      if (message.guild.roles.find(role => role.name === args[0]) != null)
        await message.guild.roles.find(role => role.name === args[0]).delete();
      if (
        message.guild.channels.find(channel => channel.name === args[0]) != null
      )
        await message.guild.channels
          .find(channel => channel.name === args[0])
          .delete();
      return message.channel.send(`Deleted ${args[0]}.`);
    }
  }
};
