Ext.define("StackMobSenchaTouchDemo.view.Main", {
    extend: 'Ext.navigation.View',

    requires: ['StackMobSenchaTouchDemo.view.List'],

    id: 'mainView',

    config: {

        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.List'
        }],

        navigationBar: {
            items: [{
                xtype: 'button',
                action: 'addDessert',
                iconCls: 'add',
                iconMask: true,
                align: 'right'
            },{
                xtype: 'button',
                action: 'editDessert',
                iconCls: 'compose',
                iconMask: true,
                align: 'right',
                hidden: true
            }]
        }
    }
});