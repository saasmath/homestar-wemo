/*
 *  How to use this module stand-alone
 */

try {
    var model = require('homestar-wemo')
} catch (x) {
    var model = require('../index')
}

var _ = model.homestar._;

wrapper = model.wrap("WeMoSocket");
wrapper.on('thing', function(model) {
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
