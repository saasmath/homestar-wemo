/*
 *  WeMoSocketModel.js
 *
 *  David Janes
 *  IOTDB
 *  2014-01-26
 */

var iotdb = require("iotdb")

exports.Model = iotdb.make_model('WeMoSocket')
    .facet(":plug")
    .facet(":switch")
    .product("http://www.belkin.com/us/F7C027-Belkin/p/P-F7C027/")
    .name("WeMo Socket")
    .description("Belkin WeMo Socket")
    .io("on", "on-value", iotdb.boolean.on)
    .make()
    ;