const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  description: "VicBot Commands",
  aliases: ["commands"],
  log: false,
  usage: "`!help`",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      commands.array().forEach(function(item) {
        if (
          (message.member.hasPermission("ADMINISTRATOR") && item.admin) ||
          !item.admin
        ) {
          data.push({
            name: item.name,
            value: item.usage + "\n" + item.description
          });
        }
      });

      return message.author
        .send({
          embed: {
            color: 0x004834,
            title: this.description,
            fields: data
          }
        })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch(error => {
          message.reply(
            "it seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) return message.reply("that's not a valid command!");

    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
  }
};
