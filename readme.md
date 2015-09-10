# dynamo-accounts

**dynamo-accounts** is a Nodejs Accounts Management module based on DynamoDB.

## Usage

```
var dynamoAccounts = require('dynamo-accounts');

var appId = 'UNIQUE-ID-FOR-YOUR-APP';

var api = dynamoAccounts.api(appId);

api.accounts.providerLogin(profile, accessData).then(function(account){});

api.accounts.get('id').then(function(account){});

api.accounts.getByUsername('username').then(function(account){});
```
