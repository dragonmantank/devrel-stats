'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('daily_stats', {
    date: { type: 'date', primaryKey: true },
    language: { type: 'string', primaryKey: true, notNull: true },
    library: { type: 'string', primaryKey: true, notNull: true },
    downloads: { type: 'int', unsigned: true, notNull: true },
    created: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
  })
};

exports.down = function(db) {
  return db.dropTable('daily_stats');
};

exports._meta = {
  "version": 1
};
