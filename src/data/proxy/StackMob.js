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
 * A proxy for communicating with StackMob's REST API.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.data.proxy.StackMob", {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.stackmob',

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        // Disable cache busting, since StackMob rejects the GET params added by ServerProxy.
        noCache: false
    },

    /**
     * Specialized version of getHeaders which merges in the required OAuth 2.0 headers for StackMob
     * @return {Object} Headers
     */
    getHeaders: function() {
        var me = this;
        return Ext.applyIf(me._headers || {}, me._getStandardHeaders());
    },

    /**
     * Specialized version of getParams which returns an empty object
     * @private
     */
    getParams: function(operation) {
        return {};
    },

    /**
     * Specialized version of buildRequest which assembles the correct headers for StackMob.
     * @param {Ext.data.Operation} operation The {@link Ext.data.Operation Operation} object to execute
     * @return {Ext.data.Request} The request object
     */
    buildRequest: function(operation) {
        var me = this,
            params = Ext.applyIf(operation.getParams() || {}, me.getExtraParams() || {}),
            headers = me.getHeaders(),
            request;

        //copy any sorters, filters etc into the params so they can be sent over the wire
        // TODO: undo this and re-implement in a StackMob-compliant manner (request headers)
        params = Ext.applyIf(params, me.getParams(operation));

        request = Ext.create('Ext.data.Request', {
            headers  : headers,
            params   : params,
            action   : operation.getAction(),
            records  : operation.getRecords(),
            url      : operation.getUrl(),
            operation: operation,
            proxy    : me
        });

        request.setUrl(me.buildUrl(request));
        operation.setRequest(request);

        return request;
    },

    /**
     * Specialized version of doRequest with operation-specific headers
     * @protected
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            headers = Ext.applyIf(Ext.applyIf({}, me.getHeaders()), me._getAdditionalHeaders(operation));

        request.setConfig({
            headers        : headers,
            timeout        : me.getTimeout(),
            method         : me.getMethod(request),
            callback       : me.createRequestCallback(request, operation, callback, scope),
            scope          : me
        });

        if (operation.getWithCredentials() || me.getWithCredentials()) {
            request.setWithCredentials(true);
        }

        // We now always have the writer prepare the request
        request = writer.write(request);

        Ext.Ajax.request(request.getCurrentConfig());

        return request;
    },

    /**
     * Specialized version of buildUrl which returns the appropriate StackMob API URL
     * @param {Ext.data.Request} request The request object
     * @return {String} The URL
     */
    buildUrl: function(request) {
        var me = this;
        return [me.conn.getUrlRoot(), me.callParent(arguments)].join('');
    },

    /**
     * Specialized version of encodeSorters which assembles the sorters into StackMob's desired format
     * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
     * @return {String} The encoded sorters
     */
    encodeSorters: function(sorters) {
        var min = [],
            length = sorters.length,
            i = 0;

        for (; i < length; i++) {
            min[i] = [sorters[i].getProperty(), sorters[i].getDirection()].join(":");
        }
        return min.join(",");

    },

    /**
     * Assembles an object containing the standard headers required for communication with StackMob's
     * REST API using OAuth 2.0
     * @return {Object} Headers
     */
    _getStandardHeaders: function() {
        var me = this;

        return {
            'Accept': ['application/vnd.stackmob+json; version=', me.conn.getApiVersion()].join(""),
            'X-StackMob-API-Key': me.conn.getPublicKey(),
            'X-StackMob-Proxy-Plain': 'stackmob-api',
            'X-StackMob-User-Agent': ['StackMob (', me.conn.getSdkName(),'; ', me.conn.getSdkVersion(), ')/', me.conn.getAppName()].join("")
        };
    },

    /**
     * Assembles an object containing additional headers, such as paging
     * @param {Ext.data.Operation} operation The operation
     * @return {Object} Headers
     * @private
     */
    _getAdditionalHeaders: function(operation) {
        var me = this,
            headers = {},
            start = operation.getStart(),
            limit = operation.getLimit(),
            sorters = operation.getSorters(),
            end;

        if (me.getEnablePagingParams() && (start !== null) && (limit !== null)) {
            end = start + limit - 1;
            headers['Range'] = ['objects=', start, '-', end].join("");
        }

        if (sorters && sorters.length > 0) {
            headers['X-StackMob-OrderBy'] = me.encodeSorters(sorters);
        }

        return headers;
    }

});