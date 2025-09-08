const mysql = require("mysql2");
const crypto = require("crypto");

const sql = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "rahul@1992#",
  database: "rahulPortfolio",
});

const data = {
  title: "Auto Cooking Machine",
  status: "Completed",
  type: "innovation",
  description: `
Auto Cooking Machine is an innovative kitchen automation system designed to prepare meals with minimal human intervention. It integrates hardware sensors, microcontrollers, and intelligent software to automate the cooking process, making it efficient, safe, and convenient for users.

Core Features:
- 🤖 Fully automated cooking process: ingredients are added, measured, and cooked automatically.
- 🌡 Temperature and time control for precise cooking of various dishes.
- 🥘 Multi-stage cooking: supports frying, boiling, steaming, and mixing.
- 💡 Smart recipe management: users can select pre-programmed recipes or customize their own.
- 🔔 Alerts and notifications via mobile app when cooking stages are complete.
- 🧼 Safety mechanisms: auto shut-off, overheat detection, and lid sensors to prevent accidents.

How It Works:
1. User selects a recipe via a touchscreen interface or mobile app.
2. Ingredients are automatically dispensed in measured quantities.
3. The system controls cooking temperature, mixing speed, and timing for each stage.
4. Cooking progress is monitored with sensors, and adjustments are made in real-time.
5. Once the meal is ready, the machine notifies the user and keeps it warm until served.

Use Cases:
- Home kitchens for convenient meal preparation.
- Offices or cafeterias to automate meal cooking for multiple people.
- Smart home integration to reduce manual cooking effort.

Requirements:
- Microcontroller (e.g., Arduino or ESP-based system) for hardware control.
- Sensors for temperature, weight, and motion detection.
- Motorized actuators for ingredient dispensing and stirring.
- Software interface (mobile app or touchscreen) for recipe selection and monitoring.

This project represents a significant innovation in kitchen automation, reducing cooking effort and ensuring consistent results.
`
};

async function setdata(data) {
  const { title, status, description, type } = data;
  let time = new Date().getTime();
  let hashdata = title + status + description + time.toString();
  let pid = crypto.createHash("sha256").update(hashdata).digest("hex").slice(0, 12);

  sql.query(
    `INSERT INTO projects VALUES (
      "${pid}",
      "",
      "${title}",
      "${status}",
      0,
      0,
      "${time}",
      "${description.replace(/"/g, '\\"')}",
      "${type}"
    )`,
    (err, result) => {
      if (err) throw err;
      else console.log("Auto Cooking Machine inserted:", result);
    }
  );
}

setdata(data);
