Ext.define("StackMobSenchaTouchDemo.controller.Account", {
    extend: "Ext.app.Controller",

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        refs: {
            accountMainView: '#accountMainView',
            loginButton: 'button[action=login]',
            loginPanel: '#loginForm',
            logoutButton: 'button[action=logout]',
            resetPasswordPanel: '#resetPasswordForm',
            resetPasswordButton: 'button[action=resetPassword]',
            showResetPasswordButton: 'button[action=showResetPassword]',
            profilePanel: '#profilePanel',
            goToLoginButton: 'button[action=goToLogin]',
            tabPanel: 'tabpanel'
        },
        control: {
            accountMainView: {
                show: 'onAccountMainViewShow'
            },
            loginButton: {
                tap: 'onLoginButtonTap'
            },
            logoutButton: {
                tap: 'onLogoutButtonTap'
            },
            resetPasswordButton: {
                tap: 'onResetPasswordButtonTap'
            },
            showResetPasswordButton: {
                tap: 'onShowResetPasswordButtonTap'
            },
            goToLoginButton: {
                tap: 'onGoToLoginButtonTap'
            }
        }
    },

    onAccountMainViewShow: function(view, opts) {
        var me = this;
        if (me.conn.isAuthenticated()) {
            me.showProfile();
        } else {
            me.showLoginForm();
        }
    },

    onLoginButtonTap: function() {
        var me = this,
            form = me.getLoginButton().up('formpanel');

        Ext.Viewport.mask({
            xtype: 'loadmask'
        });
        form.submit({
            url: me.conn.getLoginUrl(),
            success: function(form, result) {
                me.showProfile();
                Ext.Viewport.unmask();
            },
            failure: function() {
                Ext.Viewport.unmask();
                Ext.Msg.alert("Login Failed", "Invalid username or password.");
            }
        });
    },

    onLogoutButtonTap: function() {
        var me = this;
        Ext.Msg.confirm("Logout", "Are you sure?", function(btnId, value, opt) {
            if (btnId == 'yes') {
                me.conn.logout();
                me.showLoginForm();
            }
        });
    },

    onResetPasswordButtonTap: function() {
    var me = this,
        form = me.getResetPasswordButton().up('formpanel'),
        options = form.getValues();

        Ext.Viewport.mask({
            xtype: 'loadmask'
        });

        options.success = function(form, result) {
            me.showProfile();
            Ext.Viewport.unmask();
        };
        options.failure = function() {
            Ext.Viewport.unmask();
            Ext.Msg.alert("Reset Password Failed", "Invalid old or new password.");
        };

        me.conn.resetPassword(options);
    },

    onShowResetPasswordButtonTap: function() {
        var me = this;
        me.getAccountMainView().setActiveItem(me.getResetPasswordPanel());
    },

    onGoToLoginButtonTap: function() {
        var me = this,
            tabPanel = me.getTabPanel(),
            accountMainView = me.getAccountMainView();
        if (tabPanel.getActiveItem() != accountMainView) {
            tabPanel.setActiveItem(accountMainView);
        }
    },

    showLoginForm: function() {
        var me = this;
        me.getAccountMainView().setActiveItem(me.getLoginPanel());
    },

    showProfile: function() {
        var me = this,
            profilePanel = me.getProfilePanel();
        profilePanel.setRecord(me.conn.getAuthenticatedUserData());
        me.getAccountMainView().setActiveItem(profilePanel);
    }
});