const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS coasters (
  coaster_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50),
  inversions SMALLINT,
  speed SMALLINT,
  height SMALLINT,
  length SMALLINT
);

CREATE TABLE IF NOT EXISTS parks (
  park_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS riders (
rider_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS parks_coasters (
  coaster_id INTEGER REFERENCES coasters(coaster_id),
  park_id INTEGER REFERENCES parks(park_id),
  PRIMARY KEY (coaster_id, park_id)
);

CREATE TABLE IF NOT EXISTS riders_parks_coasters (
  rider_id INTEGER REFERENCES riders(rider_id),
  park_id INTEGER REFERENCES parks(park_id),
  coaster_id INTEGER REFERENCES coasters(coaster_id),
  PRIMARY KEY (rider_id, park_id, coaster_id)
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASSWORD}@localhost:5432/roller_coaster_database`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();