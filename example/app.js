/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

//<debug>
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': '/touch/src',
        'StackMobSenchaTouchDemo': '/app',
        'Ux': 'Ux'
    }
});
//</debug>

Ext.application({
    name: 'StackMobSenchaTouchDemo',

    requires: [
        'Ext.MessageBox',
        'Ux.palominolabs.stackmob.Loader'
    ],

    models: [
        'Dessert',
        'Friend',
        'User'
    ],
    views: ['Tabs'],
    controllers: [
        'Account',
        'Desserts',
        'Friends'
    ],
    stores: [
        'Desserts',
        'Friends'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    stackMob: {
        enableCors: true,
        appName: 'stackmobdemo',
        publicKey: '1bef6219-bfaf-48a8-8564-a7e0f73e7f38'
    },

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('StackMobSenchaTouchDemo.view.Tabs'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    setLoggedInUser: function (user) {
        this.LOGGED_IN_USER = user;
        if (user) {
            window.localStorage.setItem("STACKMOB_SDK_USER_DATA", Ext.encode(user.getData()));
        } else {
            window.localStorage.setItem("STACKMOB_SDK_USER_DATA", null);
        }
    },

    getLoggedInUser: function () {
        if (!this.LOGGED_IN_USER){
            var userData = Ext.decode(window.localStorage.getItem("STACKMOB_SDK_USER_DATA"));
            if (userData) {
                this.LOGGED_IN_USER = Ext.create('StackMobSenchaTouchDemo.model.User', {data: userData});
            }
        }
        return this.LOGGED_IN_USER;
    }
});