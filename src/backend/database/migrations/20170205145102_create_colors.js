
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE colors (
      id SMALLINT UNIQUE,
      name VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
    );

    ALTER TABLE colors ADD CONSTRAINT PK_colors_id
      PRIMARY KEY (id)
    ;

    ALTER TABLE colors ADD CONSTRAINT UQ_colors_name UNIQUE (name)
    ;

    insert into colors(id, name) values (1, 'white');
    insert into colors(id, name) values (2, 'black');
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`DROP TABLE IF EXISTS colors CASCADE;`)
};
