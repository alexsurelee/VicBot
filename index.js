/* eslint-disable no-console */
/* global Map, require */
const Discord = require("discord.js");
const fs = require("fs");
const download = require('download-file'); // fetching exam data
const xlsx = require('xlsx'); // exam data speadsheet
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
const { Util } = require("discord.js");
let prefix = process.env.PREFIX;
let token = process.env.TOKEN;
let examDataUrl = process.env.EXAM_DATA_URL;
let examDataFile = process.env.EXAM_DATA_FILE;
let examDataUpdate = process.env.EXAM_DATA_UPDATE;
module.exports.examData = {};

try {
  if (fs.existsSync("./botConfig.json")) {
    const { PREFIX, TOKEN } = require("./botConfig.json");
    if (PREFIX) {
      prefix = PREFIX;
    }
    if (TOKEN) {
      token = TOKEN;
    }
  }
}
catch (err) {
  console.error(err);
}
try {
  if (fs.existsSync("./config.json")) {
    const { EXAM_DATA_URL, EXAM_DATA_FILE, EXAM_DATA_UPDATE } = require("./config.json");
    if (!examDataUrl) {
      examDataUrl = EXAM_DATA_URL;
    }
    if (!examDataFile) {
      examDataFile = EXAM_DATA_FILE;
    }
    if (!examDataUpdate) {
      examDataUpdate = EXAM_DATA_UPDATE;
    }
  }
}
catch (err) {
  console.error(err);
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const {
  forbiddenRanks,
  socialRanks,
  adminRank,
  username,
  logChannel
} = require("./config.json");
let oneCategory;
let twoCategory;
let threeCategory;
let fourCategory;
let adminRole;

client.on("ready", () => {
  client.user.setUsername(username);
  client.user.setActivity(`${prefix}help | tinyurl.com/VicBot`, {
    type: "PLAYING"
  });
  console.log(`Instance started at ${new Date()}\n`);
});

// preventing some errors from killing the whole thing
process.on("unhandledRejection", error =>
  console.error(`Uncaught Promise Rejection:\n${error}`)
);
process.on("unhandledError", error =>
  console.error(`Unhandled Error:\n${error}`)
);
client.on("disconnect", error => console.error(`Disconnected! \n${error}`));
client.on("error", console.error);

/**
 *
 */
client.on("message", async message => {
  // redirecting old commands
  if (
    !message.content.startsWith(prefix) &&
    message.content.startsWith(";rank")
  )
    return message.channel.send(`Please use "${prefix}rank".`);

  // limiting to predefined PREFIX
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  adminRole = message.guild.roles.find(role => role.name === adminRank);
  oneCategory = message.guild.channels.find(
    category => category.name === "100-level"
  );
  twoCategory = message.guild.channels.find(
    category => category.name === "200-level"
  );
  threeCategory = message.guild.channels.find(
    category => category.name === "300-level"
  );
  fourCategory = message.guild.channels.find(
    category => category.name === "400-level"
  );

  // checking to ensure the command or an alias of the command exists
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
    	cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;

  if (
    command.admin &&
    (!message.member.roles.has(adminRole.id) &&
      !message.member.hasPermission("ADMINISTRATOR"))
  )
    return message.channel.send("This requires admin permissions.");

  if (command.args && !args.length) {
    let reply = "Please include the appropriate arguments";

    if (command.usage) reply += `\ne.g.: \`${command.usage}\``;

    return message.reply(reply);
  }

  try {
    command.execute(message, args);
    if (command.log) {
      this.log(commandName, message);
    }
  }
  catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

/**
 *
 */
client.on("guildMemberAdd", async member => {
  const embed = new Discord.MessageEmbed()
    .setAuthor("Member Joined", member.user.displayAvatarURL())
    .setDescription(`${member} ${member.user.tag}`)
    .setFooter(`ID: ${member.user.id}`)
    .setColor("GREEN")
    .setTimestamp();
  member.guild.channels
    .find(channel => channel.name === logChannel)
    .send(embed);
});

client.on("guildMemberRemove", async member => {
  const embed = new Discord.MessageEmbed()
    .setAuthor("Member Left", member.user.displayAvatarURL())
    .setDescription(`${member} ${member.user.tag}`)
    .setFooter(`ID: ${member.user.id}`)
    .setColor("RED")
    .setTimestamp();
  member.guild.channels
    .find(channel => channel.name === logChannel)
    .send(embed);
});

/**
 *
 */
client.on("voiceStateUpdate", async (oldState, newState) => {
  const voiceRole = newState.guild.roles.find(role => role.name === "inVoice");
  if (newState.channel) {
    newState.member.roles.add(voiceRole);
  }
  else {
    newState.member.roles.remove(voiceRole);
  }
});

/**
 * Checks against permissions and forbidden roles, then adds or removes the role from the user which sent the message.
 * @param {Discord.Message} message the message sent
 * @param {string} rank the rank to be added or removed
 */
exports.rank = async function(message, rank) {
  const aliasRegex = /^\w\w\w\w-\d\d\d\d$/;
  if (/^[a-zA-Z]{4}[1-4]\d\d$/.test(rank))
    rank = rank.slice(0, 4) + "-" + rank.slice(4, 7);

  if (message.guild.roles.find(role => role.name === rank) == null)
    rank = rank.toLowerCase();

  if (forbiddenRanks.includes(rank)) {
    return message.channel.send(`Sorry, you cannot join ${rank}.`);
  }
  else if (message.guild.roles.find(role => role.name === rank) == null) {
    return message.channel.send(
      `${rank} role doesn't exist. Consider asking an @admin to create it.`
    );
  }
  else if (
    !message.guild.roles
      .find(role => role.name === rank)
      .members.has(message.author.id)
  ) {
    await message.member.roles.add(
      message.guild.roles.find(role => role.name === rank)
    );
    if (!aliasRegex.test(rank) && !socialRanks.includes(rank)) {
      const rankChannel = message.guild.channels.find(
        channel => channel.name === rank
      );
      return message.reply(`Added you to ${rankChannel} successfully.`);
    }
    else {
      return message.reply(`Added you to ${rank} successfully.`);
    }
  }
  else {
    await message.member.roles.remove(
      message.guild.roles.find(role => role.name === rank)
    );
    if (!aliasRegex.test(rank)) {
      const rankChannel = message.guild.channels.find(
        channel => channel.name === rank
      );
      return message.reply(`Removed you from ${rankChannel} successfully.`);
    }
    else {
      return message.reply(`Removed you from ${rank} successfully.`);
    }
  }
};

/**
 * Logs the use of the command in the log channel.
 * @param {string} commandName name of the command used
 * @param {Discord.Message} message the message sent
 */
exports.log = async function(commandName, message) {
  const commandChannel = message.guild.channels.find(
    channel => channel.name === message.channel.name
  );
  const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setDescription(
      `Used \`${commandName}\` command in ${commandChannel}\n${message.cleanContent}`
    )
    .setTimestamp();
  message.guild.channels
    .find(channel => channel.name === logChannel)
    .send(embed);
};

/**
 * Sorts the channels within the 'papers' category.
 * @param {Discord.Message} message the message sent
 */
exports.organise = async function(message) {
  const isClass = word =>
    word.charAt(5) === "1" ||
    word.charAt(5) === "2" ||
    word.charAt(5) === "3" ||
    word.charAt(5) === "4";

  const channelArray = message.guild.channels.array();
  const roles = message.guild.roles.array();
  roles.filter(role => isClass(role.name));
  let oneLength = 0;
  let twoLength = 0;
  let threeLength = 0;
  let fourLength = 0;
  const oneNameArray = [];
  const twoNameArray = [];
  const threeNameArray = [];
  const fourNameArray = [];

  // places each channel into an array and sorts the array
  channelArray.forEach(item => {
    if (item.name.charAt(5) === "1") {
      if (item.parent.name !== "100-level") item.setParent(oneCategory);
      oneLength++;
      oneNameArray.push(item.name);
    }
    else if (item.name.charAt(5) === "2") {
      if (item.parent.name !== "200-level") item.setParent(twoCategory);
      twoLength++;
      twoNameArray.push(item.name);
    }
    else if (item.name.charAt(5) === "3") {
      if (item.parent.name !== "300-level") item.setParent(threeCategory);
      threeLength++;
      threeNameArray.push(item.name);
    }
    else if (item.name.charAt(5) === "4") {
      if (item.parent.name !== "400-level") item.setParent(fourCategory);
      fourLength++;
      fourNameArray.push(item.name);
    }
  });
  await oneNameArray.sort();
  await twoNameArray.sort();
  await threeNameArray.sort();
  await fourNameArray.sort();

  // if the channel is not in the same location as its sorted array location, move it.
  for (let i = 0; i < oneLength; i++)
    if (
      message.guild.channels.find(channel => channel.name === oneNameArray[i])
        .position != i
    )
      await message.guild.channels
        .find(channel => channel.name === oneNameArray[i])
        .setPosition(i);

  for (let i = 0; i < twoLength; i++)
    if (
      message.guild.channels.find(channel => channel.name === twoNameArray[i])
        .position != i
    )
      await message.guild.channels
        .find(channel => channel.name === twoNameArray[i])
        .setPosition(i);

  for (let i = 0; i < threeLength; i++)
    if (
      message.guild.channels.find(channel => channel.name === threeNameArray[i])
        .position != i
    )
      await message.guild.channels
        .find(channel => channel.name === threeNameArray[i])
        .setPosition(i);

  for (let i = 0; i < fourLength; i++)
    if (
      message.guild.channels.find(channel => channel.name === fourNameArray[i])
        .position != i
    )
      await message.guild.channels
        .find(channel => channel.name === fourNameArray[i])
        .setPosition(i);
};

/**
 * Checks if three or more users have reacted with 📌, and pins the message.
 */
client.on("messageReactionAdd", async reaction => {
  if (reaction.emoji.name === "📌")
    if (reaction.count >= 3 && !reaction.message.pinned)
      await reaction.message.pin();
});

/**
 * Creates a role and channel for the course specified
 *  - Restricts it to the role created and bots
 *  - Pulls the course title from the victoria website and sets the category
 *  - Places the channel within the 'papers' category
 *  - Sorts the 'papers' category to ensure the channel is in the correct alphabetical location.
 * @param {Discord.Message} message the message sent
 * @param {string[]} args array of strings in the message
 */
exports.newRank = async function(message, args) {
  if (message.guild.roles.find(role => role.name === args[0]) == null) {
    await message.guild.roles.create({
      data: {
        name: args[0],
        hoist: false,
        mentionable: false
      }
    });
  }
  let levelParent;
  if (args[0].charAt(5) === "1") levelParent = oneCategory;
  else if (args[0].charAt(5) === "2") levelParent = twoCategory;
  else if (args[0].charAt(5) === "3") levelParent = threeCategory;
  else if (args[0].charAt(5) === "4") levelParent = fourCategory;

  await message.guild.channels.create(args[0], {
    type: "text",
    permissionOverwrites: [
      {
        id: message.guild.id,
        deny: ["VIEW_CHANNEL"]
      },
      {
        id: message.guild.roles.find(role => role.name === args[0]).id,
        allow: ["VIEW_CHANNEL"]
      },
      {
        id: message.guild.roles.find(role => role.name === "bots").id,
        allow: ["VIEW_CHANNEL"]
      }
    ],
    parent: levelParent
  });
  await this.organise(message);

  // pull the course title and set the topic
  const name = args[0].slice(0, 4) + args[0].slice(5, args[0].length);

  const currentYear = new Date().getFullYear();
  const https = require("https");
  https
    .get(
      `https://www.wgtn.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`,
      resp => {
        let data = "";

        // Adding the data chunks to the string
        resp.on("data", chunk => {
          data += chunk;
        });

        // Parsing the string for the course title
        resp.on("end", () => {
          JSON.parse(data, function(key, value) {
            if (key === "title")
              message.guild.channels
                .find(channel => channel.name === args[0])
                .setTopic(value);
          });
        });
      }
    )
    .on("error", err => {
      console.log("Error: " + err.message);
    });
};

/**
 * Deletes the channel and/or role specified.
 * @param {Message} message the message sent
 * @param {string[]} args array of strings in the message
 */
exports.deleteRank = async function(message, args) {
  if (message.guild.roles.find(role => role.name === args[0]) != null)
    await message.guild.roles.find(role => role.name === args[0]).delete();
  if (message.guild.channels.find(channel => channel.name === args[0]) != null)
    await message.guild.channels
      .find(channel => channel.name === args[0])
      .delete();
  return;
};

/**
 *
 * @param {Discord.TextChannel} channel
 * @returns {Promise<boolean>}
 *
 */
exports.isPaper = function(channel) {
  if (!channel.parent) return false;
  if (channel.type !== "text") return false;

  return (
    channel.parent.name === "100-level" ||
    channel.parent.name === "200-level" ||
    channel.parent.name === "300-level" ||
    channel.parent.name === "400-level"
  );
};

/**
 *
 * @param code
 * @param i
 * @param j
 * @param k
 * @param message
 * @returns {Promise<void>}
 */
exports.getCourse = async function(code, i, j, k, message) {
  const https = require("https");
  const name = code + i + j + k;
  const currentYear = new Date().getFullYear();
  const index = require("./index.js");
  https
    .get(
      `https://www.wgtn.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`,
      resp => {
        let data = "";

        // Adding the data chunks to the string
        resp.on("data", chunk => {
          data += chunk;
        });

        // Parsing the string for the course title
        resp.on("end", () => {
          JSON.parse(data, function(key, value) {
            if (key === "id" && value && /^[a-zA-Z]{4}[1-4]\d\d$/.test(value)) {
              const hyphenatedName =
                value.slice(0, 4) + "-" + value.slice(4, 7);
              const arrayRank = [hyphenatedName];
              if (
                !message.guild.channels.find(
                  channel => channel.name === hyphenatedName
                )
              )
                index.newRank(message, arrayRank);
            }
          });
        });
      }
    )
    .on("error", err => {
      console.log("Error: " + err.message);
    });
};

/**
 * Returns the last time the data file was modified.
 * @return {Date}
 */
exports.getExamLastUpdated = function() {
  const stats = fs.statSync(examDataFile);
  return stats.mtime;
};

/**
 * Checks if the exam data is outdated and updates it if it is.
 */
function checkExamUpdates() {
  if (new Date() - module.exports.getExamLastUpdated() > examDataUpdate) {
    module.exports.fetchData();
    if (new Date() - module.exports.getExamLastUpdated() < 10000) {
      // updated within 10 seconds - new data, process it
      module.exports.processData();
    }
  }
}

/**
 * Retrives data from the source, keeping the data up to date.
 */
exports.fetchData = function() {
  const options = { filename: examDataFile, timeout: 500 };
  download(examDataUrl, options, function(error) {
    if (error == 404)
      console.error(
        "URL for exam data returned a 404. Check the URL is valid and working."
      );
  });
};

/**
 * Takes the data file and adds it to the object data array.
 */
exports.processData = function() {
  const stream = fs.createReadStream(examDataFile);
  const buffers = [];
  stream.on("data", function(data) {
    buffers.push(data);
  });
  stream.on("end", function() {
    const buffer = Buffer.concat(buffers);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let y = 4;
    while (true) {
      const examCell = worksheet["A" + y];
      const examValue = examCell ? examCell.v : undefined;
      const exam = module.exports.parseExam(examValue);
      if (exam != undefined) {
        const durationValue = getValue(worksheet, "B" + y);
        const dateValue = getValue(worksheet, "C" + y);
        const startValue = getValue(worksheet, "D" + y);
        const roomsValue = getValue(worksheet, "E" + y);
        module.exports.examData[exam] = {
          duration: durationValue,
          date: dateValue,
          start: startValue,
          rooms: roomsValue
        };
        y++;
      }
      else break;
    }
  });
};

/**
 * Returns a worksheet's cell value.
 * @param {object}
 * @param {string}
 * @return {any}
 */
function getValue(worksheet, id) {
  const cell = worksheet[id];
  const value = cell ? cell.v : undefined;
  return value;
}

/**
 * Generates a formatted string containing the exam data.
 * @param {object}
 * @param {object}
 * @param {boolean}
 * @return {string}
 */
exports.formatExams = function(message, exams, displayErrors) {
  let examDataOutput = "";
  checkExamUpdates(); // check to see if exam data is outdated
  for (let i = 0; i < exams.length; i++) {
    const exam = module.exports.parseExam(exams[i].toUpperCase());
    if (exam != undefined) {
      const datum = module.exports.examData[exam];
      if (datum != undefined) {
        examDataOutput += `${exam}\t${parseDuration(
          datum.duration
        )}\t${parseDate(datum.date)}\t${parseStart(datum.start)}\t${parseRooms(
          datum.rooms
        )}\n`;
      }
      else if (displayErrors)
        message.reply(
          `couldn't find exam data for '${exams[i]}'. Does the course exist for the current trimister?`
        );
    }
    else if (displayErrors)
      message.reply(`'${exams[i]}' is not a valid course.`);
  }
  return examDataOutput;
};

/**
 * Checks if the input is a valid exam.
 * @param {string}
 * @return {any}
 */
exports.parseExam = function(exam) {
  if (/^[a-zA-Z]{4}[0-9]{3}/.test(exam)) {
    return exam.slice(0, 7).toUpperCase();
  }
  else if (/^[a-zA-Z]{4}-[0-9]{3}/.test(exam)) {
    return exam.slice(0, 4).toUpperCase() + exam.slice(5, 8);
  }
  else return undefined;
};

/**
 * Returns the channel name of the exam.
 * @param {string}
 * @return {string}
 */
function getChannel(exam) {
  return exam.slice(0, 4).toLowerCase() + "-" + exam.slice(4, 7);
}

/**
 * Returns the duration.
 * @param {number}
 * @return {number}
 */
function parseDuration(duration) {
  return duration;
}

/**
 * Converts the raw input into a string formatted date.
 * @param {number}
 * @return {string}
 */
function parseDate(date) {
  date = convertToDate(date);
  let day = date.getDate();
  if (day.toString().length == 1) day = "0" + day;
  let month = date.getMonth() + 1;
  if (month.toString().length == 1) month = "0" + month;
  return `${day}/${month}/${date.getFullYear()}`;
}

/**
 * Converts the raw input into a Date object.
 * The input is a serial number which represents how many days past 1 Janurary 1900.
 * Date objects can be created with serial numbers, but they start from 1 Janurary 1970.
 * @param {number}
 * @return {Date}
 */
function convertToDate(date) {
  return new Date((date - 25569) * 86400000); // 25569 accounts for serial number shift.
}

/**
 * Converts the raw input into a string formatted start time.
 * The input is a decimal value between 0 and 1, representing the amount of time past midnight of the day.
 * @param {number}
 * @return {string}
 */
function parseStart(start) {
  const hour = Math.floor(start * 24);
  const minute = Math.floor(((start * 24) % 1) * 60);
  let meridiem = "AM";
  if (hour >= 12) meridiem = "PM";
  return `${hour % 12}:${minute} ${meridiem}`;
}

/**
 * Returns the rooms.
 * @param {string}
 * @return {string}
 */
function parseRooms(rooms) {
  return rooms;
}

/**
 * Generates a formatted string containing the exam data and sends it to its respective channel.
 * @param {object}
 * @param {object}
 * @param {boolean}
 * @return {number}
 */
exports.notifyExams = function(message, exams, displayErrors) {
  let notified = 0;
  for (let i = 0; i < exams.length; i++) {
    const exam = module.exports.parseExam(exams[i].toUpperCase());
    if (exam != undefined) {
      // valid exam
      const examChannel = getChannel(exam);
      const datum = module.exports.examData[exam];
      if (datum != undefined) {
        // valid exam course code
        const channel = client.channels.find(
          channel => channel.name == examChannel
        );
        if (channel != undefined) {
          // channel exists for the exam
          const examDataOutput = module.exports.formatExams(
            message,
            [exam],
            false
          ); // get the formatted data
          if (examDataOutput.length > 0) {
            // generate the embedded message
            const embeddedMessage = module.exports.examDataEmbed(
              examDataOutput
            );
            // delete all old exam data in the course channel
            // channel.messages.fetch(messages => messages.filter(m => m.author.id == client.user.id)).then(messages => {
            //   let arr = messages.array();
            //   for (let i = 0; i < arr.length; i++) {
            //     arr[i].delete();
            //   }
            // });
            channel.send(embeddedMessage).then(msg => msg.pin()); // pin the message
            notified++;
          }
        }
        else if (displayErrors)
          message.reply(
            `couldn't find the channel for '${exams[i]}'. Does the channel #${examChannel} exist?`
          );
      }
      else if (displayErrors)
        message.reply(
          `couldn't find exam data for '${exams[i]}'. Does the course exist for the current trimister?`
        );
    }
    else if (displayErrors)
      message.reply(`'${exams[i]}' is not a valid course.`);
  }
  return notified;
};

/**
 * Generates an embedded message with the exam data provided.
 * @param {string}
 * @return {object}
 */
exports.examDataEmbed = function(examDataOutput) {
  const embeddedMessage = new Discord.MessageEmbed()
    .setTitle("Exam Times")
    .setDescription(`\`\`\`${examDataOutput}\`\`\``)
    .addField(
      `Last updated: ${formatTime(
        new Date().getTime() - module.exports.getExamLastUpdated().getTime()
      )} ago.`,
      "To find out your room, log in to [Student Records](https://student-records.vuw.ac.nz)."
    )
    .setTimestamp();
  return embeddedMessage;
};

/**
 * Converts milliseconds into a string formatted time.
 * @param {number}
 * @return {string}
 */
function formatTime(milliseconds) {
  let totalSeconds = milliseconds / 1000;
  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
}

/**
 * Checks if the url is valid and updates the config file.
 * @param {string}
 * @return {boolean}
 */
exports.updateConfigUrl = function(url) {
  if (validExamURL(url)) {
    examDataUrl = url;
    // update the config file
    const file = require("./config.json");
    file.EXAM_DATA_URL = examDataUrl;
    fs.writeFile("./config.json", JSON.stringify(file, null, 2), function(
      error
    ) {
      if (error) {
        console.log(error);
        return false;
      }
    });
    module.exports.fetchData();
    module.exports.processData();
    return true;
  }
  else return false;
};

/**
 * Returns whether the input is a valid exam url address.
 * @param {string}
 * @return {boolean}
 */
function validExamURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i"
  );
  return pattern.test(url) && url.endsWith('.xlsx');
}

// update and process the data before running the client
module.exports.fetchData();
module.exports.processData();

client.login(token);
