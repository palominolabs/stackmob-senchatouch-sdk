Ext.define("StackMobSenchaTouchDemo.controller.Desserts", {
    extend: "Ext.app.Controller",

    requires: ['StackMobSenchaTouchDemo.view.Details'],

    config: {
        refs: {
            dessertList: '#dessertList',
            mainView: '#mainView',
            addButton: 'button[action=addDessert]',
            editButton: 'button[action=editDessert]',
            deleteButton: 'button[action=deleteDessert]',
            detailsView: '#detailsView'
        },
        control: {
            dessertList: {
                initialize: 'onDessertListInitialize',
                itemtap: 'onDessertSelect'
            },
            mainView: {
                push: 'onMainViewPush',
                pop: 'onMainViewPop'
            },
            addButton: {
                tap: 'onAddButtonTap'
            },
            editButton: {
                tap: 'onEditButtonTap'
            },
            deleteButton: {
                tap: 'onDeleteButtonTap'
            }
        }
    },

    onDessertListInitialize: function(list, options) {
        list.getStore().load();
    },

    onDessertSelect: function(list, index, node, record) {
        var showDessert = Ext.create("StackMobSenchaTouchDemo.view.Details");

        this.selectedDessert = record;

        showDessert.setRecord(record);

        this.getMainView().push(showDessert);
    },

    onMainViewPush: function(view, item) {
        if (item == this.getDetailsView()) {
            this.getAddButton().hide();
            this.getEditButton().show();
        }
        Ext.defer(this.getDessertList().deselectAll, 200, this.getDessertList());
    },

    onMainViewPop: function(view, item) {
        if (item == this.getDetailsView()) {
            this.getAddButton().show();
            this.getEditButton().hide();
            this.selectedDessert = null;
        }
    },

    onAddButtonTap: function(btn, event, opts) {
        Ext.Msg.prompt('Add Dessert', 'What\'s for dessert?', this.onSubmitNewDessert, this, false, null, {
            autoCapitalize: true,
            placeHolder: 'Dessert'
        });
    },

    onEditButtonTap: function(btn, event, opts) {
        Ext.Msg.prompt('Edit Dessert', 'Wait, what kind of dessert?', this.onSubmitEditDessert, this, false, this.selectedDessert.get('name'), {
            autoCapitalize: true
        });
    },

    onDeleteButtonTap: function(btn, event, opts) {
        Ext.Msg.confirm('Delete Dessert', 'Are you sure?', function(btnId, value, opt) {
            if (btnId == 'yes') {
                var store = this.getDessertList().getStore();
                store.remove(this.selectedDessert);
                store.sync();
                debugger;
            }
        }, this);
    },

    onSubmitNewDessert: function(btnId, value) {
        if (btnId == 'cancel') {
            return false;
        }
        var newDessert = Ext.create('StackMobSenchaTouchDemo.model.Dessert', {
            name: value
        });
        var store = this.getDessertList().getStore();
        store.add(newDessert);
        store.sync();
    },

    onSubmitEditDessert: function(btnId, value) {
        if (btnId == 'cancel') {
            return false;
        }
        this.selectedDessert.set('name', value);
        this.getDessertList().getStore().sync();
        this.getDetailsView().updateRecord(this.selectedDessert);
    }
});