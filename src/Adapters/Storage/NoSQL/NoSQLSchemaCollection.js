import NoSQLCollection from './NoSQLCollection';
const Parse = require('parse/node');

function mongoFieldToParseSchemaField(type) {
  if (type[0] === '*') {
    return {
      type: 'Pointer',
      targetClass: type.slice(1),
    };
  }
  if (type.startsWith('relation<')) {
    return {
      type: 'Relation',
      targetClass: type.slice('relation<'.length, type.length - 1),
    };
  }
  switch (type) {
    case 'number':   return {type: 'Number'};
    case 'string':   return {type: 'String'};
    case 'boolean':  return {type: 'Boolean'};
    case 'date':     return {type: 'Date'};
    case 'map':
    case 'object':   return {type: 'Object'};
    case 'array':    return {type: 'Array'};
    case 'geopoint': return {type: 'GeoPoint'};
    case 'file':     return {type: 'File'};
  }
}

const nonFieldSchemaKeys = ['_id', '_metadata', '_client_permissions'];
function mongoSchemaFieldsToParseSchemaFields(schema) {
  var fieldNames = Object.keys(schema).filter(key => nonFieldSchemaKeys.indexOf(key) === -1);
  var response = fieldNames.reduce((obj, fieldName) => {
    obj[fieldName] = mongoFieldToParseSchemaField(schema[fieldName])
    return obj;
  }, {});
  response.ACL = {type: 'ACL'};
  response.createdAt = {type: 'Date'};
  response.updatedAt = {type: 'Date'};
  response.objectId = {type: 'String'};
  return response;
}

const defaultCLPS = Object.freeze({
  find: {'*': true},
  get: {'*': true},
  create: {'*': true},
  update: {'*': true},
  delete: {'*': true},
  addField: {'*': true},
});

function mongoSchemaToParseSchema(mongoSchema) {
  let clpsFromMongoObject = {};
  if (mongoSchema._metadata && mongoSchema._metadata.class_permissions) {
    clpsFromMongoObject = mongoSchema._metadata.class_permissions;
  }
  return {
    className: mongoSchema._id,
    fields: mongoSchemaFieldsToParseSchemaFields(mongoSchema),
    classLevelPermissions: {...defaultCLPS, ...clpsFromMongoObject},
  };
}

function _mongoSchemaQueryFromNameQuery(name: string, query) {
  return _mongoSchemaObjectFromNameFields(name, query);
}

function _mongoSchemaObjectFromNameFields(name: string, fields) {
  let object = { _id: name };
  if (fields) {
    Object.keys(fields).forEach(key => {
      object[key] = fields[key];
    });
  }
  return object;
}


class NoSQLSchemaCollection {
  
  collection: NoSQLCollection;
  
  constructor(collection: NoSQLCollection) {
    this.collection = collection;
  }
  

  
  // Return a promise for all schemas known to this adapter, in Parse format. In case the
  // schemas cannot be retrieved, returns a promise that rejects. Requirements fot the
  // rejection reason are TBD.
  getAllSchemas() { 
    const retPromise = new Parse.Promise();
    console.log('getAllSchemas()');
    const schemas =  [ { _id: '_User',
                         username: 'string',
                         password: 'string',
                         email: 'string',
                         firstName: 'string',
                         lastName: 'string',
                         patContexts: 'object',
                         phone: 'string' },
                       { _id: '_Session',
                         sessionToken: 'string',
                         user: '*_User',
                         createdWith: 'object',
                         restricted: 'boolean',
                         expiresAt: 'date',
                         installationId: 'string' },
                       { _id: 'UserSession',
                         patContexts: 'object',
                         source: 'string',
                         user: '*_User' },
                       { _id: 'Utterance',
                         response: 'object',
                         patContexts: 'object',
                         text: 'string',
                         output: 'string',
                         source: 'string',
                         user: '*_User',
                         userFirstName: 'string',
                         userLastName: 'string',
                         actionIncomplete: 'boolean',
                         error: 'object' },
                       { _id: 'Something', test: 'string', response: 'object' } ];
    const parseSchema = schemas.map(mongoSchemaToParseSchema);
    console.log(`mongoSchemaToParseSchema: ${util.inspect(parseSchema, false, null)}`);
    retPromise.resolve(parseSchema);
    return retPromise;

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
