/*
 *  For reference. 
 *  Prefer the way 'model.js' works.
 */

var WeMoBridge = require('../WeMoBridge').Bridge;

var bridge_exemplar = new WeMoBridge();
bridge_exemplar.discovered = function(bridge) {
    console.log("+ got one", bridge.meta());
    bridge.pulled = function(state) {
        console.log("+ state-change", state);
    };
    bridge.connect({
        data_out: function(paramd) {
            if (paramd.cookd.on !== undefined) {
                paramd.rawd['urn:Belkin:service:basicevent:1'] = {
                    'SetBinaryState': {
                        'BinaryState': paramd.cookd.on ? 1 : 0
                    },
                };
            }
        },
    });

    var on = false;
    setInterval(function() {
        bridge.push({
            on: on,
        });
        on = !on;
    }, 2500);
};
bridge_exemplar.discover();
