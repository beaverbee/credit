/** @format */

import React from "react";
import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { useLocation } from "react-router-dom";
import "./index.css";

const { Option } = Select;

export default function Update() {
	const [form] = Form.useForm();
	const location = useLocation();
	useEffect(() => {
		const { id } = location;
		async function getUser(id) {}
		getUser(id);
	}, [location]);
	async function handleUpdate() {}
	return (
		<div className="update-box">
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
				<Button type="primary" className="button" onClick={handleUpdate}>
					修改
				</Button>
			</div>
		</div>
	);
}
