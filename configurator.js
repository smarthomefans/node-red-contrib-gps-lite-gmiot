module.exports = function (RED) {
    var CryptoJS = require("crypto-js");

    function configuratorNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.phone = n.phone;
        this.password = n.password;
        this.md5Pass = ''
        this.access_token = ''
        this.expires_in = 0
        this.time = 0
        var node = this;
        if (n.password) {
            this.md5Pass = CryptoJS.MD5(this.password).toString()
        }else {
            node.status({fill:"red", shape:"ring", text: "不存在,请检查密码"});
        }

    }
    RED.nodes.registerType("gmiot-configurator", configuratorNode);

}