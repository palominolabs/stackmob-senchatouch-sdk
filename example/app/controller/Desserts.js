Ext.define("StackMobSenchaTouchDemo.controller.Desserts", {
    extend: "Ext.app.Controller",

    config: {
        refs: {
            dessertList: '#dessertList'
        },
        control: {
            dessertList: {
                show: 'onDessertListShow'
            }
        }
    },

    onDessertListShow: function(list, options) {
        list.getStore().load();
    }
});