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
 * A form panel for submitting into StackMob.  Adds a hidden field (if necessary) with
 * the OAuth token type, applies the required headers to the request, recognizes
 * successful StackMob requests (even though the response does not include
 * `success: true`), and handles authenticating the response from StackMob.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.form.StackMobForm", {
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
     * @param {String} options.url
     * @return {Ext.data.Connection} The requested object
     */
    submit: function(options) {
        var me = this,
            augmentedOptions = {
                headers: me.conn.getRequiredHeaders(options.method || 'POST', options.url)
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
     * @param {Ux.palominolabs.stackmob.form.StackMobForm} me The form
     * @param {Object} formValues The form values
     * @param {Object} options Options
     */
    doBeforeSubmit: function(me, formValues, options) {
        var form = me.element.dom || {};

        var multipartDetected = false;
        if(this.getMultipartDetection() === true) {
            this.getFieldsAsArray().forEach(function(field) {
                if(field.isFile === true) {
                    multipartDetected = true;
                    return false;
                }
            });

            if(multipartDetected) {
                form.setAttribute("enctype", "multipart/form-data");
            }
        }

        if(options.enctype) {
            form.setAttribute("enctype", options.enctype);
        }

        if (me.getStandardSubmit()) {
            if (options.url && Ext.isEmpty(form.action)) {
                form.action = options.url;
            }

            // Spinner fields must have their components enabled *before* submitting or else the value
            // will not be posted.
            var fields = this.query('spinnerfield'),
                ln = fields.length,
                i, field;

            for (i = 0; i < ln; i++) {
                field = fields[i];
                if (!field.getDisabled()) {
                    field.getComponent().setDisabled(false);
                }
            }

            form.method = (options.method || form.method).toLowerCase();
            form.submit();
        } else {
            var api = me.getApi(),
                url = options.url || me.getUrl(),
                scope = options.scope || me,
                waitMsg = options.waitMsg,
                failureFn = function(response, responseText) {
                    if (Ext.isFunction(options.failure)) {
                        options.failure.call(scope, me, response, responseText);
                    }

                    me.fireEvent('exception', me, response);
                },
                successFn = function(response, responseText) {
                    if (Ext.isFunction(options.success)) {
                        options.success.call(options.scope || me, me, response, responseText);
                    }

                    me.fireEvent('submit', me, response);
                },
                submit;

            if (options.waitMsg) {
                if (typeof waitMsg === 'string') {
                    waitMsg = {
                        xtype   : 'loadmask',
                        message : waitMsg
                    };
                }

                me.setMasked(waitMsg);
            }

            if (api) {
                submit = api.submit;

                if (typeof submit === 'string') {
                    submit = Ext.direct.Manager.parseMethod(submit);

                    if (submit) {
                        api.submit = submit;
                    }
                }

                if (submit) {
                    return submit(this.element, function(data, response, success) {
                        me.setMasked(false);

                        if (success) {
                            if (data.success) {
                                successFn(response, data);
                            } else {
                                failureFn(response, data);
                            }
                        } else {
                            failureFn(response, data);
                        }
                    }, this);
                }
            } else {
                var request = Ext.merge({},
                    {
                        url: url,
                        timeout: this.getTimeout() * 1000,
                        form: form,
                        scope: me
                    },
                    options
                );
                delete request.success;
                delete request.failure;

                request.params = Ext.merge(me.getBaseParams() || {}, options.params);
                request.header = Ext.apply(
                    {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    options.headers || {}
                );
                request.callback = function(callbackOptions, success, response) {
                    var me = this,
                        responseText = response.responseText,
                        responseXML = response.responseXML,
                        statusResult = Ext.Ajax.parseStatus(response.status, response);

                    me.setMasked(false);

                    if(response.success === false) success = false;
                    if (success) {
                        if (statusResult && responseText && responseText.length == 0) {
                            success = true;
                        } else {
                            if(!Ext.isEmpty(response.responseBytes)) {
                                success = statusResult.success;
                            }else {
                                if(Ext.isString(responseText) && response.request.options.responseType === "text") {
                                    response.success = true;
                                } else if(Ext.isString(responseText)) {
                                    try {
                                        response = Ext.decode(responseText);
                                    }catch (e){
                                        response.success = false;
                                        response.error = e;
                                        response.message = e.message;
                                    }
                                } else if(Ext.isSimpleObject(responseText)) {
                                    response = responseText;
                                    Ext.applyIf(response, {success:true});
                                }

                                if(!Ext.isEmpty(responseXML)){
                                    response.success = true;
                                }

                                // MODIFIED logic: originally success = !!response.success;
                                // StackMob does not return a success property in the response.
                                if (Ext.Array.contains(Ext.Object.getKeys(response), 'success')) {
                                    success = !!response.success;
                                } else {
                                    success = statusResult.success;
                                }
                            }
                        }
                        if (success) {
                            successFn(response, responseText);
                        } else {
                            failureFn(response, responseText);
                        }
                    }
                    else {
                        failureFn(response, responseText);
                    }
                };

                if(Ext.feature.has.XHR2 && request.xhr2) {
                    delete request.form;
                    var formData = new FormData(form);
                    if (request.params) {
                        Ext.iterate(request.params, function(name, value) {
                            if (Ext.isArray(value)) {
                                Ext.each(value, function(v) {
                                    formData.append(name, v);
                                });
                            } else {
                                formData.append(name, value);
                            }
                        });
                        delete request.params;
                    }
                    request.data = formData;
                }

                return Ext.Ajax.request(request);
            }
        }
    }
});