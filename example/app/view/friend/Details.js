Ext.define("StackMobSenchaTouchDemo.view.friend.Details", {
    extend: "Ext.Container",

    config: {
        title: 'Details',
        id: 'detailsView',

        items: [{
            id: 'friendDetails',
            tpl: '<div>{name}</div>',
            styleHtmlContent: true
        },{
            xtype: 'button',
            action: 'deleteFriend',
            text: 'Delete',
            ui: 'decline',
            docked: 'bottom',
            margin: 10
        }]
    },

    setRecord: function(newRecord) {
        if (newRecord) {
            this.down('#friendDetails').setData(newRecord.data);
        }
    },

    updateRecord: function(newRecord) {
        if (newRecord) {
            this.down('#friendDetails').updateData(newRecord.data);
        }
    }
});