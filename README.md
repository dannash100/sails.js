# sails.js

learning sails.js

**enable automatic routes**: `config/blueprints` `actions: true`

## routing

- when a request hits the Sails back-end, the request is compared with the apps configured routes. The first matching route is triggered which calls a corresponding controller action responsible for carrying out the requirements of the request.

```javascript
'/': { view: 'pages/homepage' }
```

### shadow routes

- exposed automatically behind the scenes
- asset routes map directly to any files in the configured web root folder `.tmp/public/`
- blueprint routes
- cross-site request forgery token route

## model

object representing a resource such as a mysql table containing:

- attributes: describe properties that the database will be tasked with managing. i.e columns in a table.
- methods: built-in functions to find and manipulate records
- settings: contain configurable properties like connection/datastore to specify database and settings for migrations & schema.
- adapter: node.js module that allows model to communicate with a particular database

## actions

- actions are defined in `api/controllers/` and subfolders
- when refering to an action use the path relative to the controllers root.

### actions

- generate stand alone action: `generate action subfolder/action_name`

- from sails documentation:

```js
module.exports = {
  friendlyName: "Welcome user",

  description:
    "Look up the specified user and welcome them, or redirect to a signup page if no user was found.",

  inputs: {
    userId: {
      description: "The ID of the user to look up.",
      // By declaring a numeric example, Sails will automatically respond with `res.badRequest`
      // if the `userId` parameter is not a number.
      type: "number",
      // By making the `userId` parameter required, Sails will automatically respond with
      // `res.badRequest` if it's left out.
      required: true
    }
  },

  exits: {
    success: {
      responseType: "view",
      viewTemplatePath: "pages/welcome"
    },
    notFound: {
      description: "No user with the specified ID was found in the database.",
      responseType: "notFound"
    }
  },

  fn: async function(inputs, exits) {
    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    var user = await User.findOne({ id: inputs.userId });

    // If no user was found, respond "notFound" (like calling `res.notFound()`)
    if (!user) {
      return exits.notFound();
    }

    // Display the welcome view.
    return exits.success({ name: user.name });
  }
};
```

## controllers

- organize actions into controller file.
- or use stand alone actions in nested subfolders.

## models

- represents a set of structured data called records.

```js
module.exports = {
  attributes: {
    nameOnMenu: { type: 'string', required: true },
    price: { type: 'string', required: true },
    percentRealMeat: { type: 'number', defaultsTo: 20, columnType: 'FLOAT' },
    numCalories: { type: 'number' },
  },
};
```

### query syntax

- `find` simple & with `WHERE` clause and `IN` clause
```js
Model.find({
  name: 'Dan' // ['Dan', 'Dog'] behaves like IN
});

Model.find({
  where: { name: 'Dan' },
  limit: 10,
  sort: 'createdAt DESC'
})
```

- column keys can have there value represent another key/value pair to represent `WHERENOT` and a range of other other criteria modifyiers [see here](https://sailsjs.com/documentation/concepts/models-and-orm/query-language)

### associations

- in addition to literal types like strings and numbers, attributes can represent links to other records in a datastore, this works like a table join
- depending on type of link, associative attributes can be set in a create or update call and specilized model methods.
- associations are not always returned when retreiving records with `.find()` instead you declare which  associations to retreive by using the `populate()` method
- if a model has one association use `model` if it is many use `collection` and `via`
- [see official docs for more information](https://sailsjs.com/documentation/concepts/models-and-orm/associations)

- add a reference to another model in a **many to many** relationship
```js
// models/User.js
 pets: {
      collection: 'pet',
      via: 'owners'
    }
// models/Pets.js
  owners: {
      collection: 'user',
      via: 'pets'
    }

// associate user_id 10 with pet_id 300 and 301
await User.addToCollection(10, 'pets', [300, 301])

const userWithPets = User.findOne('10').populate('pets')
```

### error handling

- when calling model methods use the `try, catch` method.
- return modified errors with `.intercept((err), fn)`

### lifecycle callbacks

-  process data in some way before saving to a database define `beforeCreate` in model

### connecting to mysql db

- `yarn add sails-mysql`

- `config/datastores.js`

```js
module.exports.datastores = {
  default: {
    adapter: require("sails-mysql"),
    url: "mysql://root:squ1ddy@localhost:3306/my_dev_db_name"
  }
};
```

- `sails generate model model_name`

## routing

- automatic: in `config/blueprints.js` set actions to true.
- manual: bind routes manually in config/routes `POST /route/to/hit': 'action/to/hit`
  [see official docs](https://sailsjs.com/documentation/concepts/actions-and-controllers/routing-to-actions)

## config

- local.js takes precedence over all other config settings, use this to store settings like database or email passwords that apply only to you not the organization

## file uploads

- when using the default receiver uploads go to `App/.tmp/uploads/
- upload to a custom folder providing a dirname setting to upload with a path resolve to `sails.config.appPath, 'where/to/save'`
- files are uploaded to HTTP web servers as file parameters.
- [official docs for details](https://sailsjs.com/documentation/concepts/file-uploads)

```js
req.file("filename").upload({
    // don't allow the total upload size to exceed ~10MB
    maxBytes: 10000000
  },
  function whenDone(err, uploadedFiles) {
    if (err) {
      return res.serverError(err);
    }
  }
);
```

## helpers

- use helpers to avoid code repeat
```js
const greeting = await sails.helpers.helperName.with({name: 'Dan' });
```
- helpers use ```exits.success``` in place of ```return```
- `api/helpers/helper-name.js`
- async by default turn of with `sync: true`
- [see official docs for details on advanced exception handling](https://sailsjs.com/documentation/concepts/helpers)

```js
module.exports = {

  friendlyName: 'Format welcome message',


  description: 'Return a personalized greeting based on the provided name.',


  inputs: {

    name: {
      type: 'string',
      example: 'Ami',
      description: 'The name of the person to greet.',
      required: true
    }

  },


  fn: async function (inputs, exits) {
    var result = `Hello, ${inputs.name}!`;
    return exits.success(result);
  }

};

```

## middleware

- code that runs before or after your route-handling code
- sails is compatible with express middleware.
- defined in `config/http.js`
