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
                id: 'addButton',
                iconCls: 'add',
                iconMask: true,
                align: 'right'
            },{
                xtype: 'button',
                id: 'editButton',
                iconCls: 'compose',
                iconMask: true,
                align: 'right',
                hidden: true
            }]
        }
    }
});