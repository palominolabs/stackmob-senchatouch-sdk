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
 * A specialized {@link Ext.data.writer.Json Json writer} which converts binary data URL fields into MIME document
 * ... strings when writing to StackMob
 *
 * @author Tyler Wolf
 */
Ext.define('Ux.palominolabs.stackmob.data.writer.StackMob', {
    extend: 'Ext.data.writer.Json',

    alias: 'writer.stackmob',

    /**
     * Overrides {@link Ext.data.writer.Json.getRecords getRecords} to subsequently re-encode binary field data
     * ... into the suitable transport format (see
     * ... {@link Ux.palominolabs.stackmob.data.writer.StackMob.writeStackMobBinary writeStackMobBinary}).
     * @override
     */
    getRecordData: function (record) {
        var me = this,
            data = me.callParent(arguments),
            isPhantom = record.phantom === true,
            writeAll = me.getWriteAllFields() || isPhantom,
            nameProperty = me.getNameProperty(),
            fields = record.getFields(),
            changes, name, field, key, value;

        // Mimics the logic of the parent method, but only alters fields of type
        // ... {@link Ux.palominolabs.stackmob.data.Types stackmobbinary}.

        if (writeAll) {
            fields.each(function(field) {
                if (field.getPersist()) {
                    name = field.config[nameProperty] || field.getName();
                    value = record.get(field.getName());
                    if (field.getType().type == 'stackmobbinary') {
                        // Overwrite stackmobbinary field values with StackMob-formatted representations
                        value = me.writeStackMobBinary(value);
                        data[name] = value;
                    }
                }
            }, this);
        } else {
            // Only write the changes
            changes = record.getChanges();
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    field = fields.get(key);
                    if (field.getPersist()) {
                        name = field.config[nameProperty] || field.getName();
                        value = changes[key];
                        if (field.getType().type == 'stackmobbinary') {
                            // Overwrite stackmobbinary field values with StackMob-formatted representations
                            value = me.writeStackMobBinary(value);
                            data[name] = value;
                        }
                    }
                }
            }
        }

        return data;
    },

    /**
     * Given a stackmobbinary field value, returns the field data in StackMob's binary field format if it is data
     * ... URL with an embedded filename.  Otherwise, the value is passed through.
     * @param {String} value The field value
     * @returns {String} StackMob MIME document string, if possible.  Otherwise, the value.
     */
    writeStackMobBinary: function (value) {
        if (!value) {
            return null;
        }

        if (Ux.palominolabs.stackmob.util.File.isDataUrlWithFilename(value)) {
            return Ux.palominolabs.stackmob.util.File.generateStackMobBinaryDataForDataUrlWithFilename(value);
        } else {
            return value;
        }

    }
});
