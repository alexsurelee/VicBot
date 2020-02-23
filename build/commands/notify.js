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
module.exports = {
    name: 'notify',
    args: false,
    admin: true,
    log: true,
    usage: '`!notify | { <channel> [channel ...] | all }`',
    description: 'Sends examination information to all the course channels.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is in a server
            if (message.guild) {
                if (args.length == 0) {
                    const channelName = message.channel.name;
                    const exam = index.parseExam(channelName);
                    if (exam)
                        index.notifyExams(message, [exam], true);
                    else
                        message.reply(`invalid channel. Is <#${message.channel.id}> a course channel?`);
                }
                else if (args[0] == 'all') {
                    // find all the exam courses
                    const exams = Object.keys(index.examData);
                    const notified = index.notifyExams(message, exams, false); // send exam data to each channel
                    message.reply(`successfully notified ${notified} channels.`);
                }
                else {
                    // find exam courses in arguments
                    const exams = [args.length];
                    for (let i = 0; i < args.length; i++) {
                        exams[i] = args[i];
                    }
                    index.notifyExams(message, exams, true); // send exam data to each channel
                }
            }
            // The message was sent in a DM, can't retrieve the server info
            else
                return message.reply("Looks like you didn't send this message from a server");
        });
    }
};
