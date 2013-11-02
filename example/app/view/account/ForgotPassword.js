Ext.define("StackMobSenchaTouchDemo.view.account.ForgotPassword", {
    extend: 'Ext.form.Panel',

    requires: [
        'Ext.form.FieldSet'
    ],

    id: 'forgotPasswordForm',

    config: {
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Forgot Password'
        },{
            xtype: 'fieldset',
            items: [{
                xtype: 'textfield',
                name: 'username',
                label: 'Username'
            }]
        },{
            xtype: 'button',
            name: 'submit',
            action: 'forgotPassword',
            text: 'Submit'
        }]
    }
});