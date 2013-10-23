Ext.define("StackMobSenchaTouchDemo.view.friend.Cards", {
    extend: 'Ext.Container',

    requires: [
        'StackMobSenchaTouchDemo.view.friend.Unauthorized',
        'StackMobSenchaTouchDemo.view.friend.Main'
    ],

    id: 'friendCardView',

    config: {

        title: 'Friends',
        iconCls: 'team',

        layout: 'card',
        items: [{
            xclass: "StackMobSenchaTouchDemo.view.friend.Unauthorized"
        },{
            xclass: "StackMobSenchaTouchDemo.view.friend.Main"
        }]
    }
});