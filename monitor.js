module.exports = function (RED) {
    var axios = require('axios');

    function monitor(config) {
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

        node.on('input', function (msg) {
            getDataFromHttp(node, node.server, msg)
        });
    }

    function unlogin(node , msg) {
        var payload = {}
        payload.status = 10006
        payload.data = 'access_token 信息不存在，请重新登陆'
        msg.payload = payload
        node.send([null, msg])
    }

    function getDataFromHttp(node , server, msg){
        var payload = {}
        var global = node.context().global
        if (!global.get(server.phone)) {
            unlogin(node, msg)
            return
        }
        var access_token = global.get(server.phone).access_token
        console.log(`target: ${server.phone} access_token： ${access_token}`)
        node.status({fill:"yellow", shape:"ring", text: "request..."});

        axios({
            method: 'get',
            url: `http://litapi.gmiot.net/1/account/monitor?target=${server.phone}&access_token=${access_token}`,
            headers: {
                'Content-type': 'Content-type: text/html; charset=utf-8',
            }

        }).then(function (response) {
            node.status({fill:"blue", shape:"ring", text: "ok"});

            var data = response.data
            console.log(JSON.stringify(data))
            if(data.ret > 10003 && data.ret < 10007) {
                unlogin(node, msg)
                return
            }
            if(data.ret && data.ret != 0) {
                throw new Error(data)
            }

            msg.headers = response.headers
            msg.request = response.request
            payload.status = 1
            payload.dataArray = data

            if(data.data.length > 0) {
                payload.data = data.data[0]
            }

            msg.payload = payload
            node.send([msg, null])

        }).catch(function (error) {
            node.status({fill:"blue", shape:"ring", text: "error"});

            payload.status = -1
            payload.data = error.message
            msg.payload = payload
            msg['error'] = error
            node.send([null, msg])
        })
    }
    RED.nodes.registerType("gmiot-monitor", monitor);

}