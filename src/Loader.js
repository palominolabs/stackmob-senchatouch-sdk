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
 * Loads all required components of the user extension when required.
 *
 * @author Tyler Wolf
 */
Ext.define("Ux.palominolabs.stackmob.Loader", {
    requires: [
        "Ux.palominolabs.stackmob.util.CryptoLoader", // Must require crypto loader first
        "Ux.palominolabs.stackmob.data.StackMobConnector", // Must require the connector next
        "Ux.palominolabs.stackmob.app.Application",
        "Ux.palominolabs.stackmob.util.File",
        "Ux.palominolabs.stackmob.StackMobAjax",
        'Ux.palominolabs.stackmob.data.Types',
        "Ux.palominolabs.stackmob.data.proxy.StackMob",
        "Ux.palominolabs.stackmob.data.StackMobStorage",
        "Ux.palominolabs.stackmob.form.StackMobForm"
    ]
}, function () {
    // Extend the static list of data types once the Loader has finished loading
    Ux.palominolabs.stackmob.data.Types.install();
});