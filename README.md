StackMob Sencha Touch SDK
=========================

This project is a (work in progress) SDK for connecting a Sencha Touch application with StackMob via their
OAuth 2.0 REST API.  The SDK is very much in its infancy, and is in a state of flux.  Consider this very
much a beta.

Installation
-----

1. Place the extension in your codebase (might we suggest `ux/stackmob-senchatouch`).
1. Tell `Ext.Loader` (in `app.js`) where to find the extension's namespace:

    ```javascript
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'Ext': 'sdk/src',
            'Ux.palominolabs.stackmob': 'ux/stackmob-senchatouch'
        }
    });
    ```

1. Require the extension loader in your `Ext.Application`:

    ```javascript
    requires: ['Ux.palominolabs.stackmob.Loader'];
    ```

1. Supply your StackMob connection information (your `Ext.Application`'s `launch` function is a good place to do so):

    ```javascript
    Ux.palominolabs.stackmob.data.StackMobConnector.init({
        appName: '<YOUR APP NAME>',
        clientSubdomain: '<YOUR CLIENT SUBDOMAIN>',
        publicKey: '<YOUR PUBLIC KEY>'
    });
    ```

Usage
-----

To back an `Ext.Store` with StackMob, simply use the `stackmob` proxy and supply the URL for the StackMob schema:
```javascript
Ext.define('YourAwesomeApp.store.NiftyStore', {
    extend: 'Ext.data.Store',

    config: {
        model: 'YourAwesomeApp.model.NiftyThing',
        proxy: {
            type: 'stackmob',
            url: 'yourstackmobschemaname'
        }
    }
});
```

That's it!

Quick Note: Connecting to StackMob
----------------------

Keep in mind that, due to cross-domain restrictions, in order to communicate with StackMob from your
Sencha Touch app, you need to either [use StackMob's Local Runner](https://www.stackmob.com/platform/help/tutorials/html5_js_sdk#a-step_2_of_3:_running_this_file_locally)
(in a development environment) or [host your Sencha Touch app on StackMob](http://www.stackmob.com/devcenter/docs/Deploying-your-HTML5-App-to-Production)
(for production).

Also keep in mind that you must enable OAuth 2.0 for your StackMob application to use this extension.

Future Enhancements & Known Issues
----------------------------------

For the complete list (or to report a bug or request a feature), check out the
[issue tracker](https://github.com/tylerwolf/stackmob-senchatouch-sdk/issues), but the broad strokes are as follows:

- Filtering is coming soon.
- Support for associations is coming coon.
- Autoloading stores (i.e. setting `autoLoad: true`) does not work.  The request to StackMob will fail.  For now,
 you can work around this issue by manually calling `load()` on your store when the list is displayed.
- Currently only operations which are "open" (that is, only requiring a public key) are supported.  Support
for authenticated operations (those requiring a private key) is coming soon.

Okay... So What Does It Actually Do?
------------------------------------

The SDK currently supports using `Ext.Store`s to make basic, unauthenticated CRUD and AJAX requests to an
OAuth 2.0-enabled StackMob app.  From humble beginnings come great things.

Contributing
------------

This SDK is an open source project, so bug reports are welcome and pull requests are encouraged.  We'd also love
to hear your feedback - be it questions, comments, concerns, worries, whimpers, or whines.  Or feature requests.

Copyright
---------

Copyright 2012 Palomino Labs, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This product also includes software developed by:

 - Sencha Inc. (http://www.sencha.com)
 - StackMob, Inc. (http://www.stackmob.com)
 - Jeff Mott (http://code.google.com/p/crypto-js/)