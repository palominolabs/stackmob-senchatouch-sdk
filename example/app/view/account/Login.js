Ext.define("StackMobSenchaTouchDemo.view.account.Login", {
    extend: 'Ux.palominolabs.stackmob.form.StackMobLoginForm',

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
        }]
    }


});