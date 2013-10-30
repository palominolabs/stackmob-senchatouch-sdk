Ext.define("StackMobSenchaTouchDemo.controller.Account", {
    extend: "Ext.app.Controller",

    conn: Ux.palominolabs.stackmob.data.StackMobConnector,

    config: {
        refs: {
            accountMainView: '#accountMainView',
            loginButton: 'button[action=login]',
            loginPanel: '#loginForm',
            logoutButton: 'button[action=logout]',
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
            loginButton: {
                tap: 'onLoginButtonTap'
            },
            logoutButton: {
                tap: 'onLogoutButtonTap'
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

    onLoginButtonTap: function() {
        var me = this,
            form = me.getLoginButton().up('formpanel');

        Ext.Viewport.mask({
            xtype: 'loadmask'
        });
        form.submit({
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
    }
});