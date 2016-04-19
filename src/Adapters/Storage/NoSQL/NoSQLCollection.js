const Parse = require('parse/node');

export class NoSQLCollection {
  WriteOptions: Object;
  Durability: Object;
  SyncPolicy: Object;
  ReplicaAckPolicy: Object;
  ReadOptions: Object;
  Consistency: Object;
  _name: string;
  _store: Object;
  _readOptions: Object;
  _writeOptions: Object;
  _nosqldb: Object;

  constructor(name: string, store: Object) {
    this._nosqldb = require('nosqldb-oraclejs');    
    this.WriteOptions = this._nosqldb.Types.WriteOptions;
    this.Durability = this._nosqldb.Types.Durability;
    this.SyncPolicy = this._nosqldb.Types.SyncPolicy;
    this.ReplicaAckPolicy = this._nosqldb.Types.ReplicaAckPolicy;
    this.ReadOptions = this._nosqldb.Types.ReadOptions;
    this.Consistency = this._nosqldb.Types.SimpleConsistency;
    this._name = name;
    this._store = store;
    this._readOptions = new this.ReadOptions(this.Consistency.NONE_REQUIRED, 1000);
    this._writeOptions = new this.WriteOptions(
      new this.Durability(this.SyncPolicy.NO_SYNC, this.ReplicaAckPolicy.ALL,
                          this.SyncPolicy.NO_SYNC), 1000);
  }

  find(query, { skip, limit, sort } = {}) {
    console.log('find IN', query, skip, limit, sort);
    const retPromise = new Parse.Promise();
    this._store.get(this._name, query, this._readOptions, function(error, result) {
      console.log('result', result);
      if (!result) {
        retPromise.resolve([]);
      } else {
        retPromise.resolve(result);
      }
    });
    return retPromise;
  }

  _rawFind(query, { skip, limit, sort } = {}) {

  }

  count(query, { skip, limit, sort } = {}) {
  }

  findOneAndUpdate(query, update) {
  }

  insertOne(object) {
    const retPromise = new Parse.Promise();
    this._store.put(this._name, object, this.writeOptions,
                    () => {
                      console.log('insertedOne', object);
                      retPromise.resolve(object);
                    });
    return retPromise;

  }

  upsertOne(query, update) {
  }

  updateOne(query, update) {

  }

  updateMany(query, update) {
  }

  deleteOne(query) {
  }

  deleteMany(query) {
  }

  drop() {
  }
}

export default NoSQLCollection;
module.exports = NoSQLCollection;
