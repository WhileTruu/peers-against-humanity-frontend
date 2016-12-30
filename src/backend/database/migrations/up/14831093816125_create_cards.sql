CREATE TABLE cards (
  id SERIAL UNIQUE,
  language_id INTEGER NOT NULL,
  color_id SMALLINT NOT NULL,
  text VARCHAR(255) NOT NULL,
  pick SMALLINT NOT NULL DEFAULT 1,
  user_id INTEGER NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE cards ADD CONSTRAINT FK_cards_language_id
  FOREIGN KEY (language_id)
  REFERENCES languages (id)
  ON DELETE Set Null ON UPDATE Cascade
;

ALTER TABLE cards ADD CONSTRAINT FK_cards_color_id
  FOREIGN KEY (color_id)
  REFERENCES colors (id)
  ON DELETE Set Null ON UPDATE Cascade
;

ALTER TABLE cards ADD CONSTRAINT FK_cards_user_id
  FOREIGN KEY (user_id)
  REFERENCES users (id)
  ON DELETE Set Null ON UPDATE Cascade
;

ALTER TABLE cards ADD CONSTRAINT UQ_cards_text UNIQUE (text);

ALTER TABLE cards ADD CONSTRAINT CHK_cards_text_not_empty
  CHECK (btrim(text) <> '')
;
