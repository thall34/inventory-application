const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function resetDatabase() {
  try {
    await client.connect();

    console.log("Connected to database...");

    await client.query("BEGIN");

    await client.query(`
      TRUNCATE TABLE
        riders_coasters,
        coasters,
        riders,
        parks
      RESTART IDENTITY CASCADE;
    `);

    await client.query("COMMIT");

    console.log("Database reset complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database reset failed", err);
  } finally {
    await client.end();
  };
};

resetDatabase();