Ext.define("StackMobSenchaTouchDemo.controller.Friends", {
    extend: "Ext.app.Controller",

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    requires: [
        'Ext.picker.Picker',
        'StackMobSenchaTouchDemo.view.friend.Details'
    ],

    config: {
        refs: {
            friendList: '#friendList',
            mainView: '#friendMainView',
            addButton: 'button[action=addFriend]',
            editButton: 'button[action=editFriend]',
            deleteButton: 'button[action=deleteFriend]',
            sortButton: 'button[action=sortFriendsButton]',
            sortPicker: 'picker[action=sortFriends]',
            detailsView: '#detailsView',
            cardView: '#friendCardView',
            unauthorizedView: '#friendUnauthorizedView',
            tabPanel: 'tabpanel'
        },
        control: {
            friendList: {
                itemtap: 'onFriendSelect'
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
            },
            sortButton: {
                tap: 'onSortButtonTap'
            },
            sortPicker: {
                change: 'onSortPickerChange'
            },
            tabPanel: {
                activeitemchange: 'onTabPanelActiveItemChange'
            }
        }
    },

    onTabPanelActiveItemChange: function(tabpanel, newItem, oldItem, opts) {
        var me = this,
            cardView = me.getCardView();
        if (newItem == cardView) {
            if (!me.conn.isAuthenticated()) {
                cardView.setActiveItem(me.getUnauthorizedView());
            } else {
                cardView.setActiveItem(me.getMainView());
            }
        }
    },

    onFriendSelect: function(list, index, node, record) {
        var showFriend = Ext.create("StackMobSenchaTouchDemo.view.friend.Details");

        this.selectedFriend = record;

        showFriend.setRecord(record);

        this.getMainView().push(showFriend);
    },

    onMainViewPush: function(view, item) {
        if (item == this.getDetailsView()) {
            this.getAddButton().hide();
            this.getEditButton().show();
        }
        Ext.defer(this.getFriendList().deselectAll, 200, this.getFriendList());
    },

    onMainViewPop: function(view, item) {
        if (item == this.getDetailsView()) {
            this.getAddButton().show();
            this.getEditButton().hide();
            this.selectedFriend = null;
        }
    },

    onAddButtonTap: function(btn, event, opts) {
        Ext.Msg.prompt('Add Friend', 'Who is your friend?', this.onSubmitNewFriend, this, false, null, {
            autoCapitalize: true,
            placeHolder: 'Friend'
        });
    },

    onEditButtonTap: function(btn, event, opts) {
        Ext.Msg.prompt('Edit Friend', 'Wait, what did you say the name was?', this.onSubmitEditFriend, this, false, this.selectedFriend.get('name'), {
            autoCapitalize: true
        });
    },

    onDeleteButtonTap: function(btn, event, opts) {
        Ext.Msg.confirm('Delete Friend', 'Are you sure?', function(btnId, value, opt) {
            if (btnId == 'yes') {
                var store = this.getFriendList().getStore();
                store.remove(this.selectedFriend);
                store.sync();
                this.getMainView().pop();
            }
        }, this);
    },

    onSortButtonTap: function(btn, event, opts) {
        if (!this.sortPicker) {
            this.sortPicker = Ext.Viewport.add({
                xtype: 'picker',
                action: 'sortFriends',
                slots: [{
                    name : 'sortDir',
                    title: 'Direction',
                    data : [
                        {text: 'Ascending', value: 'asc'},
                        {text: 'Descending', value: 'desc'}
                    ]
                }],
                value: 'asc'
            });
        }

        this.sortPicker.show();
    },

    onSortPickerChange: function(picker, value, opts) {
        var store = this.getFriendList().getStore();
        store.setSorters({
            property: 'name',
            direction: value.sortDir
        });
        store.load();
    },

    onSubmitNewFriend: function(btnId, value) {
        if (btnId == 'cancel') {
            return false;
        }
        var newFriend = Ext.create('StackMobSenchaTouchDemo.model.Friend', {
            name: value
        });
        var store = this.getFriendList().getStore();
        store.add(newFriend);
        store.sync();
    },

    onSubmitEditFriend: function(btnId, value) {
        if (btnId == 'cancel') {
            return false;
        }
        this.selectedFriend.set('name', value);
        this.getFriendList().getStore().sync();
        this.getDetailsView().updateRecord(this.selectedFriend);
    }
});