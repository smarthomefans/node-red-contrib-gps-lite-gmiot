module.exports = function (RED) {
    var axios = require('axios');
    var CryptoJS = require("crypto-js");

    function login(config) {
        RED.nodes.createNode(this, config);

        // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);
        
        var node = this;
        if (this.server) {
            node.status({fill:"blue", shape:"ring", text: "ok"});
        } else {
            node.status({fill:"red", shape:"ring", text: "没有配置正确的万物在线信息"});
            return
        }
        let phone = this.server.phone
        this.sid = phone;
        let md5Pass = this.server.md5Pass

        node.on('input', function (msg) {
            var time = parseInt(new Date().getTime() / 1000, 10)

            var payload = {}
            
            var signature = CryptoJS.MD5(md5Pass + time).toString()

            console.log(`account: ${phone} time: ${time} md5Pass: ${md5Pass}`)
            console.log(`http://litapi.gmiot.net/1/auth/access_token?account=${phone}&time=${time}&signature=${signature}`)
            axios({
                method: 'get',
                url: `http://litapi.gmiot.net/1/auth/access_token?account=${phone}&time=${time}&signature=${signature}`,
                headers: {
                    'Content-type': 'Content-type: text/html; charset=utf-8'
                }


            }).then(function (response) {
                var data = response.data
                if(data.ret && data.ret != 0) {
                    throw new Error(data.msg ? data.msg : "参数有误")
                }
                msg.headers = response.headers
                msg.request = response.request
                payload.status = 1
                payload.data = data
                let global = node.context().global
                global.set(phone, {access_token: data.access_token, expires_in: data.expires_in, time: parseInt(new Date().getTime() / 1000, 10)})
                
                msg.payload = payload
                console.log(11111111111111)
                node.send([msg, null])

            }).catch(function (error) {
                console.log(222222222222222222)
                payload.status = -1
                payload.data = error.message
                msg.payload = payload
                msg['error'] = error
                node.send([null, msg])
            })
        });

    }
    RED.nodes.registerType("gmiot-login", login);

}