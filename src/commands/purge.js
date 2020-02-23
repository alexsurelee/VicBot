module.exports = {
  name: "purge",
  args: true,
  admin: true,
  log: true,
  description: "Deletes the previous x messages.",
  usage: "`!purge <number of messages>`",
  async execute(message, args) {
    if (isNaN(args[0]))
      return message.channel.send(
        "Please specify a number of messages to purge."
      );
    const delNum = parseInt(args[0]) > 99 ? 100 : (parseInt(args[0]) + 1);
    return message.channel.bulkDelete(delNum);
  }
};
