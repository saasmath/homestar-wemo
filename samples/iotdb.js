/*
 *  How to use this module in IOTDB / HomeStar
 *  This is the best way to do this
 *  Note: to work, this package must have been installed by 'homestar install' 
 */

var iotdb = require('iotdb')
var iot = iotdb.iot();

var things = iot.connect('WeMoSocket');

/*
var on = false;
var timer = setInterval(function() {
    things.set(":on", on);
    on = !on;
}, 2500);
*/
