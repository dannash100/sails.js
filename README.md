# sails.js
learning sails.js

## routing

- when a request hits the Sails back-end, the request is compared with the apps configured routes. The first matching route is triggered which calls a corresponding controller action responsible for carrying out the requirements of the request.

## model

- object representing a resource such as a mysql table, containing:
  - attributes: describe properties that the database will be tasked with managing. i.e columns in a table.
  - methods: built-in functions to find and manipulate records
  - settings: contain configurable properties like connection/datastore to specify database and settings for migrations & schema.
  - adapter: node.js module that allows model to communicate with a particular database

### methods


