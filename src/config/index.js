/** @format */

import {
	UnorderedListOutlined,
	EditOutlined,
	FormOutlined,
	RollbackOutlined,
} from "@ant-design/icons";
import { getItem } from "../utils";

export const menusList = [
	getItem("游戏列表", "/admin", <UnorderedListOutlined className="icon" />),
	getItem("系统日志", "/admin/log", <EditOutlined className="icon" />),
	getItem("编辑游戏", "/admin/edit", <FormOutlined className="icon" />),
	getItem("返回游戏", "/", <RollbackOutlined className="icon" />),
];
