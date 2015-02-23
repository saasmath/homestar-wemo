# homestar-wemo

Connect and control WeMo products with HomeStar and IOTDB.

See <a href="samples/">the samples</a> for details how to add to your project.
particularly <code>model.js</code> for "standalone" and <code>iotdb.js</code>
for use in IOTDB / HomeStar projects.

# WeMoSocket

This controls WeMo Sockets.

Functionality:

* discover WeMo Sockets
* turn on and off
* get same (including notifications

### Attributes

* <code>on</code>: true or false, purpose <code>iot-attribute:on</code>

e.g.

    {
        "on": true
    }

the socket is on / turn the socket on
