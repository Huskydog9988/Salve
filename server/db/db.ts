import loki from "lokijs";

/**
 * Checks if a collection exists and creates it if not
 * @param name Name of colleciton
 */
function ensureCollectionExists(name: string) {
  if (db.getCollection(name) === null)
    db.addCollection(name, {
      unique: ["id"],
      autoupdate: true,
    });
  console.log(`Ensured ${name}`);
}

/**
 * Runs when db is initialized
 */
function databaseInitialize() {
  ensureCollectionExists("users");
  ensureCollectionExists("meetings");

  console.log("db finished initialization");

  // main(db);
}

export const db = new loki("database.db", {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback: databaseInitialize,
});
