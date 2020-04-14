module.exports = {
  name: "flip",
  args: false,
  admin: false,
  log: false,
  usage: "`!flip`",
  description: "Flips a coin.",
  async execute(message, args) {
    return message.channel.send(Math.random() > 0.5 ? "heads" : "tails");
  }
};