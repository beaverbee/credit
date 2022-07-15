/** @format */

import React from "react";
import LeftNav from "./leftNav";
import Header from "./header";
import { Row, Col } from "antd";
import "./index.css";

export default function Admin({ children }) {
	return (
		<div className="admin">
			<Row>
				<Col span={2}>
					<LeftNav></LeftNav>
				</Col>
				<Col span={19} offset={2}>
					<Row>
						<Header></Header>
					</Row>
					<Row className="content">
						<Col span={24}>{children}</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
}
