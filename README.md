# homestar-wemo

Connect and control WeMo products with HomeStar and IOTDB.

See <a href="samples/">the samples</a> for details how to add to your project,
particularly <code>model.js</code>.

# WeMoSocket

This controls WeMo Sockets.

Functionality:

* discover WeMo Sockets
* turn on and off
* get same

## WeMoSocketModel

Semantic.

### Attributes

* <code>iot-attribute:on</code>: true or false

## WeMoSocketBridge

Low-level.

#### Push / controls

* <code>on</code>: true or false

#### Pull / readings

* <code>on-value</code>: true or false

