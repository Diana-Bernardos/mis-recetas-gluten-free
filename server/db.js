const Database = require('better-sqlite3');
const db = new Database('recipes.db', { verbose: console.log });

// Create tables
const createTable = `
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    image TEXT,
    source TEXT DEFAULT 'local', -- 'local' or 'spoonacular'
    external_id TEXT
);

CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    quantity TEXT,
    checked INTEGER DEFAULT 0
);
`;

db.exec(createTable);

module.exports = db;
