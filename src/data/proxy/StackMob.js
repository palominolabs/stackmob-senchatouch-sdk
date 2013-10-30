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
 * A proxy for communicating with StackMob's REST API.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.data.proxy.StackMob", {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.stackmob',

    requires: [
        'Ux.palominolabs.stackmob.data.writer.StackMob'
    ],

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        // Use the stackmob writer, to handle binary fields
        writer: {
            type: 'stackmob'
        },
        // Disable cache busting, since StackMob rejects the GET params added by ServerProxy.
        noCache: false
    },

    /**
     * Specialized version of getHeaders which merges in the optional headers (operation-specific) for StackMob
     * @param {Ext.data.Operation} operation The operation
     * @return {Object} Headers
     */
    getHeaders: function(operation) {
        var me = this;
        return Ext.applyIf(me._headers || {}, me._getAdditionalHeaders(operation));
    },

    /**
     * Specialized version of getParams which returns an empty object
     * @private
     */
    getParams: function(operation) {
        return {};
    },

    /**
     * Specialized version of doRequest with operation-specific and request-specific headers
     * @protected
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation);

        request.setConfig({
            headers        : me.getHeaders(operation),
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

        // Use the StackMobAjax object, which will add any required StackMob authentication headers
        Ux.palominolabs.stackmob.StackMobAjax.request(request.getCurrentConfig());

        return request;
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
    }

});