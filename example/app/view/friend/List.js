Ext.define('StackMobSenchaTouchDemo.view.friend.List', {
    extend: 'Ext.List',

    id: 'friendList',

    config: {
        title: 'Friends',

        store: 'Friends',
        itemTpl: '{name}',

        items: [{
            xtype: 'toolbar',
            docked: 'bottom',

            items: [{
                xtype: 'spacer'
            },{
                xtype: 'button',
                action: 'sortFriendsButton',
                text: 'Sort'
            }]
        }]
    }
});