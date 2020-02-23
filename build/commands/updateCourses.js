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
const { courseCodes } = require(__dirname + "/../../config.json");
module.exports = {
    name: "updatecourses",
    args: false,
    admin: true,
    usage: "`!updatecourses`",
    log: true,
    description: "Scrapes the wgtn.ac.nz website for engineering courses and adds them to the server.",
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            courseCodes.forEach(function (code) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (let i = 1; i <= 4; i++) {
                        for (let j = 0; j <= 9; j++) {
                            for (let k = 0; k <= 9; k++) {
                                yield index.getCourse(code, i, j, k, message);
                            }
                        }
                    }
                });
            });
        });
    }
};
