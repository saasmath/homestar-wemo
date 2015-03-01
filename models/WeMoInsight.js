/*
 *  WeMoInsight.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-01
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('WeMoInsight')
    .facet(":plug")
    .facet(":switch")
    .facet(":sensor")
    .product("http://www.belkin.com/us/support-product?pid=01t80000003JS3FAAW")
    .name("WeMo Insight")
    .description("Belkin WeMo Insight")
    .io("on", iotdb.boolean.on)
    .i("today-kwh", iotdb.number)
    .i("current-power", iotdb.number)
    .i("today-on-time", iotdb.number)
    .i("on-for", iotdb.number)
    .i("today_standby-time", iotdb.number)
    .make();

exports.binding = {
    bridge: require('../WeMoBridge').Bridge,
    model: exports.Model,
    matchd: {
        'iot:vendor/type': 'urn:Belkin:device:insight:1',
        'iot:vendor/model': 'Insight',
    },
    connectd: {
        subscribes: [
            'urn:Belkin:service:basicevent:1',
        ],

        data_in: function(paramd) {
            var valued = paramd.rawd['urn:Belkin:service:basicevent:1'];
            if (valued !== undefined) {
                if (valued.BinaryState === '1') {
                    paramd.cookd.on = true;
                } else if (valued.BinaryState === '0') {
                    paramd.cookd.on = false;
                }
            }

            console.log("NEW VALUES HERE", paramd);
            /*
            paramd.cooked["today-kwh"] = parseInt(some_value);
            paramd.cooked["current-power"] = parseInt(some_value);
            paramd.cooked["today-on-time"] = parseInt(some_value);
            paramd.cooked["on-for"] = parseInt(some_value);
            paramd.cooked["today_standby-time"] = parseInt(some_value);
            */
        },

        data_out: function(paramd) {
            if (paramd.cookd.on !== undefined) {
                paramd.rawd['urn:Belkin:service:basicevent:1'] = {
                    'SetBinaryState': {
                        'BinaryState': paramd.cookd.on ? 1 : 0
                    },
                };
            }
        },
    },
};
