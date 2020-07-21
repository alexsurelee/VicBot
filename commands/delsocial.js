const index = require('../index');
module.exports = {
  name: "delsocial",
  args: true,
  admin: true,
  log: true,
  usage: "`!delsocial <course>`",
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
    else if (
      message.guild.roles.cache.find(role => role.name === args[0]) == null &&
			message.guild.channels.cache.find(channel => channel.name === args[0]) == null
    ) {
      return message.channel.send("Cannot find rank to delete.");
    }
    else {
      if (message.guild.roles.cache.find(role => role.name === args[0]) != null)
        await message.guild.roles.cache.find(role => role.name === args[0]).delete();
      if (
        message.guild.channels.cache.find(channel => channel.name === args[0]) != null
      )
        await message.guild.channels.cache
          .find(channel => channel.name === args[0])
          .delete();
      await index.db
        .collection("servers")
        .doc(message.guild.id)
        .update({
          socialRanks: index.admin.firestore.FieldValue.arrayRemove(args[0]),
        });
      return message.channel.send(`Deleted ${args[0]}.`);
    }
  }
};
