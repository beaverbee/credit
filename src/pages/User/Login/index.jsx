/** @format */

import React from "react";
import { Button, Form, Input, message } from "antd";
import { saveUser } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import qs from "qs";
import "./index.css";

export default function Login() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	async function handleLogin() {
		const data = await form.validateFields();
		axios
			.post("/user/login", qs.stringify(data))
			.then((value) => {
				if (value.data.length > 0) {
					const { id, username, label } = value.data[0];
					saveUser({ id, username, label });
					if (label === 0) {
						navigate("/admin");
					} else {
						navigate("/home");
					}
					message.success("登录成功");
				} else {
					message.error("用户名或密码错误，请重试");
				}
			})
			.catch(() => {
				message.error("网络延迟请稍后再试");
			});
	}
	return (
		<div className="login-box">
			<Form
				form={form}
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 12,
				}}
				initialValues={{
					size: "large",
				}}
				autoComplete="off"
			>
				<Form.Item
					label="用户名"
					name="username"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请输入您的用户名",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="密码"
					name="password"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请输入您的密码",
						},
					]}
				>
					<Input />
				</Form.Item>
			</Form>
			<div className="bottom-div">
				<Button type="primary" className="button" onClick={handleLogin}>
					登录
				</Button>
				<span
					onClick={() => {
						navigate("/user/register");
					}}
				>
					尚无账号？点击注册
				</span>
			</div>
		</div>
	);
}
