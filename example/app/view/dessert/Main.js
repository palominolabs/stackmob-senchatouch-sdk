Ext.define("StackMobSenchaTouchDemo.view.dessert.Main", {
    extend: 'Ext.navigation.View',

    requires: ['StackMobSenchaTouchDemo.view.dessert.List'],

    id: 'dessertMainView',

    config: {

        title: 'Desserts',
        iconCls: 'piechart',

        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.dessert.List'
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