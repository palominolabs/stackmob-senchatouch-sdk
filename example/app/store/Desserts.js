Ext.define('StackMobSenchaTouchDemo.store.Desserts', {
    extend: 'Ext.data.Store',

    config: {
        model: 'StackMobSenchaTouchDemo.model.Dessert',
        proxy: {
            type: 'stackmob',
            url: 'dessert'
        },
        remoteSort: true,
        autoLoad: true
    }
});