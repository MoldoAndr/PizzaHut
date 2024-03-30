// verificare_rezervare.js (or isTableReserved.js)

const { Client } = require('pg');

const client = new Client({
    host: "192.168.1.131",
    user: "postgres",
    port: 5432,
    password: "271210",
    database: "pizzahut"
});

async function isTableReserved(tableId, reservationDatetime) {
    try {
        await client.connect();

        // Query to check if the table is reserved at the specified datetime
        const query = `
            SELECT COUNT(*)
            FROM reservation
            WHERE table_id = $1
            AND reservation_datetime = $2;
        `;
        const values = [tableId, reservationDatetime];
        const result = await client.query(query, values);

        // If the count is 0, the table is not reserved; otherwise, it's reserved
        const isReserved = result.rows[0].count > 0;

        return isReserved;
    } catch (error) {
        console.error("Error checking table reservation:", error.message);
        return false;
    } finally {
        await client.end();
    }
}

module.exports = {
    isTableReserved
};
