Ext.define("StackMobSenchaTouchDemo.controller.Account", {
    extend: "Ext.app.Controller",

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        refs: {
            accountMainView: '#accountMainView',
            createUserButton: 'button[action=createUser]',
            createUserPanel: '#createUserForm',
            showCreateUserButton: 'button[action=showCreateUser]',
            loginButton: 'button[action=login]',
            loginPanel: '#loginForm',
            logoutButton: 'button[action=logout]',
            resetPasswordPanel: '#resetPasswordForm',
            resetPasswordButton: 'button[action=resetPassword]',
            showResetPasswordButton: 'button[action=showResetPassword]',
            profilePanel: '#profilePanel',
            profileImageField: '#profileImageField',
            savePictureButton: 'button[action=savePicture]',
            profileDetails: '#profileDetails',
            goToLoginButton: 'button[action=goToLogin]',
            tabPanel: 'tabpanel'
        },
        control: {
            accountMainView: {
                show: 'onAccountMainViewShow'
            },
            createUserButton: {
                tap: 'onCreateUserButtonTap'
            },
            showCreateUserButton: {
                tap: 'onShowCreateUserButtonTap'
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
            },
            changePictureButton: {
                tap: 'onChangePictureButtonTap'
            },
            profilePanel: {
                initialize: 'onProfilePanelInitialize'
            },
            savePictureButton: {
                tap: 'saveProfilePicture'
            }
        }
    },

    onAccountMainViewShow: function(view, opts) {
        var me = this;
        if (me.getApplication().getLoggedInUser()) {
            me.showProfile();
        } else {
            me.showLoginForm();
        }
    },

    onCreateUserButtonTap: function() {
        var me = this,
            form = me.getCreateUserButton().up('formpanel'),
            formValues = form.getValues();

        Ext.Viewport.mask({
            xtype: 'loadmask'
        });

        me.conn.createUser({
            success: function(form, result) {
                Ext.Viewport.unmask();
                me.showLoginForm();
                Ext.Msg.alert("User Successfully Created", "Great Job!");
            },
            failure: function() {
                Ext.Viewport.unmask();
                Ext.Msg.alert("Create User Failed", "Invalid username or password.");
            },
            userData: formValues
        });
    },

    onShowCreateUserButtonTap: function() {
        this.showCreateUserForm();
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
                me.getApplication().setLoggedInUser(Ext.create('StackMobSenchaTouchDemo.model.User', me.conn.getAuthenticatedUserData()));
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
                me.getApplication().setLoggedInUser(null);
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
            Ext.Msg.alert("Password Successfully Reset", "Great Job!");
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
            profileDetails = me.getProfileDetails(),
            profilePanel = me.getProfilePanel();
        profileDetails.setRecord(me.getApplication().getLoggedInUser());
        me.getAccountMainView().setActiveItem(profilePanel);
    },

    onProfilePanelInitialize: function () {
        var me = this,
            fileInput = me.getProfileImageField().element.down('input[type=file]').dom;

        // When the file field value changes, read the file and update the model
        fileInput.onchange = function () {
            if (fileInput.files.length > 0) {
                var file = fileInput.files[0];
                // Reading the file is an asynchonous action
                Ux.palominolabs.stackmob.util.File.readFile(file, function (dataUrl, fileReader, originalFile) {
                    // When the file read completes successfully, convert the data URL into a format which can be
                    // ... used to write to StackMob later
                    var dataUrlWithFilename = Ux.palominolabs.stackmob.util.File.embedFilenameInDataUrl(originalFile.name, dataUrl);
                    me.changeProfilePicture(dataUrlWithFilename);
                })
            }
        }
    },

    changeProfilePicture: function (dataUrlWithFilename) {
        var me = this,
            user = me.getApplication().getLoggedInUser(),
            savePictureButton = me.getSavePictureButton();

        user.set('picture', dataUrlWithFilename);
        savePictureButton.show();
    },

    saveProfilePicture: function () {
        var me = this,
            profilePanel = me.getProfilePanel(),
            savePictureButton = me.getSavePictureButton(),
            user = me.getApplication().getLoggedInUser();

        profilePanel.mask({
            xtype: 'loadmask',
            message: 'Saving...'
        });

        user.save({
            callback: function (model) {
                me.showProfile();
                profilePanel.unmask();
            },
            success: function (model) {
                savePictureButton.hide();
            },
            failure: function (model) {
                Ext.Msg.alert('Failed to Save Picture', 'Unable to save picture.  Please try again later.');
            }
        });
    },

    showCreateUserForm: function() {
        var me = this;
        me.getAccountMainView().setActiveItem(me.getCreateUserPanel());
    }
});