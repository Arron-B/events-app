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
