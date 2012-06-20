Ext.define("StackMobSenchaTouchDemo.view.Main", {
    extend: 'Ext.navigation.View',

    requires: ['StackMobSenchaTouchDemo.view.List'],

    id: 'mainView',

    config: {

        items: [{
            xclass: 'StackMobSenchaTouchDemo.view.List'
        }]
    }
});