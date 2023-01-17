const DEV_URL = "http://localhost:8080";
const PROD_URL = "https://moneysylove.com";

const requestFunc = async (path: string | boolean, body: any) => {
  const from_server = await fetch(DEV_URL + path, {
    method: "POST",
    body: JSON.stringify(body),
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
  });
  return from_server.json();
};

export const sendToServer = (path: string | boolean, body: any) => {
  return requestFunc(path, body);
};
