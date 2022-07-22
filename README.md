<!-- @format -->

## 集卡游戏 demo

前后端分离的一个项目<br>
前端 React + Ant Design ,后端 Spring boot + Mybatis<br>

### 基本功能

用户：注册，登录，个人信息修改+后端验证码校验<br>
游戏：游戏列表展示，游戏详情，抽卡，分享<br>
后台：游戏查询，游戏配置，日志查询<br>

### 代码目录

```javascript
├─assets      //静态资源文件
├─components  //组件目录
│  ├─GameItem
│  └─Person
├─config      //配置目录
├─layout      //布局目录
│  └─Admin    //管理界面布局
│      ├─header
│      └─leftNav
├─pages
│  ├─Backend //后台管理页面目录
│  │  ├─Edit
│  │  ├─List
│  │  └─Log
│  ├─Home  //游戏页面目录
│  │  ├─Detail
│  │  ├─Game
│  │  └─GameList
│  └─User //个人信息目录
│      ├─Login
│      ├─Register
│      └─Update
├─routers
└─utils
```
### 碎碎念
由于只有两周时间完成这个项目，整体设计其实不太满意，前端axios没有封装，公共数据也没用redux管理等等等。<br>
如果之后有时间会翻出来进行代码重构,做到真正的前后端分离<br>