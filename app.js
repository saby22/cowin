const axios = require('axios');
const _ = require('lodash');
const baseURL =
	'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict';
const myArgs = process.argv.slice(2);
const telegram = require('./telegram');
let change = false;

let sessions = [];
let prevSessions = [];

const parseData = data => {
	change = false;
	data.centers.forEach(center => {
		const available_sessions = [];
		center.sessions.forEach(session => {
			if (session.available_capacity > 0) {
				change = true;
				available_sessions.push(session);
				sessions.push({
					...center,
					sessions: available_sessions,
				});
			}
		});
	});

	if (change === true) {
		if (!_.isEqual(sessions, prevSessions)) {
			telegram.notifyVaccine(sessions, myArgs[0]);
			prevSessions = sessions;
		} else console.log('No Update Since Last Change');
	} else console.log('No Vaccination Available');
};

const getVaccinationCentres = async () => {
	try {
		const currDate = new Date();
		const config = {
			method: 'get',
			url: baseURL,
			params: {
				district_id: myArgs[0],
				date: `${currDate.getDate()}-${
					currDate.getMonth() + 1
				}-${currDate.getFullYear()}`,
			},
			headers: {'User-Agent': 'PostmanRuntime/7.26.8'},
		};

		const response = await axios(config);
		console.log('Fetched Data @', new Date().toISOString());
		console.log('District Code : ', myArgs[0]);
		parseData(response.data);
	} catch (err) {
		console.log('Request Errored Out!');
		console.log('Error Code : ', err.response.status);
		console.log('Error Message : ', err.response.statusText);
	}
};

telegram.initializeWatcherCofirmation(myArgs[0]);
getVaccinationCentres();
setInterval(getVaccinationCentres, 30000);
setInterval(() => {
	telegram.notificationService(myArgs[0]);
}, 1800000);
