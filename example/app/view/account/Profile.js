Ext.define("StackMobSenchaTouchDemo.view.account.Profile", {
    extend: 'Ext.Container',

    requires: [
        'Ext.field.File'
    ],

    id: 'profilePanel',

    config: {
        items: [{
            xtype: 'toolbar',
            title: 'Profile'
        },{
            id: 'profileDetails',
            tpl: '<div>Logged in as <strong>{username}</strong></div><tpl if="picture"><img src={picture}></tpl>',
            styleHtmlContent: true
        },{
            xtype: 'button',
            action: 'savePicture',
            text: 'Save Picture',
            hidden: true,
            margin: 10
        },{
            xtype: 'filefield',
            label: 'Set Profile Picture',
            id: 'profileImageField'
        },{
            xtype: 'button',
            action: 'showResetPassword',
            text: 'Reset Password',
            margin: 10
        },{
            xtype: 'button',
            action: 'logout',
            text: 'Logout',
            ui: 'decline',
            docked: 'bottom',
            margin: 10
        }]
    }
});