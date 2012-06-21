Ext.define("StackMobSenchaTouchDemo.view.Details", {
    extend: "Ext.Container",

    config: {
        title: 'Details',
        id: 'detailsView',

        items: [{
            id: 'dessertDetails',
            tpl: '<div>{name}</div>',
            styleHtmlContent: true
        },{
            xtype: 'button',
            action: 'deleteDessert',
            text: 'Delete',
            ui: 'decline',
            docked: 'bottom',
            margin: 10
        }]
    },

    setRecord: function(newRecord) {
        if (newRecord) {
            this.down('#dessertDetails').setData(newRecord.data);
        }
    },

    updateRecord: function(newRecord) {
        if (newRecord) {
            this.down('#dessertDetails').updateData(newRecord.data);
        }
    }
});