
import MongoCollection from './MongoCollection';
import MongoSchemaCollection from './MongoSchemaCollection';
import {parse as parseUrl, format as formatUrl} from '../../../vendor/mongodbUrl';

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;

const MongoSchemaCollectionName = '_SCHEMA';

export class MongoStorageAdapter {
  // Private
  _uri: string;
  _options: Object;
  // Public
  connectionPromise;
  database;

  constructor(uri: string, options: Object) {
    this._uri = uri;
    this._options = options;
  }

  connect() {
    console.log('Mconnect IN');
    if (this.connectionPromise) {
      console.log('Mconnect OUT EXISTING');      
      return this.connectionPromise;
    }

    // parsing and re-formatting causes the auth value (if there) to get URI
    // encoded
    const encodedUri = formatUrl(parseUrl(this._uri));

    this.connectionPromise = MongoClient.connect(encodedUri, this._options).then(database => {
      this.database = database;
      console.log('Mconnect OUT NEW');          
    });
    return this.connectionPromise;
  }

  collection(name: string) {
    console.log('Mcollection IN', name);
    return this.connect().then(() => {
      console.log('Mcolection OUT', name);
      return this.database.collection(name);
    });
  }

  adaptiveCollection(name: string) {
    console.log('MadaptiveCollection IN', name);
    const collection = this.connect()
      .then(() => this.database.collection(name))
          .then((rawCollection)  => {
//            console.log('rawCollection', rawCollection);
            const mongoCollection = new MongoCollection(rawCollection);
            console.log('mongoCollection', mongoCollection);
            return mongoCollection;
          });
    console.log('MadaptiveCollection OUT', name, collection);
    return collection;
  }

  schemaCollection(collectionPrefix: string) {
    console.log('MschemaCollection IN OUT', collectionPrefix);        
    return this.connect()
      .then(() => this.adaptiveCollection(collectionPrefix + MongoSchemaCollectionName))
      .then(collection => new MongoSchemaCollection(collection));
  }

  collectionExists(name: string) {
    return this.connect().then(() => {
      return this.database.listCollections({ name: name }).toArray();
    }).then(collections => {
      return collections.length > 0;
    });
  }

  dropCollection(name: string) {
    return this.collection(name).then(collection => collection.drop());
  }
  // Used for testing only right now.
  collectionsContaining(match: string) {
    return this.connect().then(() => {
      return this.database.collections();
    }).then(collections => {
      return collections.filter(collection => {
        if (collection.namespace.match(/\.system\./)) {
          return false;
        }
        return (collection.collectionName.indexOf(match) == 0);
      });
    });
  }
}

export default MongoStorageAdapter;
module.exports = MongoStorageAdapter; // Required for tests
