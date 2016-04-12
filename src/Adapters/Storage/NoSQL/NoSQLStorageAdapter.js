const SchemaCollectionName = '_SCHEMA';
const NoSQLCollection  = require('./NoSQLCollection.js');
const Parse = require('parse/node');

export class NoSQLStorageAdapter {
  uri: string;
  options: Object;
  nosqldb: Object;
  writeOptions: Object;
  durability: Object;
  replicaAckPolicy: Object;
  readOptions: Object;
  consistency: Object;
  configuration: Object;
  store: Object;
  parse: Object;
  collections: Object;
  schemaCollection: Object;
  
  // Public
  connectionPromise;
  database;

  constructor(uri: string, options: Object) {
    this.uri = uri;
    this.options = options;
    this.nosqldb = require('nosqldb-oraclejs');
    // This is by default, if you encounter problems during your tests,
    // Try to change the log level, values are available under
    // nosqldb.LOGLEVELS path:
    //   OFF, FATAL, ERROR, WARN, INFO, DEBUG, TRACE, ALL
    this.nosqldb.Logger.logLevel = nosqldb.LOGLEVELS.OFF;
    this.nosqldb.Logger.logToConsole = false;
    this.nosqldb.Logger.logToFile = false;
    
    // Working with types
    this.writeOptions = nosqldb.Types.WriteOptions;
    this.durability = nosqldb.Types.Durability;
    this.syncPolicy = nosqldb.Types.SyncPolicy;
    this.replicaAckPolicy = nosqldb.Types.ReplicaAckPolicy;
    this.readOptions = nosqldb.Types.ReadOptions;
    this.consistency = nosqldb.Types.SimpleConsistency;
    
    // Create a configuration object    
    this.configuration = new nosqldb.Configuration();
    this.configuration.proxy.startProxy = true;
    this.configuration.proxy.host = 'localhost:5010';
    this.configuration.storeHelperHosts = ['localhost:5000'];
    this.configuration.storeName = 'kvstore';

    // Create a store with the specified configuration
    this.store = nosqldb.createStore(configuration);
    this.collections = {};

  }

  connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }
    this.connectionPromise = new Parse.Promise();
    this.store.on('open', function() {
      console.log('Connected to store');
      this.connectionPromise.resolve(this.store);
    });
    return this.connectionPromise;
  }

  collection(name: string) {
    if (this.collections[name]) return Parse.Promise.as(this.collection[name]);
    const retPromise = new Parse.Promise();
    this.connect().then(() => {
      this.collections[name] = new NoSQLCollection(name, this.store);
      retPromise.resolve(this.collections[name]);
    });
    return retPromise;
  }

  adaptiveCollection(name: string) {
    return this.collection(string);
  }

  schemaCollection(collectionPrefix: string) {
    if (this.schemaCollection) return Parse.Promise.as(this.schemaCollection);
    const retPromise = new Parse.Promise();
    this.adaptiveCollection(`${collectionPrefix}${SchemaCollectionName}`)
      .then((collection) => {
        this.schemaCollection = new MongoSchemaCollection(collection);
        retPromise.resolve(this.schemaCollection);
      });
    return retPromise;
  }

  collectionExists(name: string) {
    return true;
  }

  dropCollection(name: string) {

  }
  
}

export default NoSQLStorageAdapter;
module.exports = NoSQLStorageAdapter; // Required for tests


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
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // parsing and re-formatting causes the auth value (if there) to get URI
    // encoded
    const encodedUri = formatUrl(parseUrl(this._uri));

    this.connectionPromise = MongoClient.connect(encodedUri, this._options).then(database => {
      this.database = database;
    });
    return this.connectionPromise;
  }

  collection(name: string) {
    return this.connect().then(() => {
      return this.database.collection(name);
    });
  }

  adaptiveCollection(name: string) {
    return this.connect()
      .then(() => this.database.collection(name))
      .then(rawCollection => new MongoCollection(rawCollection));
  }

  schemaCollection(collectionPrefix: string) {
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
