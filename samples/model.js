/*
 *  Use a Model to manipulate semantically
 */

var homestar = require("homestar");
var _ = homestar._;

var ModelBinding = require('../WeMoSocket');

wrapper = _.bridge_wrapper(ModelBinding.binding);
wrapper.on('model', function(model) {
    model.on_change(function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on_meta(function(model) {
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
})
