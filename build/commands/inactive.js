var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    name: "inactive",
    args: true,
    admin: true,
    log: false,
    description: "Lists how many users have not sent a message in the specified number of days.",
    usage: "`!inactive <number of days>`",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild;
            const currentDateValue = message.createdTimestamp;
            const maximumLastMessageValue = args[0] * 86400000;
            let inactiveCount = 0;
            yield guild.members.array().forEach(member => {
                if (!member.lastMessage ||
                    currentDateValue - maximumLastMessageValue <
                        member.lastMessage.createdTimestamp) {
                    inactiveCount++;
                }
            });
            return message.channel.send(`There are ${inactiveCount} users which have not sent a message in the past ${args[0]} days.`);
        });
    }
};
