Ext.define('StackMobSenchaTouchDemo.model.User', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'username',
        fields: [
            {name: 'username', type: 'auto', persist: false},
            {name: 'picture', type: 'stackmobbinary'}
        ],
        proxy: {
            type: 'stackmob',
            url: 'user'
        }
    }
});