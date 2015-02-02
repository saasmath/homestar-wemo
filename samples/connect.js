/*
 *  Connect to a Denon AVR at a named host
 */

var WeMoSocketBridge = require('../WeMoSocketBridge').Bridge;

var bridge_exemplar = new WeMoSocketBridge();
bridge_exemplar.discovered = function(bridge) {
    console.log("+ got one", bridge.meta());
    bridge.pulled = function(state) {
        console.log("+ state-change", state);
    };
    bridge.connect();

    var on = false;
    setInterval(function() {
        bridge.push({
            on: on,
        });
        on = !on;
    }, 2500);
};
bridge_exemplar.discover();
