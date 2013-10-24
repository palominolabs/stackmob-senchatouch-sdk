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
 * A wrapper around localStorage, for persisting StackMob authentication information.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.data.StackMobStorage", {
    singleton: true,

    STORAGE_PREFIX: 'stackmob.',
    KEYS: {
        ACCESS_TOKEN: 'accessToken',
        AUTHENTICATED_AS: 'authenticatedAs',
        ACCESS_TOKEN_EXPIRATION: 'accessTokenExpiration',
        MAC_KEY: 'macKey'
    },

    storageObject: window.localStorage,

    /**
     * Constructor to warn if localStorage is unavailable
     * @param config Config
     */
    constructor: function(config) {
        var me = this;
        me.callParent(arguments);
        if (!me.storageObject) {
            Ext.Logger.warn('Browser does not support local storage.  Data will not be persisted.');
        }
    },

    /**
     * Sets the key, value pair in local storage
     * @param {String} key Key
     * @param {String} value Value
     */
    set: function(key, value) {
        var me = this;
        if (me.storageObject) {
            me.storageObject.setItem(me._getKeyNamed(key), value);
        }
    },

    /**
     * Gets the key from localStorage
     * @param {String} key Key
     * @return {String} The value saved at this key
     */
    get: function(key) {
        var me = this;
        if (me.storageObject) {
            return me.storageObject.getItem(me._getKeyNamed(key));
        } else {
            return null;
        }
    },

    /**
     * Removes the data with the given key
     * @param {String} key Key
     */
    remove: function(key) {
        var me = this;
        if (me.storageObject) {
            me.storageObject.removeItem(me._getKeyNamed(key));
        }
    },

    /**
     * Returns the namespaced key for the given public key
     * @param {String} key Key
     * @return {String} Namespaced key
     * @private
     */
    _getKeyNamed: function(key) {
        return this.STORAGE_PREFIX + key;
    }

});