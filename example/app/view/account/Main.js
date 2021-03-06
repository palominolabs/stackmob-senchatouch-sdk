Ext.define("StackMobSenchaTouchDemo.view.account.Main", {
    extend: 'Ext.Panel',

    requires: [
        'StackMobSenchaTouchDemo.view.account.CreateUser',
        'StackMobSenchaTouchDemo.view.account.Login',
        'StackMobSenchaTouchDemo.view.account.Profile',
        'StackMobSenchaTouchDemo.view.account.ResetPassword'
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
        },{
            xclass: 'StackMobSenchaTouchDemo.view.account.ResetPassword'
        },{
            xclass: 'StackMobSenchaTouchDemo.view.account.CreateUser'
        }]
    }
});