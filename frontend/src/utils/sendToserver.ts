const BASE_URL = "http://localhost:8080";

const requestFunc = async (path: string | boolean, body: any) => {
  const from_server = await fetch(BASE_URL + path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return from_server.json();
};

export const sendToServer = (path: string | boolean, body: any) => {
  return requestFunc(path, body);
};
