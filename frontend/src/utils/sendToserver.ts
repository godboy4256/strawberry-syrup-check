const DEV_URL = "http://localhost:8080";
const PROD_URL = "https://moneysylove.com/";

const requestFunc = async (path: string | boolean, body: any) => {
  const from_server = await fetch(DEV_URL + path, {
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
