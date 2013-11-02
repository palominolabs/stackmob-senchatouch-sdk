Ext.define("StackMobSenchaTouchDemo.view.account.TemporaryPasswordLogin", {
    extend: 'Ux.palominolabs.stackmob.form.StackMobForm',

    requires: [
        'Ext.field.Password',
        'Ext.form.FieldSet'
    ],

    id: 'temporaryPasswordLoginForm',

    config: {
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Login'
        },{
            xtype: 'fieldset',
            items: [{
                xtype: 'textfield',
                name: 'username',
                label: 'Username'
            },{
                xtype: 'passwordfield',
                name: 'password',
                label: 'Temporary Password'
            },{
                xtype: 'passwordfield',
                name: 'new_password',
                label: 'New Password'
            }]
        },{
            xtype: 'button',
            name: 'submit',
            action: 'temporaryPasswordLogin',
            text: 'Login'
        }]
    }
});