/*
 *  For reference. 
 *  Prefer the way 'iotdb.js' or 'model.js' works.
 */

var iotdb = require("iotdb");
var _ = iotdb._;

var ModelBinding = require('../models/WeMoSocket');

wrapper = _.bridge_wrapper(ModelBinding.binding);
wrapper.on('bridge', function(bridge) {
    console.log("+ discovered\n ", _.ld.compact(bridge.meta()));

    var on = false;
    setInterval(function() {
        bridge.push({
            on: on,
        }, function() {});
        on = !on;
    }, 5 * 1000);
})
wrapper.on('state', function(bridge, state) {
    console.log("+ state", state);
})
wrapper.on('meta', function(bridge) {
    console.log("+ meta", _.ld.compact(bridge.meta()));
})
wrapper.on('disconnected', function(bridge) {
    console.log("+ disconnected", _.ld.compact(bridge.meta()));
})
