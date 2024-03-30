const { Client } = require('pg');

const client = new Client({
    host: "192.168.1.131",
    user: "postgres",
    port: 5432,
    password: "271210",
    database: "pizzahut"
});

client.connect();

client.query(
    `
SELECT 
    tables.table_name, 
    columns.column_name, 
    columns.data_type
FROM 
    information_schema.tables AS tables
JOIN 
    information_schema.columns AS columns
ON 
    tables.table_name = columns.table_name
WHERE 
    tables.table_schema = 'public';
    `,
    (err, res) => {
        if (err) {
            console.error("Error retrieving table list:", err.message);
            client.end();
            return;
        }
        console.log("Tables in the database:");
        res.rows.forEach(row => {
            console.log(row.table_name);
        });
        client.end();
    }
);
