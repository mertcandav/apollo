//#region require

const serverjson = require("../../jsonbase/server.json")
const fs = require("fs")

//#endregion

module.exports = {
    process: function(msg) {
        mval = msg.content.substring(1).toLowerCase();
        if(mval == "admins") {
            admins(msg.channel);
        } else if(mval.startsWith("setadmin ")) {
            cache = mval.substring(12);
            serverjson.admins.push(cache.substring(0,cache.length-1));
            jsonval = JSON.stringify(serverjson);
            fs.writeFile("./jsonbase/server.json",jsonval,(err) => { });
        } else if(mval.startsWith("removeadmin ")) {
            cache = mval.substring(12);
            delete serverjson.admins.pop(cache.substring(0,cache.length-1));
            jsonval = JSON.stringify(serverjson);
            fs.writeFile("./jsonbase/server.json",jsonval,(err) => { });
        }
    }
}

function admins(channel) {
    let val = "";
    all = serverjson.admins.forEach((key) => {
        val += "<@!" + key + ">\n";
    })
    channel.send(val);
}
