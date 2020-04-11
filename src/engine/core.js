module.exports = {
    cleanCommand: function(cmd) {
        return cmd.substring(1).toLowerCase()
    },
    random: function(number) {
        return Math.floor(Math.random() * number) + 1
    }
}
