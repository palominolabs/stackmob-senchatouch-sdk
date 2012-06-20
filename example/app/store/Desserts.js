Ext.define('StackMobSenchaTouchDemo.store.Desserts', {
    extend: 'Ext.data.Store',

    config: {
        model: 'StackMobSenchaTouchDemo.model.Dessert',
        sorters: 'name',
        proxy: {
            type: 'stackmob',
            url: 'dessert'
        }
    }
});