// const index = require(`../index.js`);
// module.exports = {
// 	name: `updateCourses`,
// 	args: false,
// 	admin: true,
// 	usage: `\`!updateCourses\``,
// 	description: `Scrapes the victoria.ac.nz website for engineering courses and adds them to the server.`,
// 	execute(message, args) {
const currentYear = (new Date()).getFullYear();
const computerGraphics = `cgra`;
const computerScience = `comp`;
const cybersecurity = `cybr`;
const electronics = `ecen`;
const engineering = `engr`;
const math = `math`;
const networkEngineering = `nwen`;
const physics = `phys`;
const softwareEngineering = `swen`;
const statistics = `stat`;
const renewable = `rese`;

const courseCodes = [computerGraphics, cybersecurity, networkEngineering, computerScience, engineering, electronics, softwareEngineering, math, physics, statistics, renewable];

const courses = [];
const https = require(`https`);
courseCodes.forEach(async function(code) {
	for(let i=1 ; i<=4 ; i++){
		for(let j=0 ; j<=9 ; j++) {
			for(let k=0 ; k<=9 ; k++) {
				await getCourse(code, i, j, k);
			}
		}
	}

});
// 	}
// };

async function getCourse(code, i, j, k) {
	const name = code+i+j+k;
	https.get(`https://www.victoria.ac.nz/_service/courses/2.1/courses/${name}?year=${currentYear}`, (resp) => {
		let data = ``;

		// Adding the data chunks to the string
		resp.on(`data`, (chunk) => {
			data += chunk;
		});


		// Parsing the string for the course title
		resp.on(`end`, () => {
			JSON.parse(data, function(key, value) {
				if (key === `id` && value && /^[a-zA-Z]{4}[1-4]\d\d$/.test(value)){
					console.log(`valid course`, value);
					// message.guild.channels.find(channel => channel.name === args[0]).setTopic(value);
				}
			});
		});

	}).on(`error`, (err) => {
		console.log(`Error: ` + err.message);
	});
}