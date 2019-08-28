module.exports = {
  name: "micropad",
  args: false,
  usage: "`!micropad`",
  log: false,
  description: "Provides information about micropad.",
  async execute(message) {
    message.channel.send(
      "<:micropad:339927818181935105> is the easy to use powerful notepad app developed by our very own Nick. Check it out at https://getmicropad.com"
    );
  }
};
