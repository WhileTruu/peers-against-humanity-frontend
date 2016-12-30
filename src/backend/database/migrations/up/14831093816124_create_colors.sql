CREATE TABLE colors (
  id SMALLINT,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);

ALTER TABLE colors ADD CONSTRAINT PK_colors_id
	PRIMARY KEY (id)
;

ALTER TABLE colors ADD CONSTRAINT UQ_colors_name UNIQUE (name)
;
