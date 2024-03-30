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
SELECT * FROM restaurant_table;
    `,
    (err, res) => {
        if (err) {
            console.error("Error retrieving table list:", err.message);
            client.end();
            return;
        }
        console.log("Tables in the database:");
        res.rows.forEach(row => {
            console.log(row.table_number, row.capacity);
        });
        client.end();
    }
);
