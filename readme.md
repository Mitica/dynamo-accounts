# dynamo-accounts

**dynamo-accounts** is a Nodejs Accounts Management module based on DynamoDB.

Currently it supports just provider login: google, facebook, yahoo. And not it doesn't support providers that not offer user's email.

## Usage

```
var dynamoAccounts = require('dynamo-accounts');

var appId = 'UNIQUE-ID-FOR-YOUR-APP';

var accounts = dynamoAccounts.api(appId);

accounts.providerLogin(profile, accessData).then(function(account){});

accounts.access.getAccount('id').then(function(account){});

accounts.access.getAccountByUsername('username').then(function(account){});
```
