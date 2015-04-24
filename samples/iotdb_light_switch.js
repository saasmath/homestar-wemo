/*
 *  How to use this module in IOTDB / HomeStar
 *  This is the best way to do this
 *  Note: to work, this package must have been installed by 'homestar install' 
 */

var iotdb = require('iotdb')
var iot = iotdb.iot();

var things = iot.connect('WeMoLightSwitch');
things.on("state", function(thing) {
    console.log("+", thing.thing_id(), "\n ", thing.state("istate"));
});

var on = false;
var timer = setInterval(function() {
    things.set(":on", on);
    on = !on;
}, 30 * 1000);
