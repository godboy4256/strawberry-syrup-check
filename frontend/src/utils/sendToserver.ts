const BASE_URL = "http://localhost:8080";

const requestFunc = async (path: string, body: any) => {
	const from_server = await fetch(BASE_URL + path, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return from_server.json();
};

export const sendToServer = (path: string, body: any) => {
	return requestFunc(path, body);
};
