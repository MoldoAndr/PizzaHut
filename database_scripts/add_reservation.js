// app.js

const { Client } = require('pg');
const { isTableReserved } = require('./verificare_rezervare'); // Correct path to the verificare_rezervare.js file

const client = new Client({
    host: "192.168.1.131",
    user: "postgres",
    port: 5432,
    password: "271210",
    database: "pizzahut"
});

async function addReservation(clientName, tableId, reservationDatetime) {
    try {
        await client.connect();

        // Call the isTableReserved function correctly
        if (await isTableReserved(tableId, reservationDatetime)) {
            console.log("The table is reserved at the specified datetime.");
        } else {
            const insertQuery = `
                INSERT INTO reservation (client, table_id, reservation_datetime)
                VALUES ($1, $2, $3);
            `;
            const insertValues = [clientName, tableId, reservationDatetime];
            await client.query(insertQuery, insertValues);

            console.log("Reservation added successfully.");
        }
    } catch (error) {
        console.error("Error adding reservation:", error.message);
    } finally {
        await client.end();
    }
}

const clientName = 3;
const tableId = 1;
const reservationDatetime = new Date();

addReservation(clientName, tableId, reservationDatetime);