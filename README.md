StackMob Sencha Touch SDK
=========================

This project is a (work in progress) SDK for connecting a Sencha Touch application with StackMob via their
OAuth 2.0 REST API.  The SDK is very much in its infancy, and is in a state of flux.  Consider this very
much a beta.

Installation
-----

1. Place the extension in your codebase (might we suggest `ux/stackmob-senchatouch`). Note that you will need to
modify your classpath in `sencha.cfg` if you locate the `ux` folder outside of your `app` directory.

1. Tell `Ext.Loader` (in `app.js`) where to find the extension's namespace:

    ```javascript
    Ext.Loader.setConfig({
        enabled: true,
        paths: {
            'Ext': '/touch/src',
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
        publicKey: '<YOUR PUBLIC KEY>'
    });
    ```

    If you are accessing StackMob's API through a cross-origin domain, you will also need to add `enableCors: true` to the `init` config.

Usage
-----

### Stores and Models

To back an `Ext.Store` or `Ext.data.Model` with StackMob, simply use the `stackmob` proxy and supply the URL for the StackMob schema:
```javascript
Ext.define('YourAwesomeApp.store.NiftyStore', { // (or model)
    extend: 'Ext.data.Store', // (or Ext.data.Model)

    config: {
        model: 'YourAwesomeApp.model.NiftyThing',
        proxy: {
            type: 'stackmob',
            url: 'yourstackmobschemaname'
        }
    }
});
```

### AJAX

To make an AJAX call to StackMob without using an `Ext.Store`, simply use the `Ux.palominolabs.stackmob.StackMobAjax`
object wherever you would normally use `Ext.Ajax`:
```javascript
Ux.palominolabs.stackmob.StackMobAjax.request({
    url: 'yourstackmobobjectname',
    success: function(respose) {
        // ...
    },
    // ...
});
```

### Authentication

#### Logging In
To provide a login form for users to authenticate with StackMob, you can subclass
`Ux.palominolabs.stackmob.form.StackMobLoginForm`.  This form will add the appropriate headers
and hidden fields for you, and handle the authentication logic on successful submission.  All you have
to do is add the required fields, and then calling `submit` on the form will Just Work:
```javascript
Ext.define("StackMobSenchaTouchDemo.view.account.Login", {
    extend: 'Ux.palominolabs.stackmob.form.StackMobLoginForm',

    config: {
        items: [{
            xtype: 'fieldset',
            items: [{
                xtype: 'textfield',
                name: 'username',
                label: 'Username'
            },{
                xtype: 'passwordfield',
                name: 'password',
                label: 'Password'
            }]
        },{
            xtype: 'button',
            name: 'submit',
            action: 'login',
            text: 'Login'
        }]
    }
});
```

Note that the names of these fields should match the login field and password field defined in your
StackMob login schema.  The login schema itself is assumed to be `user`, but if you are using a
different schema name, you can customize it by specifying `loginSchema` in your call to `StackMobConnector.init`.

Once your user has logged in, you do not need to do anything special to support API calls that require
authentication.

#### Checking If a User Is Logged In

To check if a user is authenticated, call `Ux.palominolabs.stackmob.data.StackMobConnector.isAuthenticated()`.

#### Checking Which User Is Logged In

You can get the authenticated user's data by calling
`Ux.palominolabs.stackmob.data.StackMobConnector.getAuthenticatedUserData()`.  This will return an JavaScript
Object containing the fields for the StackMob object.

#### Logging Out

To logout, call `Ux.palominolabs.stackmob.data.StackMobConnector.logout()`.

Example
-------

See the README in the `example` directory for instructions on running the included example application.

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

Contributing
------------

This SDK is an open source project, so bug reports are welcome and pull requests are encouraged.  We'd also love
to hear your feedback - be it questions, comments, concerns, worries, whimpers, or whines.  Or feature requests.

Copyright
---------

Copyright 2012-2013 Palomino Labs, Inc.

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