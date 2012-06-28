Ext.define("StackMobSenchaTouchDemo.view.friend.Main", {
    extend: 'Ext.navigation.View',

    requires: ['StackMobSenchaTouchDemo.view.friend.List'],

    id: 'friendMainView',

    config: {

        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.friend.List'
        }],

        navigationBar: {
            items: [{
                xtype: 'button',
                action: 'addFriend',
                iconCls: 'add',
                iconMask: true,
                align: 'right'
            },{
                xtype: 'button',
                action: 'editFriend',
                iconCls: 'compose',
                iconMask: true,
                align: 'right',
                hidden: true
            }]
        }
    }
});