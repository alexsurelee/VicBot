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
    name: "purge",
    args: true,
    admin: true,
    log: true,
    description: "Deletes the previous x messages.",
    usage: "`!purge <number of messages>`",
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(args[0]))
                return message.channel.send("Please specify a number of messages to purge.");
            const delNum = parseInt(args[0]) > 99 ? 100 : (parseInt(args[0]) + 1);
            return message.channel.bulkDelete(delNum);
        });
    }
};
