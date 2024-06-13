import axios from "axios";

export const domainName = "https://events-app-u5vr.onrender.com";

export function fetchUserById(userId) {
	return axios.get(`${domainName}/api/users/${userId}`).then((res) => {
		console.log(res.data.user);
		return res;
	});
}

export function fetchUpcomingEvents() {
	return axios.get(`${domainName}/api/events/upcoming`).then((res) => {
		console.log(res.data.events);
		return res;
	});
}
