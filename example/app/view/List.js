Ext.define('StackMobSenchaTouchDemo.view.List', {
    extend: 'Ext.List',

    id: 'dessertList',

    config: {
        title: 'Desserts',

        store: 'Desserts',
        itemTpl: '{name}',

        items: [{
            xtype: 'toolbar',
            docked: 'bottom',

            items: [{
                xtype: 'spacer'
            },{
                xtype: 'button',
                action: 'sortButton',
                text: 'Sort'
            }]
        }]
    }
});