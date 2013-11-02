/**
 * Copyright 2012-2013 Palomino Labs, Inc.
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

    API_DOMAIN: 'api.stackmob.com',

    DEFAULT_API_VERSION: 0,

    DEFAULT_LOGIN_SCHEMA: 'user',

    SDK_NAME: "Sencha Touch",
    SDK_VERSION: "0.4.1",

    TOKEN_TYPE_MAC: 'mac',
    TOKEN_TYPE_BEARER: 'bearer',

    /**
     * Initializes the connection information required to communicate with StackMob.
     * @param {Object} options Configuration options
     * @param {String} options.appName The name of the StackMob application.
     * @param {String} options.publicKey The public key to use to sign OAuth 2.0 requests.
     * @param {String} [options.apiUrl] API URL to use.
     * @param {Number} [options.apiVersion=0] The StackMob API version.  Defaults to 0 (development).
     * @param {Boolean} [options.enableCors=false] True iff using CORS connection to StackMob
     * @param {String} [options.loginSchema='user'] The name of the StackMob schema with which to log in
     * @param {Boolean} [options.secure=false] True iff using HTTPS
     * @param {String} [options.urlRoot] A URL root to override the default
     * @return {Ux.palominolabs.stackmob.data.StackMobConnector} this
     */
    init: function(options) {
        var me = this;

        me._injectCryptoLibrary();

        options = options || {};

        me._verifyRequiredInitKeys(options);

        me.apiVersion = options.apiVersion || me.DEFAULT_API_VERSION;
        me.appName = options.appName;

        me.publicKey = options.publicKey;
        me.apiUrl = options.apiUrl;

        me.enableCors = options.enableCors || false;

        me.urlRoot = options.urlRoot || me._getBaseUrl();

        me.loginSchema = options.loginSchema || me.DEFAULT_LOGIN_SCHEMA;

        me.secure = (options.secure === true);
        me.tokenType = (me.secure) ? me.TOKEN_TYPE_BEARER : me.TOKEN_TYPE_MAC;

        return this;
    },

    /**
     * Whether or not a user has been authenticated with StackMob
     * @return {Boolean} True iff there is a logged in user
     */
    isAuthenticated: function() {
        var storage = Ux.palominolabs.stackmob.data.StackMobStorage;
        return storage.get(storage.KEYS.ACCESS_TOKEN)
            && storage.get(storage.KEYS.MAC_KEY)
            && ((new Date()).getTime() <= storage.get(storage.KEYS.ACCESS_TOKEN_EXPIRATION));
    },

    /**
     * Sends request to StackMob REST API to logout user and destroys stored
     * authentication information to mark the connection as unauthenticated.
     */
    logout: function() {
        var me = this,
            storage = Ux.palominolabs.stackmob.data.StackMobStorage,
            url = [me.getLoginSchema(), '/logout'].join("");

        Ux.palominolabs.stackmob.StackMobAjax.request({
            url: url,
            headers: me.getRequiredHeaders('GET', url)
        });

        Ext.Object.each(storage.KEYS, function(key, value, object) {
            storage.remove(value);
        });
    },

    /**
     * Send request to StackMob REST API to create a new user.
     * This API is needed because STackMob's user table's primary key is username.
     * @param {Object} options
     * @param {Object} options.userData the data to create the new user with
     * @param {Function} [options.failure] failure callback for request
     * @param {Function} [options.success] success callback for request
     */
    createUser: function(options) {
        var me = this,
            url = this.getLoginSchema(),
            augmentedOptions = {
                url: url,
                headers: me.getRequiredHeaders('POST', url),
                jsonData: options.userData
            };

        Ext.applyIf(augmentedOptions, options);
        Ux.palominolabs.stackmob.StackMobAjax.request(augmentedOptions);
    },

    /**
     * Send request to StackMob REST API to reset current user's password.
     * @param {Object} options
     * @param {String} options.oldPassword the current password for the logged in user
     * @param {String} options.newPassword the new password to switch to
     * @param {Function} [options.failure] failure callback for request
     * @param {Function} [options.success] success callback for request
     */
    resetPassword: function(options) {
        var me = this,
            url = [this.getLoginSchema(), '/resetPassword'].join(""),
            augmentedOptions = {
                url: url,
                headers: me.getRequiredHeaders('POST', url),
                jsonData: {
                    old: {password: options.oldPassword},
                    new: {password: options.newPassword}
                }
            };

        Ext.applyIf(augmentedOptions, options);
        Ux.palominolabs.stackmob.StackMobAjax.request(augmentedOptions);
    },

    /**
     * Send a request to StackMob REST API for a forgotten password.
     * StackMob will send them an email with the temporary password.
     * @param {Object} options
     * @param {String} options.username username for forgotten password
     * @param {function} [options.failure] failure callback for request
     */
    forgotPassword: function(options) {
        var me = this,
            url = [this.getLoginSchema(), '/forgotPassword'].join(""),
            augmentedOptions = {
                url: url,
                headers: me.getRequiredHeaders('POST', url),
                jsonData: {
                    username: options.username
                }
            };

        Ext.applyIf(augmentedOptions, options);
        Ux.palominolabs.stackmob.StackMobAjax.request(augmentedOptions);
    },

    /**
     * The data returned from StackMob as the authenticated user after login
     * @return {Object} The authenticated user data
     */
    getAuthenticatedUserData: function() {
        var storage = Ux.palominolabs.stackmob.data.StackMobStorage;
        return Ext.JSON.decode(storage.get(storage.KEYS.AUTHENTICATED_AS));
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

    getLoginSchema: function() {
        return this.loginSchema;
    },

    /**
     * Returns the URL for the StackMob Rest API login call
     * @returns {string} The login url
     */
    getLoginUrl: function() {
        return [this.getUrlRoot(), this.getLoginSchema(), '/accessToken'].join("");
    },

    getTokenType: function() {
        return this.tokenType;
    },

    /**
     * Assembles an object containing the required headers required for communication with StackMob's
     * REST API using OAuth 2.0
     * @param {String} method The HTTP method verb
     * @param {String} url The URL for this request
     * @return {Object} Headers
     */
    getRequiredHeaders: function(method, url) {
        var me = this,
            storage = Ux.palominolabs.stackmob.data.StackMobStorage,
            headers = {
                'Accept': ['application/vnd.stackmob+json; version=', me.getApiVersion()].join(""),
                'X-StackMob-User-Agent': ['StackMob (', me.getSdkName(),'; ', me.getSdkVersion(), ')/', me.getAppName()].join("")
            },
            host = (me.urlRoot || '').replace(new RegExp('^http://|^https://'), '').replace(new RegExp('/'), ''),
            path = (url || '').replace(new RegExp('^' + me.urlRoot), '/').replace(new RegExp('^([^/])'), '/$1');

        if (me.enableCors) {
            headers['X-StackMob-API-Key-' + me.getPublicKey()] = 1;
        } else {
            headers['X-StackMob-API-Key'] = me.getPublicKey();
        }

        if (me.isAuthenticated() && method && url) {
            headers['Authorization'] = me._generateMAC(method, storage.get(storage.KEYS.ACCESS_TOKEN), storage.get(storage.KEYS.MAC_KEY), host, path);
        }
        return headers;
    },

    /**
     * Handles the response from StackMob for a login call.
     * @param {Object} response The response from StackMob
     * @private
     */
    _handleAuthentication: function(response) {
        var me = this,
            storage = Ux.palominolabs.stackmob.data.StackMobStorage;
        if (response.access_token && response.token_type && (response.token_type == me.TOKEN_TYPE_MAC || response.token_type == me.TOKEN_TYPE_BEARER)) {
            storage.set(storage.KEYS.ACCESS_TOKEN, response.access_token);
            storage.set(storage.KEYS.AUTHENTICATED_AS, Ext.JSON.encode(response.stackmob[me.loginSchema]));
            storage.set(storage.KEYS.ACCESS_TOKEN_EXPIRATION, (new Date()).getTime() + (response.expires_in * 1000));
            if (response.token_type == me.TOKEN_TYPE_MAC) {
                storage.set(storage.KEYS.MAC_KEY, response.mac_key);
            }
        }
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
        return ['appName', 'publicKey'];
    },

    /**
     * Returns the scheme to use when connecting with StackMob
     * @return {String} Scheme
     * @private
     */
    _getScheme : function() {
        return (this.secure) ? 'https' : 'http';
    },

    /**
     * Constructs the base URL to use for all StackMob API requests
     * @return {String} The base URL
     * @private
     */
    _getBaseUrl: function() {
        var me = this,
            loc = window.location,
            url;
        if (me.apiUrl) {
            url = me.apiUrl;
        } else if (me.enableCors === true) {
            url = me._getScheme() + '://' + me.API_DOMAIN + '/';
        } else {
            url = [loc.protocol, '//', loc.hostname, ':', loc.port, '/'].join("");
        }
        return url;
    },

    /**
     * Whether or not development mode is being used
     * @return {Boolean} True iff development mode
     * @private
     */
    _isDevelopmentMode: function() {
        return (this.apiVersion === 0);
    },

    /**
     * Injects the Google Crypto library.
     * @private
     */
    _injectCryptoLibrary: function() {
        Ux.palominolabs.stackmob.util.CryptoLoader.load();
    },

    _createBaseString: function(ts, nonce, method, uri, host, port) {
        var nl = '\u000A';
        return ts + nl + nonce + nl + method + nl + uri + nl + host + nl + port + nl + nl;
    },

    _bin2String: function(array) {
        var result = "";
        for ( var i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i]);
        }
        return result;
    },

    _generateMAC: function(method, accessToken, macKey, hostWithPort, relativeUrl) {
        var me = this,
            splitHost = hostWithPort.split(':'),
            hostNoPort = splitHost.length > 1 ? splitHost[0] : hostWithPort,
            port = splitHost.length > 1 ? splitHost[1] : 80,
            ts = Math.round(new Date().getTime() / 1000),
            nonce = "n" + Math.round(Math.random() * 10000),
            base = me._createBaseString(ts, nonce, method, relativeUrl, hostNoPort, port),
            bstring = me._bin2String(Crypto.HMAC(Crypto.SHA1, base, macKey, {
                asBytes : true
            })),
            mac = btoa(bstring);
        return 'MAC id="' + accessToken + '",ts="' + ts + '",nonce="' + nonce + '",mac="' + mac + '"';
    }
});