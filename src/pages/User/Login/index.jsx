/** @format */

import React from "react";
import { Button, Form, Input, message } from "antd";
import { useRef } from "react";
import { saveUser } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import qs from "qs";
import md5 from "md5";
import "./index.css";

export default function Login() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const kaptchaRef = useRef();
	async function handleLogin() {
		const data = await form.validateFields();

		axios
			.get(`/check?verifyCodeActual=${data.kaptcha}`)
			.then((value) => {
				if (value.status === 1 && value.data) {
					return axios.post(
						"/user/login",
						qs.stringify({ ...data, password: md5(data.password) })
					);
				} else {
					return Promise.reject("验证码输入错误");
				}
			})
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
					return Promise.reject("用户名或密码错误，请重试");
				}
			})
			.catch((e) => {
				if (typeof e === "string") {
					message.error(e);
				} else {
					message.error("网络延迟，请稍后重试");
				}
			});
	}
	const changeKaptcha = () => {
		kaptchaRef.current.src = "/kaptcha";
	};
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
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="验证码"
					name="kaptcha"
					className="form-item"
					labelCol={{
						span: 8,
					}}
					wrapperCol={{
						span: 6,
					}}
					rules={[
						{
							required: true,
							message: "请输入验证码",
						},
					]}
				>
					<Input></Input>
				</Form.Item>
			</Form>
			<img
				alt="1"
				src="/kaptcha"
				title="点击换图"
				className="update-kaptcha"
				onClick={changeKaptcha}
				ref={kaptchaRef}
			></img>
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
