const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);

const initializeWatcherCofirmation = async district_id => {
	try {
		await bot.sendMessage(
			process.env.CHANNEL_ID,
			`Initalized Observer for District ${district_id}. You will notified every 30 mins about the status of the Observer. If there is no notification message after 30 mins, something is wrong!`
		);
	} catch (err) {
		console.log('Telegram Error!');
		console.log(err);
	}
};

const notificationService = district_id => {
	bot
		.sendMessage(
			process.env.CHANNEL_ID,
			`Notification Message\n-------------\nDistrict Code : ${district_id}\nObserver Running!\nNext Notification in 30 mins!`
		)
		.then(() => {
			console.log('Observer Up Message Send');
		})
		.catch(err => {
			console.log('Telegram Error!');
			console.log(err);
		});
};

const notifyVaccine = (sessions, district_id) => {
	const message = [
		`Notification for District : ${district_id}\n--------------------`,
	];
	try {
		sessions.forEach(session => {
			const centerInfo = `Centre Name : ${session.name}\nAddress : ${session.address}\nDistrict : ${session.district_name}`;
			let vaccineInfo = '';
			session.sessions.forEach(vaccine => {
				vaccineInfo += `\n${vaccine.date} \-> Available ${vaccine.available_capacity}\n${vaccine.vaccine}`;
			});
			message.push(`${centerInfo}${vaccineInfo}`);
		});
		console.log(message.join('\n\n'));
	} catch (err) {
		console.log(err);
	}
	bot
		.sendMessage(
			process.env.CHANNEL_ID,
			message.join('\n\n').substring(0, 4095)
		)
		.then(() => {
			console.log('Notification Message Send');
		})
		.catch(err => {
			console.log('Telegram Error!');
			console.log(err);
		});
};
exports.initializeWatcherCofirmation = initializeWatcherCofirmation;
exports.notificationService = notificationService;
exports.notifyVaccine = notifyVaccine;
