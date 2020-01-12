const Discord = require("discord.js");
const { socialRanks } = require("../config.json");

module.exports = {
  name: "ranks",
  args: false,
  admin: false,
  description: "List the available user ranks.",
  usage: "`!ranks`",
  log: false,
  execute: async function(message) {
    const roleArray = message.guild.roles.array();
    const firstYearArray = [];
    const secondYearArray = [];
    const thirdYearArray = [];
    const fourthYearArray = [];
    const aliasStringArray = [];
    const socialStringArray = [];
    const rankRegex = /^\w\w\w\w-\d\d\d$/;
    const aliasRegex = /^\d{3}-level$/;
    roleArray.forEach(role => {
      if (rankRegex.test(role.name)) {
        const c = role.name.charAt(5);
        if (c === "1") {
          firstYearArray.push(role.name);
        }
        else if (c === "2") {
          secondYearArray.push(role.name);
        }
        else if (c === "3") {
          thirdYearArray.push(role.name);
        }
        else if (c === "4") fourthYearArray.push(role.name);
      }
      else if (aliasRegex.test(role.name)) {
        aliasStringArray.push(role.name);
      }
      else if (socialRanks.indexOf(role.name) !== -1) {
        socialStringArray.push(role.name);
      }
    });
    firstYearArray.sort();
    secondYearArray.sort();
    thirdYearArray.sort();
    fourthYearArray.sort();
    socialStringArray.sort();
    aliasStringArray.sort();
    let firstYearString = "```\n";
    let secondYearString = "```\n";
    let thirdYearString = "```\n";
    let fourthYearString = "```\n";
    let socialString = "```\n";
    let aliasString = "```\n";
    let count = 1;
    firstYearArray.forEach(role => {
      firstYearString += role;
      if (count % 4 === 0) firstYearString += "\n";
      else firstYearString += "\t";
      count++;
    });
    firstYearString += "\n```";
    count = 1;
    secondYearArray.forEach(role => {
      secondYearString += role;
      if (count % 4 === 0) secondYearString += "\n";
      else secondYearString += "\t";
      count++;
    });
    secondYearString += "\n```";
    count = 1;
    thirdYearArray.forEach(role => {
      thirdYearString += role;
      if (count % 4 === 0) thirdYearString += "\n";
      else thirdYearString += "\t";
      count++;
    });
    thirdYearString += "\n```";
    count = 1;
    fourthYearArray.forEach(role => {
      fourthYearString += role;
      if (count % 4 === 0) fourthYearString += "\n";
      else fourthYearString += "\t";
      count++;
    });
    fourthYearString += "\n```";
    count = 1;
    socialStringArray.forEach(item => {
      socialString += item;
      if (count % 4 === 0) socialString += "\n";
      else socialString += "\t";
      count++;
    });
    socialString += "\n```";
    count = 1;
    aliasStringArray.forEach(item => {
      aliasString += item;
      if (count % 4 === 0) aliasString += "\n";
      else aliasString += "\t";
      count++;
    });
    aliasString += "\n```";

    const firstAndSecond = new Discord.MessageEmbed()
      .setTitle("Papers")
      .addField(
        "Usage",
        "You can add and/or remove multiple ranks in one `!rank` command \ne.g. `!rank <course> [course ...]` \ne.g. `!rank engr123` \ne.g. `!rank engr123 comp103 engr101`",
        false
      )
      .addField("First Year", firstYearString, true)
      .addField("Second Year", secondYearString, true);

    const thirdAndFourth = new Discord.MessageEmbed()
      .addField("Third Year", thirdYearString, true)
      .addField("Fourth Year", fourthYearString, true);

    const socialAndOthers = new Discord.MessageEmbed()
      .addField(
        "Social",
        "Opt-in or out channels for particular social settings.\n" +
          socialString
      )
      .addField(
        "Aliases",
        "Global roles that will automatically place you in the default papers for your major, for that year of study.\n" +
          aliasString
      );

    message.channel.send(firstAndSecond);
    message.channel.send(thirdAndFourth);
    return message.channel.send(socialAndOthers);
  }
};
