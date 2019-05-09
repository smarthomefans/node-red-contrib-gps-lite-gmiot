# node-red-contrib-gps

万物在线节点


## 安装

**Requires Node.js v6.0 or newer**

Either install from the Node-RED palette manager, or:

```
$ npm i node-red-contrib-gps-lite-gmiot
```

## 使用

* **gmiot-login** 用于登陆万物在线，目前`access_token`有效期为2小时，所以要定时获取 
* **gmiot-monitor** 用于获取设备信息，默认`msg.payload.data`是第一个设备信息，详细设备可以从`msg.payload.dataArray`获取
* **gmiot-address** 通过经纬度反向获取地址信息，输入参数经纬度


## QQ群 776817275 欢迎大家加入

![](https://i.loli.net/2018/12/28/5c25b8bf1e78d.jpg)

## Maintainers

[@yaming116](https://github.com/yaming116)

## License

MIT © 2018 yaming116

