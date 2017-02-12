
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS card_tags (
      card_id integer NOT NULL,
      tag_id integer NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
    );

    ALTER TABLE card_tags ADD CONSTRAINT FK_card_tags_card_id
      FOREIGN KEY (card_id)
      REFERENCES cards (id)
      ON UPDATE Cascade
    ;

    ALTER TABLE card_tags ADD CONSTRAINT FK_card_tags_tag_id
      FOREIGN KEY (tag_id)
      REFERENCES tags (id)
      ON UPDATE Cascade
    ;
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`DROP TABLE IF EXISTS card_tags CASCADE;`)
};
