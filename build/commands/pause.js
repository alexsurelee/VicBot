var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const index = require("../index.js");
module.exports = {
    name: "pause",
    args: false,
    admin: false,
    log: false,
    description: "Pauses the currently playing song.",
    usage: "`!pause`",
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverQueue = index.getQueue(message.guild.id);
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send("⏸ Paused the music for you!");
            }
            return message.channel.send("There is nothing playing.");
        });
    }
};
