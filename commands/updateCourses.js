const index = require(`../index.js`);
const { courseCodes } = require(`../config.json`);
module.exports = {
	name: `updateCourses`,
	args: false,
	admin: true,
	usage: `\`!updateCourses\``,
	description: `Scrapes the victoria.ac.nz website for engineering courses and adds them to the server.`,
	execute(message, args) {
		courseCodes.forEach(async function(code) {
			for(let i=1 ; i<=4 ; i++){
				for(let j=0 ; j<=9 ; j++) {
					for(let k=0 ; k<=9 ; k++) {
						await getCourse(code, i, j, k, message);
					}
				}
			}

		});
	}
};

async function getCourse(code, i, j, k, message) {
	const https = require(`https`);
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
					const hyphenatedName = value.slice(0, 4) + `-` + value.slice(4, 7);
					const arrayRank = [hyphenatedName];
					if(!message.guild.channels.find(channel => channel.name === hyphenatedName)) index.newRank(message, arrayRank);
				}
			});
		});

	}).on(`error`, (err) => {
		console.log(`Error: ` + err.message);
	});
}