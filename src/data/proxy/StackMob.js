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
    getHeaders: function(method, relativeUrl) {
        var me = this;
        return Ext.applyIf(me._headers || {}, me.conn.getRequiredHeaders(method, relativeUrl));
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
            url = operation.getUrl(),
            relativeUrl = me._extractRelativeUrl(url),
            headers,
            request;

        params = Ext.applyIf(params, me.getParams(operation));

        request = Ext.create('Ext.data.Request', {
            params   : params,
            action   : operation.getAction(),
            records  : operation.getRecords(),
            url      : url,
            operation: operation,
            proxy    : me
        });

        request.setUrl(me.buildUrl(request));

        // Construct the headers after the request and apply them, since we need request data
        // ... to be able to determine which headers to use.
        headers = me.getHeaders(me.getMethod(request), relativeUrl);
        request.setHeaders(headers);

        operation.setRequest(request);

        return request;
    },

    /**
     * Specialized version of doRequest with operation-specific and request-specific headers
     * @protected
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            method = me.getMethod(request),
            url = me.getUrl(request),
            relativeUrl = me._extractRelativeUrl(url);

        request.setConfig({
            timeout        : me.getTimeout(),
            method         : method,
            callback       : me.createRequestCallback(request, operation, callback, scope),
            scope          : me
        });

        if (operation.getWithCredentials() || me.getWithCredentials()) {
            request.setWithCredentials(true);
        }

        // Construct the headers after the request and apply them, since we need request data
        // ... to be able to determine which headers to use.
        request.setHeaders(Ext.applyIf(Ext.applyIf({}, me.getHeaders(method, relativeUrl)), me._getAdditionalHeaders(operation)));

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
    },

    /**
     * Extracts the relative portion of the given StackMob API URL
     * @param {String} url The full URL
     * @return {String} THe relative portion of the URL
     * @private
     */
    _extractRelativeUrl: function(url) {
        if (url) {
            var regex = new RegExp(Ext.String.escapeRegex("^", + this.conn.getUrlRoot()));
            return url.replace(regex, "");
        }
    }

});