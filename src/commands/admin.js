//#region require

const serverjson = require("../../jsonbase/server.json")

//#endregion

module.exports = {
    process: function(channel,msg) {
        if(msg == "admins") {
            admins(channel);
        }
    }
}

function admins(channel) {
    let val = "";
    all = serverjson.admins.forEach((key) => {
        val += "<@!" + key + ">";
    })
    channel.send(val);
}
