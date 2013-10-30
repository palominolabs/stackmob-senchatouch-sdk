Ext.define("StackMobSenchaTouchDemo.view.account.ResetPassword", {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.field.Password',
        'Ext.form.FieldSet'
    ],

    id: 'resetPasswordForm',

    config: {
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Login'
        },{
            xtype: 'fieldset',
            items: [{
                xtype: 'passwordfield',
                name: 'oldPassword',
                label: 'Old Password'
            },{
                xtype: 'passwordfield',
                name: 'newPassword',
                label: 'New Password'
            }]
        },{
            xtype: 'button',
            name: 'submit',
            action: 'resetPassword',
            text: 'Reset Password'
        }]
    }
});