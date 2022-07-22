/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Input, Form, DatePicker, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "../../../utils/axios";
import "./index.css";
import { nanoid } from "nanoid";
import { getUser } from "../../../utils/storage";

export default function List() {
	const navigate = useNavigate();
	const columns = [
		{
			title: "游戏名称",
			dataIndex: "gamename",
			align: "center",
			width: "20%",
		},
		{
			title: "创建时间",
			dataIndex: "createtime",
			align: "center",
			width: "15%",
		},
		{
			title: "开始时间",
			dataIndex: "starttime",
			align: "center",
			width: "10%",
		},
		{
			title: "结束时间",
			dataIndex: "endtime",
			align: "center",
			width: "10%",
		},
		{
			title: "参加人数",
			dataIndex: "joined",
			align: "center",
			width: "7%",
		},
		{
			title: "完成人数",
			dataIndex: "success",
			align: "center",
			width: "7%",
		},
		{
			title: "操作",
			width: "5%",
			align: "center",
			render: (game) => (
				<Button
					type="ghost"
					onClick={() => {
						navigate(`/admin/edit?id=${game.id}`);
					}}
				>
					编辑
				</Button>
			),
		},
		{
			title: "上/下线",
			width: "7%",
			align: "center",
			render: (game) => {
				const { id, isload, gamename, gameid } = game;

				const online = (type) => {
					console.log(gamename, gameid);
					axios
						.post("/card/update", { id, isload: type })
						.then(() => {
							return axios.post("/log/add", {
								id: nanoid(),
								gamename,
								gameid: id,
								username: getUser().username,
								userid: getUser().id,
								action: isload ? "下架" : "上架",
								label: 1,
							});
						})
						.then((value) => {
							if (value.status === 1 && value.data) {
								message.success("修改信息成功");
							} else {
								return Promise.reject("修改信息失败");
							}
						})
						.then(() => {
							queryList();
						})
						.catch((e) => {
							if (typeof e === "string") {
								message.error(e);
							} else {
								console.log(e);
							}
						});
				};

				return (
					<div key={id}>
						{isload ? (
							<Button
								danger
								onClick={() => {
									online(0);
								}}
							>
								下架
							</Button>
						) : (
							<Button
								type="primary"
								onClick={() => {
									online(1);
								}}
							>
								上架
							</Button>
						)}
					</div>
				);
			},
		},
	];

	const [cardList, setcardList] = useState([]);
	const [loading, setLoading] = useState(false);

	const [form] = Form.useForm();
	const queryList = useCallback(() => {
		const value = form.getFieldValue();
		const newValue = {
			...value,
			starttime: value.starttime ? value.starttime.format("YYYY-MM-DD") : null,
			endtime: value.endtime ? value.endtime.format("YYYY-MM-DD") : null,
		};
		setLoading(true);
		axios
			.post("/card/query", newValue)
			.then((value) => {
				if (value.status === 1 && value.data) {
					const data = value.data
						.map((item) => {
							return { ...item, key: item.id };
						})
						.sort((a, b) => {
							const s1 = new Date(a.createtime.replace(/-/g, "/")).getTime();
							const s2 = new Date(b.createtime.replace(/-/g, "/")).getTime();
							return s2 - s1;
						});

					setcardList(data);
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
		<Spin spinning={loading} tip="加载中" size="large">
			<div className="card-list">
				<div className="search-list">
					<Form name="search" form={form} layout="inline">
						<Form.Item name="gamename" label="游戏名称">
							<Input></Input>
						</Form.Item>
						<Form.Item label="开始时间" name="starttime">
							<DatePicker />
						</Form.Item>
						<Form.Item label="结束时间" name="endtime">
							<DatePicker />
						</Form.Item>
						<Form.Item>
							<Button onClick={queryList}>查询</Button>
						</Form.Item>
					</Form>
				</div>
				<Table
					dataSource={cardList}
					columns={columns}
					pagination={{
						pageSize: 6,
					}}
					style={{ width: "100%" }}
				/>
			</div>
		</Spin>
	);
}
