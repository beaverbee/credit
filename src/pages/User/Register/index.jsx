/** @format */

import React from "react";
import { useRef } from "react";
import { Input, Form, Select, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { nanoid } from "nanoid";
import axios from "../../../utils/axios";
import qs from "qs";
import md5 from "md5";
const { Option } = Select;

export default function Register() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const kaptchaRef = useRef();
	async function handleRegister() {
		form
			.validateFields()
			.then((value) => {
				if (value.password !== value.repassword) {
					return Promise.reject("两次输入密码不一致");
				} else {
					return value;
				}
			})
			.then((value) => {
				return axios.get(`/user/repeat/${value.username}`);
			})
			.then((value) => {
				console.log(value.data);
				if (value.status && value.data) {
					const { username, password, nickname, sexal, phone } =
						form.getFieldsValue();
					const user = {
						username,
						password: md5(password),
						nickname,
						sexal,
						phone,
						id: nanoid(),
						label: 1,
					};
					return axios.post("/user/register", qs.stringify(user));
				} else {
					return Promise.reject("用户名重复");
				}
			})
			.then((value) => {
				if (value.status === 1 && value.data) {
					message.success("用户注册成功请登录");
					navigate("/user/login");
				} else {
					return Promise.reject();
				}
			})
			.catch((e) => {
				if (typeof e === "string") {
					message.error(e);
				} else {
					message.error("Oops Something Wrong");
				}
				console.log(e);
			});
	}
	const changeKaptcha = () => {
		kaptchaRef.current.src = "/kaptcha";
	};

	return (
		<div className="register-box">
			<Form
				form={form}
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 12,
				}}
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
					label="再次输入密码"
					name="repassword"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请再次输入您的密码",
						},
					]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="昵称"
					name="nickname"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请输入您的昵称",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="手机号码"
					name="phone"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请输入您的手机号",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="性别"
					name="sexal"
					className="form-item"
					rules={[
						{
							required: true,
							message: "请输入您的性别",
						},
					]}
				>
					<Select placeholder="请选择您的性别">
						<Option value="male">男</Option>
						<Option value="female">女</Option>
					</Select>
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
				<Button type="primary" className="button" onClick={handleRegister}>
					注册
				</Button>
				<span
					onClick={() => {
						navigate("/user/login");
					}}
				>
					已有账号？点击登录
				</span>
			</div>
		</div>
	);
}
