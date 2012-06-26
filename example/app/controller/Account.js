Ext.define("StackMobSenchaTouchDemo.controller.Account", {
    extend: "Ext.app.Controller",

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        refs: {
            accountMainView: '#accountMainView',
            loginButton: 'button[action=login]',
            loginPanel: '#loginForm',
            profilePanel: '#profilePanel'
        },
        control: {
            accountMainView: {
                show: 'onAccountMainViewShow'
            },
            loginButton: {
                tap: 'onLoginButtonTap'
            }
        }
    },

    onAccountMainViewShow: function(view, opts) {
        var me = this,
            accountMainView = me.getAccountMainView();
        if (me.conn.isAuthenticated()) {
            accountMainView.setActiveItem(me.getProfilePanel());
        } else {
            accountMainView.setActiveItem(me.getLoginPanel());
        }
    },

    onLoginButtonTap: function() {
        var me = this,
            form = me.getLoginButton().up('formpanel');

        form.submit({
            success: function(form, result) {
                me.showProfile();
            }
        });
    },

    showProfile: function() {
        var me = this,
            profilePanel = me.getProfilePanel();
        profilePanel.setRecord(me.conn.getAuthenticatedUserData());
        me.getAccountMainView().setActiveItem(profilePanel);
    }
});