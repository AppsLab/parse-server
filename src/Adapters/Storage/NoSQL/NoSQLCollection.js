export class NoSQLCollection {
  _name: string;
  _store: Object;
  

  constructor(name: string, store: Object) {
    this._name = name;
    this._store = store;
  }

  find(query, { skip, limit, sort } = {}) {
    
  }

  _rawFind(query, { skip, limit, sort } = {}) {

  }

  count(query, { skip, limit, sort } = {}) {
  }

  findOneAndUpdate(query, update) {
  }

  insertOne(object) {

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
