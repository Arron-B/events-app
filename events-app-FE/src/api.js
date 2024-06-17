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

export function fetchEventById(eventId) {
	return axios.get(`${domainName}/api/events/${eventId}`).then((res) => {
		const eventParsed = res.data.event;
		eventParsed.datetime = dateParse(res.data.event.datetime);
		return eventParsed;
	});
}

export function fetchAttendance(eventId) {
	return axios
		.get(`${domainName}/api/events/${eventId}/attendance`)
		.then((res) => {
			return res;
		});
}

export function staffVerify(password) {
	return axios
		.post(`${domainName}/api/staffverify`, { password: password })
		.then((res) => {
			return res;
		});
}

export function setAsStaff(userId) {
	return axios
		.patch(`${domainName}/api/users/${userId}`, {
			staff: true,
		})
		.then((res) => {
			return res;
		});
}

export function attendEvent(eventId, userId) {
	return axios.post(`${domainName}/api/events/${eventId}`, { user_id: userId }).then((res) => {
		return res;
	})
}

export function removeAttendEvent(eventId, userId) {
	return axios.delete(`${domainName}/api/events/${eventId}/attendee`, { data: {user_id: userId} }).then((res) => {
		return res;
	})
}

export function fetchAttendees(eventId) {
	return axios
		.get(`${domainName}/api/events/${eventId}/attendees`)
		.then((res) => {
			return res;
		});
}

export function postNewEvent(title, description, organiser, dateTime, location) {
	let dateTimeUTC = new Date(dateTime)
	dateTimeUTC = dateTimeUTC.toISOString()
	return axios.post(`${domainName}/api/events`, { title: title, description: description, organiser: organiser, datetime: dateTimeUTC, location: location }).then((res) => {
		const eventParsed = res.data.event;
		eventParsed.datetime = dateParse(res.data.event.datetime);
		return eventParsed;
	})

}


export function fetchMyEvents(userId) {
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