CREATE TABLE card_votes (
	card_id integer NOT NULL,
	user_id integer NOT NULL,
	vote smallint NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);

ALTER TABLE card_votes ADD CONSTRAINT FK_card_votes_card_id
  FOREIGN KEY (card_id)
  REFERENCES cards (id)
  ON UPDATE Cascade
;

ALTER TABLE card_votes ADD CONSTRAINT FK_card_votes_user_id
  FOREIGN KEY (user_id)
  REFERENCES users (id)
	ON UPDATE Cascade
;
