Ext.define("StackMobSenchaTouchDemo.view.account.Profile", {
    extend: 'Ext.Container',

    id: 'profilePanel',

    config: {
        items: [{
            xtype: 'toolbar',
            title: 'Profile'
        },{
            id: 'profileDetails',
            tpl: '<div>Logged in as <strong>{username}</strong></div>',
            styleHtmlContent: true
        }]
    },

    setRecord: function(newRecord) {
        this.down('#profileDetails').setData(newRecord);
    }
});