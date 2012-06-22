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
     * Specialized version of getDefaultHeaders which merges in the required StackMob headers
     * @return {Object} Headers
     */
    getDefaultHeaders: function() {
        var me = this;
        return Ext.applyIf(me.callParent(arguments) || {}, me.conn.getRequiredHeaders());
    }
});