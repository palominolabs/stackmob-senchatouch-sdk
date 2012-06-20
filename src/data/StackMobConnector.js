/**
 * Copyright 2012 Palomino Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Encapsulates the information necessary to connect with StackMob, and provides utilities for
 * properly constructing requests with this information.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.data.StackMobConnector", {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    singleton: true,

    DEFAULT_API_VERSION: 0,

    SDK_NAME: "Sencha Touch",
    SDK_VERSION: "0.1",

    /**
     * Initializes the connection information required to communicate with StackMob.
     * @param {Object} options Configuration options
     * @param {String} options.appName The name of the StackMob application.
     * @param {String} options.clientSubdomain The StackMob client subdomain.
     * @param {String} options.publicKey The public key to use to sign OAuth 2.0 requests.
     * @param {String} options.apiUrl (optional) API URL to use.
     * @param {Number} options.apiVersion (optional) The StackMob API version.  Defaults to 0 (development).
     * @return {Ux.palominolabs.stackmob.data.StackMobConnector} this
     */
    init: function(options) {
        var me = this;

        options = options || {};

        me._verifyRequiredInitKeys(options);

        me.apiVersion = options.apiVersion || me.DEFAULT_API_VERSION;
        me.appName = options.appName;
        me.clientSubdomain = options.clientSubdomain;

        me.publicKey = options.publicKey;
        me.apiUrl = options.apiUrl;

        me.fullUrl = options.fullUrl || false;

        if (me._isDevelopmentMode()) {
            me.urlRoot = options.urlRoot || me._getDevApiBase();
        } else {
            me.urlRoot = options.urlRoot || me._getProdApiBase();
        }

        return this;
    },

    /**
     * Returns the StackMob API version
     * @return {Number} StackMob API version
     */
    getApiVersion: function() {
        return this.apiVersion;
    },

    /**
     * Returns the StackMob application name
     * @return {String} StackMob application name
     */
    getAppName: function() {
        return this.appName;
    },

    /**
     * Returns the public key for the StackMob application
     * @return {String} Public key
     */
    getPublicKey: function() {
        return this.publicKey;
    },

    /**
     * Returns the name of this SDK
     * @return {String} SDK Name
     */
    getSdkName: function() {
        return this.SDK_NAME;
    },

    /**
     * Returns the version of this SDK
     * @return {String} SDK version
     */
    getSdkVersion: function() {
        return this.SDK_VERSION;
    },

    /**
     * Returns the root URL for the StackMob REST API call
     * @return {String} The root URL
     */
    getUrlRoot: function() {
        return this.urlRoot;
    },

    /**
     * Iterates over the keys in the supplied object and asserts that all required keys are present
     * @param {Object} options The options passed to init
     * @private
     */
    _verifyRequiredInitKeys: function(options) {
        var suppliedKeys = Ext.Object.getKeys(options),
            requiredKeys = this._getRequiredInitKeys();

        Ext.Array.forEach(requiredKeys, function(item, index, allItems) {
            this._verifyRequiredKey(suppliedKeys, item);
        }, this);
    },

    /**
     * Verifies that key is supplied in keys
     * @param {String} keys The supplied keys
     * @param {String} key A required key
     * @private
     */
    _verifyRequiredKey: function(keys, key) {
        if (!Ext.Array.contains(keys, key)) {
            throw new Error(["[", Ext.getDisplayName(arguments.callee), "] A StackMob", key, "must be specified"].join(' '));
        }
    },

    /**
     * Returns an array of the required keys for the init options
     * @return {Array} Array of required key names for the init options
     * @private
     */
    _getRequiredInitKeys: function() {
        return ['appName', 'clientSubdomain', 'publicKey'];
    },

    /**
     * Returns the scheme to use when connectinf with StackMob
     * @return {String} Scheme
     * @private
     */
    _getScheme : function() {
        return 'https';
    },

    /**
     * Returns the base URL for the development mode API
     * @return {String} Base URL (development)
     * @private
     */
    _getDevApiBase : function() {
        var me = this;
        return me.fullUrl === true ? me._getScheme() + '://dev.' + me.appName + '.' + me.clientSubdomain + '.stackmobapp.com/' : '/';
    },

    /**
     * Returns the base URL for the production mode API
     * @return {String} Base URL (production)
     * @private
     */
    _getProdApiBase : function() {
        var me = this;
        return me.fullUrl === true ? me._getScheme() + '://' + me.appName + '.' + me.clientSubdomain + '.stackmobapp.com/' : '/';
    },

    /**
     * Whether or not development mode is being used
     * @return {Boolean} True iff development mode
     * @private
     */
    _isDevelopmentMode: function() {
        return (this.apiVersion === 0);
    }
});