Ext.define("StackMobSenchaTouchDemo.view.account.Login", {
    extend: 'Ux.palominolabs.stackmob.form.StackMobForm',

    requires: [
        'Ext.field.Password',
        'Ext.form.FieldSet'
    ],

    id: 'loginForm',

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
                label: 'Password'
            }]
        },{
            xtype: 'button',
            name: 'submit',
            action: 'login',
            text: 'Login'
        },{
            xtype: 'button',
            name: 'showCreateUser',
            action: 'showCreateUser',
            text: 'Don\'t have an account? Create one',
            margin: '10 0 0 0'
        }]
    }
});