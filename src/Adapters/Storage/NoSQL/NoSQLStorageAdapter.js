const SchemaCollectionName = '_SCHEMA';
const NoSQLCollection  = require('./NoSQLCollection.js');
const NoSQLSchemaCollection  = require('./NoSQLSchemaCollection.js');
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
  _collections: Object;
  _schemaCollection: Object;
  
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
    this.nosqldb.Logger.logLevel = this.nosqldb.LOG_LEVELS.OFF;
    this.nosqldb.Logger.logToConsole = false;
    this.nosqldb.Logger.logToFile = false;
    
    // Working with types
    this.writeOptions = this.nosqldb.Types.WriteOptions;
    this.durability = this.nosqldb.Types.Durability;
    this.syncPolicy = this.nosqldb.Types.SyncPolicy;
    this.replicaAckPolicy = this.nosqldb.Types.ReplicaAckPolicy;
    this.readOptions = this.nosqldb.Types.ReadOptions;
    this.consistency = this.nosqldb.Types.SimpleConsistency;
    
    // Create a configuration object    
    this.configuration = new this.nosqldb.Configuration();
    this.configuration.proxy.startProxy = true;
    this.configuration.proxy.host = 'localhost:5010';
    this.configuration.storeHelperHosts = ['localhost:5000'];
    this.configuration.storeName = 'kvstore';

    // Create a store with the specified configuration
    this.store = this.nosqldb.createStore(this.configuration);
    this._collections = {};

  }

  connect() {
    console.log('connect IN');
    if (this.connectionPromise) {
      console.log('connect OUT EXISTING PROMISE');            
      return this.connectionPromise;
    }
    this.connectionPromise = new Parse.Promise();
    console.log('new connection promise', this.connectionPromise);
//    console.log('this.store', this.store);
    this.store.on('open', () => {
      console.log('Connected to store');
      this.connectionPromise.resolve(this.store);
      console.log('connect OUT NEW PROMISE');      
    });
    this.store.open();
    return this.connectionPromise;
  }

  collection(name: string) {
    console.log('collection IN', name);
    if (this._collections[name]) {
      console.log('collection OUT EXISTS', name);
      return Parse.Promise.as(this._collections[name]);
    }
    const retPromise = new Parse.Promise();
    this.connect().then(() => {
      this.store.execute(`CREATE TABLE if not exists ${name} ( id long, primary key(id) )`,
                         (err) => {
                           if (err) {
                             retPromise.reject(err);
                             console.log('collection ERR', err);
                             return;
                           }
                           this._collections[name] = new NoSQLCollection(name, this.store);
                           retPromise.resolve(this._collections[name]);
                           console.log('collection OUT', name);      
                         });
    });
    return retPromise;
  }

  adaptiveCollection(name: string) {
    const dbName = `a${name}`;
    console.log('adaptiveCollection IN', name);
    const collectionPromise = this.collection(dbName);
    console.log('adaptiveCollection OUT', name, collectionPromise);
    return collectionPromise;
  }

  schemaCollection(collectionPrefix: string) {
    console.log('schemaCollection IN', collectionPrefix);
    console.log('here 2', this._schemaCollection);
    if (this._schemaCollection) return Parse.Promise.as(this._schemaCollection);
    const retPromise = new Parse.Promise();
    this.adaptiveCollection(`${collectionPrefix}${SchemaCollectionName}`)
      .then((collection) => {
        console.log('here 3');
        this._schemaCollection = new NoSQLSchemaCollection(collection);
        console.log('schemaCollection OUT', collectionPrefix);        
        retPromise.resolve(this._schemaCollection);
      });
    return retPromise;
  }

  collectionExists(name: string) {
    console.log('collectionExists IN', name);
    console.log('collectionExists OUT', name);        
    return true;
  }

  dropCollection(name: string) {
    console.log('dropCollection IN', name);
    console.log('dropCollection OUT', name);    

  }
  
}

export default NoSQLStorageAdapter;
module.exports = NoSQLStorageAdapter; // Required for tests
