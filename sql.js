const mysql = require("mysql2");
const crypto = require("crypto");

const sql = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "rahul@1992#",
  database: "rahulPortfolio",
});

const data = {
  title: "CPU_Monitor",
  status: "Completed",
  type: "project",
  description: `
CPU_Monitor is a lightweight, frameless desktop widget built with PyQt5 for Windows. It displays real-time CPU metrics—temperature, usage, power, and clock speed—by leveraging data from OpenHardwareMonitor via WMI.

Core Features:
- ⚙️ Real-time CPU stats: temperature, usage percentage, power consumption (W), and clock frequency (GHz).
- Adaptive light/dark theme detection matching Windows UI.
- Draggable, always-on-top UI with custom trapezoidal design and frameless window.
- Automatic launch of OpenHardwareMonitor if it’s not running.

Requirements:
- Python 3.6+ on Windows.
- OpenHardwareMonitor installed (e.g. at "C:\\\\OpenHardwareMonitor\\\\OpenHardwareMonitor.exe").

GitHub: https://github.com/SudoRV/CPU_Monitor
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
      else console.log("CPU_Monitor inserted:", result);
    }
  );
}

setdata(data);
