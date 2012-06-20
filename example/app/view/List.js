Ext.define('StackMobSenchaTouchDemo.view.List', {
    extend: 'Ext.List',

    id: 'dessertList',

    config: {
        title: 'Desserts',

        store: 'Desserts',
        itemTpl: '{name}'
    }
});