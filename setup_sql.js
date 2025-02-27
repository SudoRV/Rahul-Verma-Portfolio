const { execSync } = require('child_process');
const mysql = require('mysql2');
const fs = require('fs');

// Function to execute shell commands
function runCommand(command) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing: ${command}`, error);
        process.exit(1);
    }
}

// Function to install MySQL
function installMySQL() {
    console.log("Installing MySQL...");
    runCommand('apt update && apt install -y mysql-server');
    console.log("Starting MySQL service...");
    runCommand('  service mysql start');
}

// Function to set MySQL root password
function setRootPassword(password) {
    console.log("Setting MySQL root password...");
    runCommand(`  mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${password}'; FLUSH PRIVILEGES;"`);
    console.log("Root password changed successfully.");
}

// Function to create a MySQL database
function createDatabase(dbConfig, dbName) {
    const connection = mysql.createConnection(dbConfig);
    console.log(`Creating database ${dbName}...`);
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) {
            console.error("Error creating database:", err);
            process.exit(1);
        }
        console.log("Database created successfully.");
        connection.end();
    });
}

// Function to import an SQL file into a database
function importSQL(dbConfig, dbName, sqlFile) {
    if (!fs.existsSync(sqlFile)) {
        console.error(`Error: ${sqlFile} file not found!`);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlFile, 'utf8');
    const connection = mysql.createConnection({ ...dbConfig, database: dbName });

    console.log(`Importing ${sqlFile} into ${dbName}...`);
    connection.query(sql, (err) => {
        if (err) {
            console.error("Error importing database:", err);
            process.exit(1);
        }
        console.log("Database imported successfully.");
        connection.end();
    });
}

// Main function to run all steps
function setupDatabase() {
    const rootPassword = 'rahul@1992#';
    const dbName = 'rahulPortfolio';
    const sqlFile = 'database.sql';
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: rootPassword,
        multipleStatements: true
    };

    installMySQL();
    setRootPassword(rootPassword);
    createDatabase(dbConfig, dbName);
    
    // Wait for a second before importing to ensure DB is created
    setTimeout(() => importSQL(dbConfig, dbName, sqlFile), 1000);
}

module.exports = setupDatabase;