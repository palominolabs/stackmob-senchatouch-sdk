Ext.define("StackMobSenchaTouchDemo.view.friend.Unauthorized", {
    extend: 'Ext.Container',

    id: 'friendUnauthorizedView',

    config: {
        layout: 'vbox',
        items: [{
            html: 'You must be logged in to view friends.',
            styleHtmlContent: true
        },{
            xtype: 'button',
            action: 'goToLogin',
            text: 'Login',
            ui: 'action',
            margin: 10
        }]
    }
});