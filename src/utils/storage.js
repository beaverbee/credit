/**
 * /*
 * 进行local数据存储管理的工具模块
 *
 * @format
 */

import store from "store";
const USER_KEY = "user_key";

export function saveUser(user) {
	// localStorage.setItem(USER_KEY, JSON.stringify(user))
	store.set(USER_KEY, user);
}

export function getUser() {
	// return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
	return store.get(USER_KEY) || {};
}

export function removeUser() {
	store.remove(USER_KEY);
}
