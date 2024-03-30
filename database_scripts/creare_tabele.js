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

CREATE TABLE restaurant_table (
    id SERIAL PRIMARY KEY,
    table_number INT NOT NULL,
    capacity INT NOT NULL
    );  
    
    CREATE TABLE reservation (
        id SERIAL PRIMARY KEY,
        client VARCHAR(100) NOT NULL,
        table_id INT NOT NULL,
        reservation_datetime TIMESTAMP NOT NULL,
        CONSTRAINT fk_table FOREIGN KEY (table_id) REFERENCES restaurant_table (id),
        CONSTRAINT unique_table_reservation UNIQUE (table_id, reservation_datetime)
        );
    CREATE TABLE clients (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            reservation_count INT DEFAULT 0
        );
        `,
(err, res) => {
    if (err) {
        console.error("Error retrieving table list:", err.message);
        client.end();
        return;
    };
    client.end();
}
);
