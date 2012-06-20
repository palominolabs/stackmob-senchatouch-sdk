Ext.define('StackMobSenchaTouchDemo.model.Dessert', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'dessert_id',
        fields: [
            {name: 'dessert_id', type: 'auto', persist: false},
            'name'
        ]
    }
});