Ext.define("StackMobSenchaTouchDemo.view.Tabs", {
    extend: "Ext.tab.Panel",

    requires: ['StackMobSenchaTouchDemo.view.dessert.Main'],

    config: {
        activeTab: 0,
        tabBar: {
            docked: 'bottom'
        },
        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.dessert.Main'
        }]
    }
});