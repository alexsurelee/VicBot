const fs = require("fs");
module.exports = {
  name: "addwrapper",
  args: true,
  admin: true,
  log: true,
  description: "Adds a wrapper course.",
  usage: "`!addwrapper <wrapper> <child>`",
  async execute(message, args) {
    const filePath = __dirname + "/../data/wrappers.json";
    args[0] = args[0].toLowerCase();
    args[1] = args[1].toLowerCase();
    let wrappers;
    if (args[0][5] < args[1][5]) {
      return message.channel.send(`Are you sure you've got those the right way around?\n${args[0]} will become a wrapper for ${args[1]}`);
    }
    if(fs.existsSync(filePath)) {
      wrappers = require(filePath);
    }
    else {
      wrappers = {};
      if (!fs.existsSync(__dirname + "/../data")) {
        fs.mkdirSync(__dirname + "/../data");
      }
      fs.openSync(filePath, 'w');
    }
    wrappers[args[0]] = args[1];

    fs.writeFileSync(__dirname + "/../data/wrappers.json", JSON.stringify(wrappers));
    return message.channel.send(`Made ${args[0]} a wrapper for ${args[1]}.`);
  }
};
