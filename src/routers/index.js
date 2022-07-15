/** @format */

import User from "../pages/User";
import Game from "../pages/Home/Game";
import Backend from "../pages/Backend";
import Detail from "../pages/Home/Detail";
import Home from "../pages/Home";
import List from "../pages/Backend/List";
import Edit from "../pages/Backend/Edit";
import Log from "../pages/Backend/Log";
import Login from "../pages/User/Login";
import Register from "../pages/User/Register";
import Update from "../pages/User/Update";
import GameList from "../pages/Home/GameList";

const router = [
	{
		path: "*",
		element: <Home></Home>,
		children: [
			{ path: "*", element: <GameList></GameList> },
			{ path: "detail", element: <Detail></Detail> },
			{ path: "game", element: <Game></Game> },
		],
	},
	{
		path: "user/*",
		element: <User></User>,
		children: [
			{ path: "*", element: <Login></Login> },
			{ path: "login", element: <Login></Login> },
			{ path: "register", element: <Register></Register> },
			{ path: "update", element: <Update></Update> },
		],
	},
	{
		path: "admin/*",
		element: <Backend></Backend>,
		children: [
			{ path: "*", element: <List></List> },
			{ path: "list", element: <List></List> },
			{ path: "edit", element: <Edit></Edit> },
			{ path: "log", element: <Log></Log> },
		],
	},
];
export default router;
