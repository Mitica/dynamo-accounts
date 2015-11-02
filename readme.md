# dynamo-accounts

**dynamo-accounts** is a Nodejs Accounts Management module based on DynamoDB.

Currently it supports just provider login: google, facebook, yahoo. And not it doesn't support providers that not offer user's email.

## Usage

```
var dynamoAccounts = require('dynamo-accounts');

var appId = 'UNIQUE-ID-FOR-YOUR-APP';

var api = dynamoAccounts.api(appId);

api.accounts.providerLogin(profile, accessData).then(function(account){});

api.accounts.getOne('id').then(function(account){});

api.accounts.getByUsername('username').then(function(account){});
```
