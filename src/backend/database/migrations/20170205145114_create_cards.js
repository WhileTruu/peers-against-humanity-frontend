
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE cards (
      id SERIAL UNIQUE,
      language_id INTEGER NOT NULL,
      color_id SMALLINT NOT NULL,
      card_text VARCHAR(255) NOT NULL,
      pick SMALLINT,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
    );

    ALTER TABLE cards ADD CONSTRAINT FK_cards_language_id
      FOREIGN KEY (language_id)
      REFERENCES languages (id)
      ON UPDATE Cascade
    ;

    ALTER TABLE cards ADD CONSTRAINT FK_cards_color_id
      FOREIGN KEY (color_id)
      REFERENCES colors (id)
      ON UPDATE Cascade
    ;

    ALTER TABLE cards ADD CONSTRAINT FK_cards_user_id
      FOREIGN KEY (user_id)
      REFERENCES users (id)
      ON UPDATE Cascade
    ;

    ALTER TABLE cards ADD CONSTRAINT UQ_cards_text UNIQUE (card_text);

    ALTER TABLE cards ADD CONSTRAINT CHK_cards_text_not_empty
      CHECK (btrim(card_text) <> '')
    ;
  `)
};

exports.down = function(knex, Promise) {
  return knex.raw(`DROP TABLE IF EXISTS cards`)
};
