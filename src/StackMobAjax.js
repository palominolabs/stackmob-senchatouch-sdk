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
 * A singleton for making AJAX requests to StackMob.  Automatically adds the required
 * headers, and constructs the full URL.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.StackMobAjax", {
    extend: "Ext.data.Connection",
    singleton: true,

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        disableCaching: false
    },

    /**
     * @property {Boolean} autoAbort
     * Whether a new request should abort any pending requests.
     */
    autoAbort : false,

    /**
     * Specialized version of setupHeaders which adds the required StackMob headers.
     * @param {Object} xhr The xhr object
     * @param {Object} options The options
     * @param {Object} data The data
     * @param {Object} params The params
     * @return {Object} Headers
     */
    setupHeaders: function(xhr, options, data, params) {
        var me = this,
            method = (options.method || me.getMethod() || ((params || data) ? 'POST' : 'GET')).toUpperCase(),
            url = options.url,
            headers = me.conn.getRequiredHeaders(method, url);
        options.headers = Ext.applyIf(headers, options.headers || {});
        return me.callParent([xhr, options, data, params]);
    },

    /**
     * Specialized version of setupUrl to prepend the StackMob URL root
     * @param {Object} options
     * @param {String} url
     * @return {String} The modified url
     */
    setupUrl: function(options, url) {
        var me = this;
        return [me.conn.getUrlRoot(), me.callParent(arguments)].join('');
    }
});