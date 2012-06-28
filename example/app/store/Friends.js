Ext.define('StackMobSenchaTouchDemo.store.Friends', {
    extend: 'Ext.data.Store',

    config: {
        model: 'StackMobSenchaTouchDemo.model.Friend',
        proxy: {
            type: 'stackmob',
            url: 'friend'
        },
        remoteSort: true
    }
});