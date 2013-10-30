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
 * A utility class to add more data types to the {@link Ext.data.Types Ext.data.Types} object.
 *
 * @author Tyler Wolf
 */
Ext.define('Ux.palominolabs.stackmob.data.Types', {
    singleton: true,

    requires: [
        'Ext.data.Types',
        'Ux.palominolabs.stackmob.util.File'
    ],

    /**
     * Adds data types to {@link Ext.data.Types Ext.data.Types}
     */
    install: function () {
        Ext.apply(Ext.data.Types, {
            // A data type for fields which map to StackMob binary fields
            STACKMOBBINARY: {
                convert: function(value, record) {
                    return value;
                },
                sortType: function(v) {
                    return v;
                },
                type: 'stackmobbinary'
            }
        });
    }
});