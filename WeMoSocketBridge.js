/*
 *  WeMoSocketBridge.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-02-01
 *
 *  Copyright [2013-2015] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use struct";

var iotdb = require('iotdb')
var _ = iotdb.helpers;

var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'iotdb',
    module: 'WeMoSocketBridge',
});

/**
 *  EXEMPLAR and INSTANCE
 *  <p>
 *  No subclassing needed! The following functions are 
 *  injected _after_ this is created, and before .discover and .connect
 *  <ul>
 *  <li><code>discovered</code> - tell IOTDB that we're talking to a new Thing
 *  <li><code>pulled</code> - got new data
 *  <li><code>connected</code> - this is connected to a Thing
 *  <li><code>disconnnected</code> - this has been disconnected from a Thing
 *  </ul>
 */
var WeMoSocketBridge = function(paramd, native) {
    var self = this;

    self.paramd = _.defaults(paramd, {});
    self.native = native;
};

/* --- lifecycle --- */

/**
 *  EXEMPLAR. 
 *  Discover WeMo Socket
 *  <ul>
 *  <li>look for Things (using <code>self.bridge</code> data to initialize)
 *  <li>find / create a <code>native</code> that does the talking
 *  <li>create an WeMoSocketBridge(native)
 *  <li>call <code>self.discovered(bridge)</code> with it
 */
WeMoSocketBridge.prototype.discover = function() {
    var self = this;
    
    var cp = iotdb.upnp.control_point();

    cp.on("device", function (native) {
        if (native.deviceType !== "urn:Belkin:device:controllee:1") {
            return;
        } else if (native.modelName !== "Socket") {
            return;
        }

        self.discovered(new WeMoSocketBridge(self.paramd, native));
    });

    cp.search();

};

/**
 *  INSTANCE
 *  This is called when the Bridge is no longer needed. When
 */
WeMoSocketBridge.prototype.connect = function() {
    var self = this;
    if (!self.native) {
        return;
    }

    self._setup_events();

};

WeMoSocketBridge.prototype._setup_events = function() {
    var self = this;

    var service_urn = 'urn:Belkin:service:basicevent:1'
    var service = self.native.service_by_urn(service_urn);
    if (!service) {
        logger.error({
            method: "_setup_events",
            unique_id: self.unique_id,
            service_urn: service_urn,
        }, "service not found - highly unexpected");
        return;
    }

    var _on_failed = function (code, error) {
        logger.error({
            method: "_setup_events/_on_failed",
            code: code,
            error: error,
            service_urn: service_urn,
            cause: "probably UPnP related"
        }, "called");

        self._forget();
        _remove_listeners();
    };

    var _on_stateChange = function (valued) {
        if (valued.BinaryState === '1') {
            self.pulled({ 'on-value': true });
        } else if (valued.BinaryState === '0') {
            self.pulled({ 'on-value': false });
        }

        logger.debug({
            method: "_setup_events/_on_stateChange",
            valued: valued,
        }, "called pulled");
    };

    var _on_subscribe = function (error, data) {
        if (error) {
            // console.log("- UPnPDriver._setup_events/subscribe", service_urn, error);
            logger.error({
                method: "_setup_events/_on_subscribe",
                error: error,
                service_urn: service_urn,
                cause: "probably UPnP related"
            }, "called pulled");

            self._forget();
            _remove_listeners();
        }
    };

    var _remove_listeners = function () {
        service.removeListener('failed', _on_failed);
        service.removeListener('stateChange', _on_stateChange);
    };

    // console.log("- UPnPDriver._setup_events: subscribe", service_urn);
    logger.info({
        method: "_setup_events/_on_stateChange",
        service_urn: service_urn
    }, "subscribe");

    service.on("failed", _on_failed);
    service.on("stateChange", _on_stateChange);
    service.subscribe(_on_subscribe);
};

