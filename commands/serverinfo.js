module.exports = {
  name: "serverinfo",
  args: false,
  admin: false,
  log: true,
  description: "Display information about the current server",
  usage: "`!serverinfo`",
  async execute(message, args) {
    // If the message is in a server
    if (message.guild) {
      let admins = "";
      message.guild.members.array().forEach(member => {
        if (member.hasPermission("ADMINISTRATOR")) {
          admins += member.displayName + ", ";
        }
      });
      admins = admins.slice(0, admins.lastIndexOf(","));
      const embed = {
        embed: {
          color: 3447003,
          title: message.guild.name,
          thumbnail: {
            url: message.guild.iconURL()
          },
          fields: [
            {
              name: "Admins",
              value: admins
            },
            {
              name: "Creation Date",
              value: `${message.guild.createdAt.toDateString()} at ${message.guild.createdAt.toTimeString()}`
            },
            {
              name: "Channel Count",
              value: message.guild.channels.size
            },
            {
              name: "Member Count",
              // Filter the members list to only include non-bots
              value: message.guild.members.filter(member => !member.user.bot)
                .size
            },
            {
              name: "Bot Count",
              // Filter the list to only include bots
              value: message.guild.members.filter(member => member.user.bot)
                .size
            }
          ],
          timestamp: new Date(),
          footer: {
            text: `ID: ${message.guild.id}`
          }
        }
      };
      return message.channel.send(embed);
    }
    else {
      // The message was sent in a DM, can't retrieve the server info
      return message.reply(
        "Looks like you didn't send this message from a server"
      );
    }
  }
};
