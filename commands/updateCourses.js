const index = require("../index.js");
const { courseCodes } = require("../config.json");
module.exports = {
  name: "updatecourses",
  args: false,
  admin: true,
  usage: "`!updatecourses`",
  log: true,
  description:
    "Scrapes the wgtn.ac.nz website for engineering courses and adds them to the server.",
  async execute(message) {
    courseCodes.forEach(async function(code) {
      for (let i = 1; i <= 4; i++) {
        for (let j = 0; j <= 9; j++) {
          for (let k = 0; k <= 9; k++) {
            await index.getCourse(code, i, j, k, message);
          }
        }
      }
    });
  }
};
