/*
 *  WeMoSocketModel.js
 *
 *  David Janes
 *  IOTDB
 *  2014-01-26
 */

var homestar = require("homestar")

exports.Model = homestar.make_model('WeMoSocket')
    .facet(":plug")
    .facet(":switch")
    .product("http://www.belkin.com/us/F7C027-Belkin/p/P-F7C027/")
    .name("WeMo Socket")
    .description("Belkin WeMo Socket")
    .io("on", "on-value", homestar.boolean.on)
    .make()
    ;

exports.binding = {
    bridge: require('./WeMoSocketBridge').Bridge,
    model: exports.Model,
};
