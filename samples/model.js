/*
 *  How to use this module stand-alone
 */

var wemo = require('../index')
var _ = wemo.homestar._;

wrapper = wemo.wrap("WeMoSocket");
wrapper.on('model', function(model) {
    model.on("state", function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on("meta", function(model) {
        console.log("+ meta\n ", model.thing_id(), _.ld.compact(model.meta().state()));
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
    
    console.log("+ discovered\n ", _.ld.compact(model.meta().state()), "\n ", model.thing_id());
});
