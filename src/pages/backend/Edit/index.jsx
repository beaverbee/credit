/** @format */

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Form, Input, DatePicker, Upload, Button, message, Spin } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import moment from "moment";
import "./index.css";
import "../../../assets/logo.png";
import axios from "../../../utils/axios";
import { getUser } from "../../../utils/storage";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function Edit() {
	const [msgForm] = Form.useForm();
	const navigate = useNavigate();
	const [file1, setfile1] = useState([]);
	const [file2, setfile2] = useState([]);
	const [file3, setfile3] = useState([]);
	const [file4, setfile4] = useState([]);
	const [file5, setfile5] = useState([]);
	const [config, setConfig] = useState({});
	const setFileList = useRef();
	const [searchParams] = useSearchParams();
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleChange = (file, id) => {
		const setfile = setFileList.current[id];
		let newfile = [];
		if (file.status === "done" && file.response.status === 1) {
			newfile = [
				{
					url: `http://localhost:8080/common/download?name=${file.response.data}`,
					thumbUrl: `http://localhost:8080/common/download?name=${file.response.data}`,
					uid: file.uid,
					status: file.status,
					name: file.response.data,
				},
			];
		}
		if (file.status === "uploading") {
			newfile = [file];
		}
		if (file.status === "'removed'") {
			newfile = [];
		}
		if (file.status === "error") {
			message.error(file.error);
		}
		setfile(newfile);
	};

	const submit = () => {
		const { gamename } = msgForm.getFieldsValue();
		console.log(gamename);
		const gameid = nanoid();
		msgForm
			.validateFields()
			.then(() => {
				const { title, time, p1, p2, p3, p4, p5 } = msgForm.getFieldsValue();
				const msgValue = {
					gamename,
					title,
					p1,
					p2,
					p3,
					p4,
					p5,
					starttime: time[0].format("YYYY-MM-DD"),
					endtime: time[1].format("YYYY-MM-DD"),
				};
				if (Math.abs(p1 + p2 + p3 + p4 + p5 - 1) > Number.EPSILON) {
					return Promise.reject("概率之和应该为1");
				}
				const [p1dir, p2dir, p3dir, p4dir, p5dir] = [
					file1[0],
					file2[0],
					file3[0],
					file4[0],
					file5[0],
				].map((item) => (item ? item.name : undefined));
				if (!(p1dir && p2dir && p3dir && p4dir && p5dir)) {
					return Promise.reject("请上传卡图片");
				}
				const value = {
					...msgValue,
					p1dir,
					p2dir,
					p3dir,
					p4dir,
					p5dir,
					joined: config.joined || 0,
					success: config.success || 0,
					isload: config.isload || 0,
					id: searchParams.has("id") ? searchParams.get("id") : gameid,
				};
				if (searchParams.has("id")) {
					return axios.post("/card/update", value);
				} else {
					return axios.post("/card/add", value);
				}
			})
			.then((value) => {
				const v = {
					id: nanoid(),
					gamename: msgForm.getFieldsValue().gamename,
					gameid: searchParams.has("id") ? searchParams.get("id") : gameid,
					username: getUser().username,
					userid: getUser().id,
					action: searchParams.has("id") ? "修改" : "新建",
					label: 1,
				};
				return axios.post("/log/add", v);
			})
			.then((value) => {
				if (value.status === 1 && value.data) {
					navigate("/admin/list");
					message.success(`${isEdit ? "修改" : "新建"}成功`);
				}
			})
			.catch((e) => {
				if (typeof e == "string") {
					message.error(e);
				}
				console.error(e);
			});
	};

	useEffect(() => {
		const init = () => {
			setFileList.current = [setfile1, setfile2, setfile3, setfile4, setfile5];
			if (searchParams.has("id")) {
				setLoading(true);
				const id = searchParams.get("id");
				axios
					.get(`/card/list/${id}`)
					.then((value) => {
						if (value.status === 1 && value.data) {
							setIsEdit(true);
							const {
								gamename,
								starttime,
								title,
								endtime,
								p1,
								p2,
								p3,
								p4,
								p5,
								p1dir,
								p2dir,
								p3dir,
								p4dir,
								p5dir,
								joined,
								success,
								isload,
							} = value.data;
							msgForm.setFieldsValue({
								gamename,
								title,
								time: [
									moment(starttime, "YYYY-MM-DD"),
									moment(endtime, "YYYY-MM-DD"),
								],
								p1,
								p2,
								p3,
								p4,
								p5,
							});
							setConfig({ joined, success, isload });
							return [p1dir, p2dir, p3dir, p4dir, p5dir].map((item) => [
								{
									uid: item ? item : "logo.png",
									name: item ? item : "logo.png",
									status: "done",
									url: `http://localhost:3000/common/download?name=${
										item ? item : "logo.png"
									}`,
									thumbUrl: `http://localhost:3000/common/download?name=${
										item ? item : "logo.png"
									}`,
								},
							]);
						} else {
							return Promise.reject();
						}
					})
					.then((value) => {
						setFileList.current.forEach((item, index) => {
							item(value[index]);
						});
					})
					.then(() => {
						setLoading(false);
					})
					.catch((e) => {
						console.log(e);
						message.error("Oops something wrong");
					});
			}
		};

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Spin spinning={loading} tip="加载中" size="large">
			<div className="edit-page">
				<div className="edit-body">
					<div className="edit-data">
						<Form
							name="game"
							form={msgForm}
							labelCol={{ span: 4 }}
							wrapperCol={{ span: 16 }}
						>
							<Form.Item
								label="游戏名称"
								name="gamename"
								rules={[
									{
										required: true,
										message: "请输入游戏名称!",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="游戏规则"
								name="title"
								rules={[
									{
										required: true,
										message: "请输入游戏规则!",
									},
								]}
							>
								<TextArea></TextArea>
							</Form.Item>
							<Form.Item
								label="活动时间"
								name="time"
								rules={[
									{
										required: true,
										message: "请输入活动时间!",
									},
								]}
							>
								<RangePicker style={{ width: "400px" }}></RangePicker>
							</Form.Item>
							<Form.Item
								name="p1"
								label="卡1概率"
								rules={[
									{
										required: true,
										message: "请输入游戏概率!",
									},
								]}
								normalize={(value) => parseFloat(value)}
							>
								<Input type="number"></Input>
							</Form.Item>
							<Form.Item
								name="p2"
								label="卡2概率"
								rules={[
									{
										required: true,
										message: "请输入游戏概率!",
									},
								]}
								normalize={(value) => parseFloat(value)}
							>
								<Input type="number"></Input>
							</Form.Item>
							<Form.Item
								name="p3"
								label="卡3概率"
								rules={[
									{
										required: true,
										message: "请输入游戏概率!",
									},
								]}
								normalize={(value) => parseFloat(value)}
							>
								<Input type="number"></Input>
							</Form.Item>
							<Form.Item
								name="p4"
								label="卡4概率"
								rules={[
									{
										required: true,
										message: "请输入游戏概率!",
									},
								]}
								normalize={(value) => parseFloat(value)}
							>
								<Input type="number"></Input>
							</Form.Item>
							<Form.Item
								name="p5"
								label="卡5概率"
								rules={[
									{
										required: true,
										message: "请输入游戏概率!",
									},
								]}
								normalize={(value) => parseFloat(value)}
							>
								<Input type="number"></Input>
							</Form.Item>
						</Form>
					</div>
					<div>
						<span className="picture-title">编辑图片</span>
						<div className="edit-picture">
							{[file1, file2, file3, file4, file5].map((item, index) => (
								<div className="picture-box" key={index}>
									<Upload
										action="/common/upload"
										accept="image/*"
										listType="picture"
										fileList={item}
										maxCount={1}
										onChange={({ file }) => {
											handleChange(file, index);
										}}
									>
										<Button icon={<UploadOutlined />}>
											上传卡{index + 1}图片
										</Button>
									</Upload>
								</div>
							))}
						</div>
					</div>
				</div>
				<div>
					<Button type="primary" onClick={submit}>
						{isEdit ? "保存" : "新建"}游戏配置
					</Button>
				</div>
			</div>
		</Spin>
	);
}
