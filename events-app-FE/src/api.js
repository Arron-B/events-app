import axios from "axios";

export const domainName = "https://events-app-u5vr.onrender.com";

export function fetchUserById(userId) {
	return axios.get(`${domainName}/api/users/${userId}`).then((res) => {
		console.log(res.data.user);
		return res;
	});
}
