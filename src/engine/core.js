//#region require

const fs = require("fs");

//#endregion

module.exports = {
    cleanCommand: function(cmd) {
        return cmd.substring(1).toLowerCase()
    },
    random: function(number) {
        return Math.floor(Math.random() * number) + 1
    },
    saveJSON: function(path,model) {
        jsonval = JSON.stringify(model,null,4)
        fs.writeFile(path,jsonval,(err) => { })
    }
}
