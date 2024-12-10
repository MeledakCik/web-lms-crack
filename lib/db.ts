import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_crack",
});


db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Successfully connected to database.");
    db.query('SHOW DATABASES;', (error, results) => {
        if (error) console.error("Error fetching databases:", error);
        else console.log("Databases available:", results);
    });
});

