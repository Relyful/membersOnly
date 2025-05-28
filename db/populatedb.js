#! /usr/bin/env node

const { Client } = require("pg");
require('dotenv').config();

const SQL = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fname VARCHAR(80),
  sname VARCHAR(80),
  username VARCHAR(80) UNIQUE,
  password VARCHAR(255),
  mem_status BOOLEAN DEFAULT FALSE
  admin_status BOOLEAN DEFAULT FALSE
);


CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(50),
  text VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

INSERT INTO users (fname, sname, username, password)
VALUES ('123', '123', 'Fake_User', '111111'),
('111', '1111, 'NotRealUser', '1351354');

INSERT INTO messages (title, text, created_by)
VALUES ('Very message', 'WTHELLY', 1),
('Much message', 'So cool!', 2);
`;

async function main() {
  console.log('Seeding...');
  const client = new Client({
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('Done!');
};

main();