
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
CREATE OR REPLACE FUNCTION check_reservation_interval() 
    RETURNS TRIGGER AS $$
    BEGIN
IF EXISTS (
    SELECT 1
    FROM reservation
    WHERE table_id = NEW.table_id
    AND reservation_datetime >= NEW.reservation_datetime - INTERVAL '90 minutes'
    AND reservation_datetime <= NEW.reservation_datetime + INTERVAL '90 minutes'
) THEN
    RAISE EXCEPTION 'A reservation already exists for this table within 90 minutes of the requested time';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER reservation_interval_trigger
BEFORE INSERT ON reservation
FOR EACH ROW
EXECUTE FUNCTION check_reservation_interval();


CREATE OR REPLACE FUNCTION update_reservation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE clients
    SET reservation_count = reservation_count + 1
    WHERE id = NEW.client::int; -- Convert client field to integer
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER increment_reservation_count
AFTER INSERT ON reservation
FOR EACH ROW
EXECUTE FUNCTION update_reservation_count();
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
