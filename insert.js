const mysql = require("mysql2");

// 1️⃣ Create connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rahul@1992#",
  database: "rahulPortfolio",
  charset: "utf8mb4" // ✅ Important for emojis
});

// 2️⃣ Full description with emojis and markdown
const descriptionText = `# 🍳 **Auto Cooking Machine | Fully Automated Kitchen System**

**Welcome to the future of cooking!**  
The **Auto Cooking Machine** is an innovative kitchen automation system designed to prepare meals with minimal human effort.  
It combines smart hardware, precise sensors, and intelligent software to make cooking **efficient, safe, and super convenient**.

~ The Auto Cooking Machine is an innovative kitchen automation system designed to prepare meals with minimal human effort.  
It combines smart hardware, precise sensors, and intelligent software to make cooking efficient, safe, and super convenient
~
---

## ⚙️ **Core Features**

- 🤖 **Fully Automated Cooking** – Measures and cooks ingredients automatically.  
- ⏱️ **Temperature & Time Control** – Perfect precision for all types of dishes.  
- 🍲 **Multi-Stage Cooking** – Supports frying, boiling, steaming, and mixing.  
- 📖 **Smart Recipe Management** – Choose pre-programmed recipes or create your own.  
- 📱 **Mobile Alerts & Notifications** – Get notified when each cooking stage is complete.  
- 🔒 **Safety Mechanisms** – Auto shut-off, overheat detection, lid sensors, and more.

---

## 🧠 **How It Works**

1. 🍽️ Select a recipe via the **touchscreen interface** or **mobile app**.  
2. ⚖️ Ingredients are **dispensed automatically** in exact quantities.  
3. 🔥 The system manages **cooking temperature, timing, and mixing** for each stage.  
4. 🧪 **Sensors monitor progress** and adjust cooking parameters in real-time.  
5. 🍛 Meal ready? The machine sends a **notification** and keeps it warm until served.

---

## 🏠 **Use Cases**

- 👩‍🍳 **Home Kitchens** – Cook delicious meals effortlessly.  
- 🏢 **Offices & Cafeterias** – Automate meal preparation for multiple people.  
- 🏡 **Smart Home Integration** – Reduce manual cooking time and effort.

---

## 🧩 **Requirements**

- 💻 **Microcontroller** – Arduino / ESP-based system  
- 🌡️ **Sensors** – Temperature, weight, and motion sensors  
- ⚙️ **Actuators** – Motors for ingredient dispensing & stirring  
- 📲 **Software Interface** – Mobile app or touchscreen for recipe selection & monitoring  

---

## 📚 **Resources**
- **CAD Files:** [Lead screw and bearing housing](https://drive.google.com/drive/folders/1daX-U7oMZgNhqap1tKNaXRll-W8jRcvB?usp=drive_link)
- ▶️ **YouTube Progress Video:** [Watch Auto Cooking Machine in Progress](https://youtu.be/N6Ze1eLMtEs)

---

## 💡 **Why This Project?**

- ✨ Reduces cooking effort and human error.  
- 🍴 Ensures consistent, delicious results every time.  
- 🧠 Safe, intelligent, and perfect for modern kitchens.

---

⭐ **Revolutionize your kitchen – one recipe at a time!**
`;

// 3️⃣ PID to update
const pidValue = "f14f3e29ad74"; // replace with your actual pid

// 4️⃣ Update query with parameterized values
const sqlQuery = "UPDATE projects SET description = ? WHERE pid = ?";

// 5️⃣ Execute query
conn.query(sqlQuery, [descriptionText, pidValue], (err, results) => {
  if (err) {
    console.error("Error updating description:", err);
  } else {
    console.log("Description updated successfully!", results.affectedRows);
  }
  conn.end(); // Close connection
});
