/** @format */

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { message, Table, Spin, Form, Input, Button, Select } from "antd";
import axios from "../../../utils/axios";
import "./index.css";

const columns = [
	{
		title: "游戏名称",
		dataIndex: "gamename",
		align: "center",
		width: "20%",
	},
	{
		title: "操作者名称",
		dataIndex: "username",
		align: "center",
		width: "20%",
	},
	{
		title: "操作时间",
		dataIndex: "actiontime",
		align: "center",
		width: "20%",
	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: "15%",
	},
	{
		title: "角色",
		align: "center",
		width: "15%",
		render: (item) => <span>{item.label ? "管理员" : "用户"}</span>,
	},
];

const { Option } = Select;

export default function Log() {
	const [loading, setLoading] = useState(true);
	const [logList, setLogList] = useState([]);
	const [form] = Form.useForm();
	const queryList = useCallback(() => {
		const value = form.getFieldValue();
		setLoading(true);
		axios
			.post("/log/query", {
				...value,
				label: value.label !== -1 ? value.label : null,
			})
			.then((value) => {
				if (value.status === 1 && value.data) {
					const data = value.data
						.map((item) => {
							return { ...item, key: item.id };
						})
						.sort((a, b) => {
							const s1 = new Date(a.actiontime.replace(/-/g, "/")).getTime();
							const s2 = new Date(b.actiontime.replace(/-/g, "/")).getTime();
							return s2 - s1;
						});

					setLogList(data);
				} else {
					return Promise.reject();
				}
			})
			.then(() => {
				setLoading(false);
			})
			.catch(() => {
				message.error("查询失败");
			});
	}, [form]);
	useEffect(() => {
		queryList();
	}, [queryList]);
	return (
		<Spin spinning={loading} size="large" tip="加载中">
			<div className="admin-list">
				<div className="admin-list-query">
					<Form name="search" form={form} layout="inline">
						<Form.Item name="gamename" label="游戏名称">
							<Input></Input>
						</Form.Item>
						<Form.Item name="username" label="操作者名称">
							<Input></Input>
						</Form.Item>
						<Form.Item name="action" label="操作">
							<Input></Input>
						</Form.Item>
						<Form.Item label="角色" name="label" className="form-item">
							<Select placeholder="查询对象">
								<Option value={1}>管理员</Option>
								<Option value={0}>用户</Option>
								<Option value={-1}>所有</Option>
							</Select>
						</Form.Item>
						<Form.Item>
							<Button onClick={queryList} type="primary">
								查询
							</Button>
						</Form.Item>
					</Form>
				</div>
				<div className="admin-list-table">
					<Table dataSource={logList} columns={columns}></Table>
				</div>
			</div>
		</Spin>
	);
}
