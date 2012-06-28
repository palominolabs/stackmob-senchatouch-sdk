Ext.define('StackMobSenchaTouchDemo.model.Friend', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'friend_id',
        fields: [
            {name: 'friend_id', type: 'auto', persist: false},
            'name'
        ],
        proxy: {
            type: 'stackmob',
            url: 'friend'
        }
    }
});