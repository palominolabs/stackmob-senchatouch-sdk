Ext.define("StackMobSenchaTouchDemo.view.Tabs", {
    extend: "Ext.tab.Panel",

    requires: [
        'StackMobSenchaTouchDemo.view.dessert.Main',
        'StackMobSenchaTouchDemo.view.account.Main'
    ],

    config: {
        activeTab: 0,
        tabBar: {
            docked: 'bottom'
        },
        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.dessert.Main'
        },{
            xclass: 'StackMobSenchaTouchDemo.view.account.Main'
        }]
    }
});