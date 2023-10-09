CREATE TABLE catalog (
						 instance_id TEXT NOT NULL,
						 name TEXT NOT NULL,
						 type INTEGER NOT NULL,
						 object BLOB NOT NULL,
						 path TEXT NOT NULL,
						 created_on TIMESTAMP NOT NULL,
						 updated_on TIMESTAMP NOT NULL,
						 refreshed_on TIMESTAMP NOT NULL,
						 bytes_ingested INTEGER default 0 NOT NULL,
						 PRIMARY KEY (instance_id, name)
);

CREATE UNIQUE INDEX lower_name_unique_idx ON catalog (instance_id, lower(name));

CREATE TABLE catalogv2 (
	kind TEXT NOT NULL,
	name TEXT NOT NULL,
	data BLOB NOT NULL,
	created_on TIMESTAMPTZ NOT NULL,
	updated_on TIMESTAMPTZ NOT NULL
);

CREATE TABLE controller_version (
	version INTEGER NOT NULL
);

INSERT INTO controller_version (version) VALUES (0);
