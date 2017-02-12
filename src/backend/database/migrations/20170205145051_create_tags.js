
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL UNIQUE,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
    );

    ALTER TABLE tags ADD CONSTRAINT PK_tags_id
      PRIMARY KEY (id)
    ;

    ALTER TABLE tags ADD CONSTRAINT UQ_tags_name UNIQUE (name)
    ;

    ALTER TABLE tags ADD CONSTRAINT CHK_tags_text_not_empty
      CHECK (btrim(name) <> '')
    ;
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`DROP TABLE IF EXISTS tags CASCADE`)
};
