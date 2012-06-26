Ext.define("StackMobSenchaTouchDemo.view.account.Main", {
    extend: 'Ext.Panel',

    requires: [
        'StackMobSenchaTouchDemo.view.account.Login',
        'StackMobSenchaTouchDemo.view.account.Profile'
    ],

    id: 'accountMainView',

    config: {
        title: 'Account',
        iconCls: 'user',
        layout: 'card',
        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.account.Login'
        },{
            xclass: 'StackMobSenchaTouchDemo.view.account.Profile'
        }]
    }
});