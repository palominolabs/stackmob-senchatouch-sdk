Ext.define("StackMobSenchaTouchDemo.view.account.CreateUser", {
    extend: 'Ux.palominolabs.stackmob.form.StackMobForm',

    requires: [
        'Ext.field.Password',
        'Ext.form.FieldSet'
    ],

    id: 'createUserForm',

    config: {
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            title: 'Create User'
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
            action: 'createUser',
            text: 'Create User'
        }]
    }
});