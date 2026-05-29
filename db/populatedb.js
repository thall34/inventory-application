const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS parks (
  park_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50),

  CONSTRAINT parks_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS coasters (
  coaster_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  park_id INTEGER,
  name VARCHAR(50),
  inversions SMALLINT,
  speed SMALLINT,
  height SMALLINT,
  length SMALLINT,
  FOREIGN KEY (park_id) REFERENCES parks(park_id) ON DELETE CASCADE,

  CONSTRAINT coasters_name_park_key UNIQUE (name, park_id)
);

CREATE TABLE IF NOT EXISTS riders (
rider_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50),

  CONSTRAINT riders_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS riders_coasters (
  rider_id INTEGER,
  coaster_id INTEGER,

  PRIMARY KEY (rider_id, coaster_id),

  CONSTRAINT riders_coasters_unique UNIQUE (rider_id, coaster_id),

  CONSTRAINT fk_rider
    FOREIGN KEY (rider_id)
    REFERENCES riders (rider_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_coaster
    FOREIGN KEY (coaster_id)
    REFERENCES coasters (coaster_id)
    ON DELETE CASCADE
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();