import NoSQLCollection from './NoSQLCollection';

class NoSQLSchemaCollection {
  
  collection: NoSQLCollection;
  
  constructor(collection: NoSQLCollection) {
    this.collection = collection;
  }

  // Return a promise for all schemas known to this adapter, in Parse format. In case the
  // schemas cannot be retrieved, returns a promise that rejects. Requirements fot the
  // rejection reason are TBD.
  getAllSchemas() {
    console.log('getAllSchemas()');
    return [ { className: '_User',
    fields: 
     { username: { type: 'String' },
       password: { type: 'String' },
       email: { type: 'String' },
       firstName: { type: 'String' },
       lastName: { type: 'String' },
       patContexts: { type: 'Object' },
       phone: { type: 'String' },
       ACL: { type: 'ACL' },
       createdAt: { type: 'Date' },
       updatedAt: { type: 'Date' },
       objectId: { type: 'String' } },
    classLevelPermissions: 
     { find: { '*': true },
       get: { '*': true },
       create: { '*': true },
       update: { '*': true },
       delete: { '*': true },
       addField: { '*': true } } },
  { className: '_Session',
    fields: 
     { sessionToken: { type: 'String' },
       user: { type: 'Pointer', targetClass: '_User' },
       createdWith: { type: 'Object' },
       restricted: { type: 'Boolean' },
       expiresAt: { type: 'Date' },
       installationId: { type: 'String' },
       ACL: { type: 'ACL' },
       createdAt: { type: 'Date' },
       updatedAt: { type: 'Date' },
       objectId: { type: 'String' } },
    classLevelPermissions: 
     { find: { '*': true },
       get: { '*': true },
       create: { '*': true },
       update: { '*': true },
       delete: { '*': true },
       addField: { '*': true } } },
  { className: 'UserSession',
    fields: 
     { patContexts: { type: 'Object' },
       source: { type: 'String' },
       user: { type: 'Pointer', targetClass: '_User' },
       ACL: { type: 'ACL' },
       createdAt: { type: 'Date' },
       updatedAt: { type: 'Date' },
       objectId: { type: 'String' } },
    classLevelPermissions: 
     { find: { '*': true },
       get: { '*': true },
       create: { '*': true },
       update: { '*': true },
       delete: { '*': true },
       addField: { '*': true } } },
  { className: 'Utterance',
    fields: 
     { response: { type: 'Object' },
       patContexts: { type: 'Object' },
       text: { type: 'String' },
       output: { type: 'String' },
       source: { type: 'String' },
       user: { type: 'Pointer', targetClass: '_User' },
       userFirstName: { type: 'String' },
       userLastName: { type: 'String' },
       actionIncomplete: { type: 'Boolean' },
       error: { type: 'Object' },
       ACL: { type: 'ACL' },
       createdAt: { type: 'Date' },
       updatedAt: { type: 'Date' },
       objectId: { type: 'String' } },
    classLevelPermissions: 
     { find: { '*': true },
       get: { '*': true },
       create: { '*': true },
       update: { '*': true },
       delete: { '*': true },
       addField: { '*': true } } },
  { className: 'Something',
    fields: 
     { test: { type: 'String' },
       response: { type: 'Object' },
       ACL: { type: 'ACL' },
       createdAt: { type: 'Date' },
       updatedAt: { type: 'Date' },
       objectId: { type: 'String' } },
    classLevelPermissions: 
     { find: { '*': true },
       get: { '*': true },
       create: { '*': true },
       update: { '*': true },
       delete: { '*': true },
       addField: { '*': true } } } ];
  }

  // Return a promise for the schema with the given name, in Parse format. If
  // this adapter doesn't know about the schema, return a promise that rejects with
  // undefined as the reason.
  findSchema(name: string) {
    console.log('findSchema()', name);    
  }

  // Atomically find and delete an object based on query.
  // The result is the promise with an object that was in the database before deleting.
  // Postgres Note: Translates directly to `DELETE * FROM ... RETURNING *`, which will return data after delete is done.
  findAndDeleteSchema(name: string) {
    // arguments: query, sort
    console.log('findAndDeleteSchema()', name);        
  }

  // Add a collection. Currently the input is in mongo format, but that will change to Parse format in a
  // later PR. Returns a promise that is expected to resolve with the newly created schema, in Parse format.
  // If the class already exists, returns a promise that rejects with undefined as the reason. If the collection
  // can't be added for a reason other than it already existing, requirements for rejection reason are TBD.
  addSchema(name: string, fields) {
    console.log('addSchema()');        
  }

  updateSchema(name: string, update) {
    console.log('updateSchema()', name, update);        
  }

  upsertSchema(name: string, query: string, update) {
    console.log('upsertSchema()', name, query, update);        
  }

  
}

export default NoSQLSchemaCollection;
module.exports = NoSQLSchemaCollection;
