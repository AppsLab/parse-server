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
  }

  // Return a promise for the schema with the given name, in Parse format. If
  // this adapter doesn't know about the schema, return a promise that rejects with
  // undefined as the reason.
  findSchema(name: string) {
  }

  // Atomically find and delete an object based on query.
  // The result is the promise with an object that was in the database before deleting.
  // Postgres Note: Translates directly to `DELETE * FROM ... RETURNING *`, which will return data after delete is done.
  findAndDeleteSchema(name: string) {
    // arguments: query, sort
  }

  // Add a collection. Currently the input is in mongo format, but that will change to Parse format in a
  // later PR. Returns a promise that is expected to resolve with the newly created schema, in Parse format.
  // If the class already exists, returns a promise that rejects with undefined as the reason. If the collection
  // can't be added for a reason other than it already existing, requirements for rejection reason are TBD.
  addSchema(name: string, fields) {
  }

  updateSchema(name: string, update) {
  }

  upsertSchema(name: string, query: string, update) {
  }

  
}

export default NoSQLSchemaCollection;
module.exports = NoSQLSchemaCollection;
