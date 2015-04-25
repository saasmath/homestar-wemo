/*
 *  How to use this module stand-alone
 *  Prefer iotdb* versions
 */

try {
    var model = require('homestar-wemo')
} catch (x) {
    var model = require('../index')
}

var _ = model.iotdb._;

wrapper = model.wrap("WeMoSocket");
wrapper.on('thing', function(model) {
    model.on("state", function(model) {
        console.log("+ state\n ", model.thing_id(), model.state("istate"));
    });
    model.on("meta", function(model) {
        console.log("+ meta\n ", model.thing_id(), model.state("meta"));
    });

    var on = false;
    var timer = setInterval(function() {
        if (!model.reachable()) {
            console.log("+ forgetting unreachable model");
            clearInterval(timer);
            return;
        }

        model.set("on", on);
        on = !on;
    }, 2500);
    
    console.log("+ discovered\n ", model.thing_id(), model.state("meta"));
});