WeMoSocketBridge.prototype._forget = function() {
    var self = this;
    if (self.native) {
        return;
    }

    logger.info({
        method: "_forget"
    }, "called");

    self.native = null;
    self.pulled();
}

/**
 *  INSTANCE and EXEMPLAR (during shutdown). 
 *  This is called when the Bridge is no longer needed. When
 */
WeMoSocketBridge.prototype.disconnect = function() {
    var self = this;
    if (!self.native || !self.native) {
        return;
    }
};

/* --- data --- */

/**
 *  INSTANCE.
 *  Send data to whatever you're taking to.
 */
WeMoSocketBridge.prototype.push = function(pushd) {
    var self = this;
    if (!self.native) {
        return;
    }

    if (pushd.on !== undefined) {
        var service_urn = 'urn:Belkin:service:basicevent:1';
        var service = self.native.service_by_urn(service_urn);
        if (!service) {
            logger.error({
                method: "push",
                unique_id: self.unique_id,
                pushd: pushd,
                service_urn: service_urn,
            }, "service not found - highly unexpected");
            return;
        }

        action_id = 'SetBinaryState';
        action_value = {
            'BinaryState' : pushd.on ? 1 : 0
        };

        service.callAction(action_id, action_value, function (error, buffer) {
            if (error) {
                logger.error({
                    method: "push",
                    unique_id: self.unique_id,
                    pushd: pushd,
                    service_urn: service_urn,
                    error: error,
                    cause: "maybe network problem",
                }, "error calling service");
                return;
            }
        });
    }

    logger.info({
        method: "push",
        unique_id: self.unique_id,
        pushd: pushd,
    }, "pushed");
};

/**
 *  INSTANCE.
 *  Pull data from whatever we're talking to. You don't
 *  have to implement this if it doesn't make sense
 */
WeMoSocketBridge.prototype.pull = function() {
    var self = this;
    if (!self.native) {
        return;
    }
};

/* --- state --- */

/**
 *  INSTANCE.
 *  Return the identify of this thing: basically
 *  a dictionary of what uniquely identifies this,
 *  based <code>self.native</code>.
 *  <p>
 *  There <b>must</b> be something in the dictionary!
 */
WeMoSocketBridge.prototype.identity = function() {
    var self = this;

    return {
        bridge: "WeMoSocketBridge",
        uuid: self.native.uuid,
    };
};

/**
 *  INSTANCE.
 *  Return the metadata - compact form can be used.
 *  <p>
 *  Really really useful things are:
 *  <ul>
 *  <li><code>iot:name</code>
 *  <li><code>iot:number</code>
 *  <li><code>schema:manufacturer</code>
 *  <li><code>schema:model</code>
 */
WeMoSocketBridge.prototype.meta = function() {
    var self = this;

    return {
        "iot:name": self.native.friendlyName || "WeMoSocket",
        "schema:manufacturer": "http://www.belkin.com/",
        "schema:model": "http://www.belkin.com/us/p/P-F7C027/",
    };
};

/**
 *  INSTANCE.
 *  Return True if this is reachable. You 
 *  do not need to worry about connect / disconnect /
 *  shutdown states, they will be always checked first.
 */
WeMoSocketBridge.prototype.reachable = function() {
    return this.native !== null;
};

/**
 *  INSTANCE.
 *  Return True if this is configured. Things
 *  that are not configured are always not reachable.
 *  If not defined, "true" is returned
 */
WeMoSocketBridge.prototype.configured = function() {
    return true;
};

/* --- injected: THIS CODE WILL BE REMOVED AT RUNTIME, DO NOT MODIFY  --- */
WeMoSocketBridge.prototype.discovered = function(bridge) {
    throw new Error("WeMoSocketBridge.discovered not implemented");
};

WeMoSocketBridge.prototype.pulled = function(pulld) {
    throw new Error("WeMoSocketBridge.pulled not implemented");
};

/*
 *  API
 */
exports.Bridge = WeMoSocketBridge;
