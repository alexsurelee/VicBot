var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const index = require('../index.js');
const { courseCodes } = require(__dirname + "/../../config.json");
module.exports = {
    name: 'setexamurl',
    args: true,
    admin: true,
    log: true,
    usage: '`!setexamurl <exam data url>`',
    description: 'Changes the URL where to fetch updated exam data.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is in a server
            if (message.guild) {
                if (index.updateConfigUrl(args[0]))
                    message.reply('successfully updated the URL and processed the data.');
                else
                    message.reply('invalid URL. Does the URL end with `./xlsx`?');
            }
            // The message was sent in a DM, can't retrieve the server info
            else
                return message.reply("Looks like you didn't send this message from a server");
        });
    }
};
