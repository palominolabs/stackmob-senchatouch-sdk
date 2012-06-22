//<debug>
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': '/example/sdk/src',
        'StackMobSenchaTouchDemo': '/example/app',
        'Ux.palominolabs.stackmob': '/src'
    }
});
//</debug>

Ext.application({
    name: 'StackMobSenchaTouchDemo',

    requires: [
        'Ext.MessageBox',
        'Ux.palominolabs.stackmob.Loader'
    ],

    models: ['Dessert'],
    views: ['Tabs'],
    controllers: ['Desserts'],
    stores: ['Desserts'],

    launch: function() {
        // Initialize StackMob connection credentials
        Ux.palominolabs.stackmob.data.StackMobConnector.init({
            appName: 'stackmobdemo',
            clientSubdomain: 'andrewmitchell',
            publicKey: '1bef6219-bfaf-48a8-8564-a7e0f73e7f38'
        });

        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the tab view
        Ext.Viewport.add(Ext.create('StackMobSenchaTouchDemo.view.Tabs'));
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
