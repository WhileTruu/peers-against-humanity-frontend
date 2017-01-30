CREATE TABLE card_tags (
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
