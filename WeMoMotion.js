/*
 *  WeMoSocketMotion.js
 *
 *  David Janes
 *  IOTDB
 *  2015-03-01
 *
 *  NOTE: NOT TESTED
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('WeMoMotion')
    .facet(":sensor.motion")
    .product("http://www.belkin.com/us/p/P-F5Z0340/")
    .name("WeMo Motion")
    .description("Belkin WeMo Motion")
    .i("motion", attribute.sensor.boolean.motion)
    .make();

exports.binding = {
    bridge: require('./WeMoBridge').Bridge,
    model: exports.Model,
    matchd: {
        'iot:vendor/type': 'urn:Belkin:device:sensor:1',
    },
    connectd: {
        subscribes: [
            'urn:Belkin:service:basicevent:1',
        ],

        data_in: function(paramd) {
        },

        data_out: function(paramd) {
        },
    },
};
