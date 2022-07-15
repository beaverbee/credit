/** @format */

import axios from "axios";
import { message } from "antd";

const API_BASE_URL = "http://localhost:3000";

const service = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
});

service.interceptors.response.use(
	(response) => response.data,
	(err) => {
		message.error("异次元连接失败，请稍后");
		return Promise.reject(err);
	}
);

export default service;
