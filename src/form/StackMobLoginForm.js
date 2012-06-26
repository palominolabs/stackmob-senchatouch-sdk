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
 * A form panel for logging into StackMob.  Adds a hidden field (if necessary) with
 * the OAuth token type, applies the required headers to the request, recognizes
 * successful StackMob requests (even though the response does not include
 * `success: true`), and handles authenticating the response from StackMob.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.form.StackMobLoginForm", {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.field.Hidden'
    ],

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    /**
     * Specialized initialize function which adds the OAuth token type hidden form
     * field if such a field does not already exist.
     */
    initialize: function() {
        var me = this,
            hidden;
        me.callParent(arguments);
        hidden = me.down('hiddenfield[name=token_type]');
        if (!hidden) {
            me.add({
                xtype: 'hiddenfield',
                name: 'token_type',
                value: me.conn.getTokenType()
            });
        }
    },

    /**
     * Specialized submit function which adds the required StackMob headers, and wraps the
     * given success function (if any) in another function which handles the authentication
     * response processing.
     * @param {Object} options
     * @return {Ext.data.Connection} The requested object
     */
    submit: function(options) {
        var me = this,
            relativeUrl = [me.conn.getLoginSchema(), '/accessToken'].join(""),
            augmentedOptions = {
                url: [me.conn.getUrlRoot(), relativeUrl].join(""),
                headers: me.conn.getRequiredHeaders(options.method || 'POST', relativeUrl)
            };
        Ext.applyIf(augmentedOptions, options);
        augmentedOptions.success = function(form, result) {
            me.conn._handleAuthentication(result);
            if (Ext.isFunction(options.success)) {
                return options.success(form, result);
            }
        };
        return me.callParent([augmentedOptions]);
    },

    /**
     * Specialized version of doBeforeSubmit which does not check for a 'success' property in the
     * response JSON.  Everything else is exactly the same.  This is very fragile.
     * @param {Ux.palominolabs.stackmob.form.StackMobLoginForm} me The form
     * @param {Object} formValues The form values
     * @param {Object} options Options
     */
    doBeforeSubmit: function(me, formValues, options) {
        var form = me.element.dom || {};

        if (me.getStandardSubmit()) {
            if (options.url && Ext.isEmpty(form.action)) {
                form.action = options.url;
            }

            form.method = (options.method || form.method).toLowerCase();
            form.submit();
        }
        else {
            if (options.waitMsg) {
                me.setMasked(options.waitMsg);
            }

            return Ext.Ajax.request({
                url: options.url,
                method: options.method,
                rawData: Ext.urlEncode(Ext.apply(
                    Ext.apply({}, me.getBaseParams() || {}),
                    options.params || {},
                    formValues
                )),
                autoAbort: options.autoAbort,
                headers: Ext.apply(
                    {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    options.headers || {}
                ),
                scope: me,
                callback: function(callbackOptions, success, response) {
                    var me = this,
                        responseText = response.responseText,
                        failureFn;

                    me.setMasked(false);

                    failureFn = function() {
                        if (Ext.isFunction(options.failure)) {
                            options.failure.call(options.scope || me, me, response, responseText);
                        }
                        me.fireEvent('exception', me, response);
                    };

                    if (success) {
                        response = Ext.decode(responseText);
                        // REMOVED logic: success = !!response.success;
                        // StackMob does not return a success property in the response.
                        if (success) {
                            if (Ext.isFunction(options.success)) {
                                options.success.call(options.scope || me, me, response, responseText);
                            }
                            me.fireEvent('submit', me, response);
                        } else {
                            failureFn();
                        }
                    }
                    else {
                        failureFn();
                    }
                }
            });
        }
    }
});