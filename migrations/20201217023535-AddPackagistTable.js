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
  return db.createTable('packagist_downloads', {
    date: { type: 'date', primaryKey: true, notNull: true},
    library: { type: 'string', primaryKey: true, notNull: true },
    downloads: { type: 'int', unsigned: true, notNull: true },
  });
};

exports.down = function(db) {
  return db.dropTable('packagist_downloads');
};

exports._meta = {
  "version": 1
};
