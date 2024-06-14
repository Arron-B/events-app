import axios from "axios";
import { dateParse } from "../utils";

export const domainName = "https://events-app-u5vr.onrender.com";

export function fetchUserById(userId) {
	return axios.get(`${domainName}/api/users/${userId}`).then((res) => {
		return res;
	});
}

export function fetchUpcomingEvents() {
	return axios.get(`${domainName}/api/events/upcoming`).then((res) => {
		const events = res.data.events.map((event) => {
			const eventParsed = { ...event };
			eventParsed.datetime = dateParse(event.datetime);
			return eventParsed;
		});
		return events;
	});
}

export function postNewUser(userId, name) {
	return axios
		.post(`${domainName}/api/users`, {
			user_id: userId,
			name: name,
		})
		.then((res) => {
			return res;
		});
}

export function fetchAttending(userId) {
	///////////////////////////// CHANGE to userId when made some attending posts on your account ////////////////////////
	return axios.get(`${domainName}/api/users/auth0Id1/attending`).then((res) => {
		if (res.data.attending) {
			const eventsParsed = res.data.attending.map((event) => {
				const eventParsed = { ...event };
				eventParsed.datetime = dateParse(event.datetime);
				return eventParsed;
			});
			return eventsParsed;
		} else {
			return [];
		}
	});
}
