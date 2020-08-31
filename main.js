require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const baseUrl = "https://ftx.com"
const basePath = "/api"
const apiKey = process.env.API_KEY;
const apiSecretKey = process.env.API_SECRET_KEY;

const main = async () => {
	try {
		const res = await getAllSubAccounts();
		console.log(res);
	} catch (err) {
		const status = err.response.status;
		const statusText = err.response.statusText;
		const message = err.response.data.error;
		console.log(status, statusText, message);
	}
}

const request = async (method, path, data, auth) => {
	const ts = Date.now().toString();
	const body = (method === 'POST') ? JSON.stringify(data) : '';
	if (method === 'GET' && data) {
		path = path + '?' + _encodeQueryData(data)
	}
	const url = baseUrl + basePath + path;
	let options = {
		url: url,
		method: method,
		data: body,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	if (method === 'GET') options.params = data;
	if (auth) {
		const sign = createSign(ts, method, path, body);
		options.headers['FTX-KEY'] = apiKey;
		options.headers['FTX-TS'] = ts;
		options.headers['FTX-SIGN'] = sign;
	}
	return await axios(options);
}

const createSign = (ts, method, path, body) => {
	const payload = (new TextEncoder).encode(ts + method + basePath + path + body);
	const encodedSecretKey = (new TextEncoder).encode(apiSecretKey);
	return crypto.createHmac('sha256', encodedSecretKey).update(payload).digest('hex');
}

const _encodeQueryData = data => {
  const ret = [];
  for (let d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}
  return ret.join('&');
}

const getAllSubAccounts = async () => {
	return await request('GET', '/subaccounts', null, true);
}

main();

