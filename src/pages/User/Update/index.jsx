/** @format */

import React from "react";
import { useEffect, useRef } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../../utils/storage";
import axios from "../../../utils/axios";
import qs from "qs";
import "./index.css";

const { Option } = Select;

export default function Update() {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const kaptchaRef = useRef();
	const location = useLocation();

	const changeKaptcha = () => {
		kaptchaRef.current.src = "";
		kaptchaRef.current.src = "/kaptcha";
	};

	async function handleUpdate() {
		form
			.validateFields()
			.then((value) => {
				return axios.get(`/check?verifyCodeActual=${value.kaptcha}`);
			})
			.then((value) => {
				if (value.status === 1 && value.data) {
					return form.getFieldsValue();
				} else {
					return Promise.reject("验证码错误");
				}
			})
			.then((value) => {
				return axios.post(
					"/user/update",
					qs.stringify({ ...value, id: getUser().id })
				);
			})
			.then((value) => {
				if (value.status === 1 && value.data) {
					message.success("信息修改成功");
					navigate("/home");
				}
			})
			.catch((e) => {
				console.log(e);
				if (typeof e === "string") {
					message.error(e);
				} else {
					message.error("Oops something wrong");
				}
			});
	}
	useEffect(() => {
		function getUserMsg() {
			const { id } = getUser();
			axios
				.get(`/user/getuser/${id}`)
				.then((value) => {
					if (value.status === 1) {
						form.setFieldsValue(value.data);
					} else {
						return Promise.reject();
					}
				})
				.catch(() => {
					message.error("Oops something wrong");
				});
		}
		getUserMsg();
	}, [location, form]);

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
				ref={kaptchaRef}
				onClick={changeKaptcha}
			></img>
			<div className="bottom-div">
				<Button type="primary" className="button" onClick={handleUpdate}>
					修改
				</Button>
			</div>
			<div
				onClick={() => {
					navigate(-1);
				}}
				className="back-list"
			>
				返回游戏
			</div>
		</div>
	);
}
