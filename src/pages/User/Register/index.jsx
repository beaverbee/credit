/** @format */

import React from "react";
import { useEffect } from "react";
import { Input, Form, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
const { Option } = Select;

export default function Register() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	async function handleRegister() {}
	useEffect(() => {
		async function getUser() {
			return { username: "123" };
		}
		getUser();
	}, []);
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
					<Input />
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
					<Input />
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
			</Form>
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
