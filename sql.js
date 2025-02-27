const mysql = require("mysql2");
const crypto = require("crypto");
const { resourceLimits } = require("worker_threads");

const sql = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "rahul@1992#",
  database: "rahulPortfolio",
});

data = {
    title:"robo Maa",
    status:"In Progress",
    description:`
    Introducing our innovative Auto-Cooking Machine, a cutting-edge kitchen appliance designed to revolutionize your cooking experience. This intelligent device seamlessly combines state-of-the-art technology with user-friendly functionality, automating various cooking processes to make meal preparation a breeze.

The Auto-Cooking Machine features a sleek and compact design, fitting seamlessly into any modern kitchen. With its intuitive interface, users can easily select from a diverse range of recipes and cooking modes. The machine's advanced sensors and precision controls ensure precise temperature and timing, guaranteeing consistently delicious results every time.

From quick and easy weeknight dinners to elaborate gourmet dishes, our Auto-Cooking Machine adapts to your culinary needs. Simply load the ingredients, choose your preferred settings, and let the machine handle the rest. Whether you're a novice cook or a seasoned chef, this appliance takes the guesswork out of cooking, allowing you to enjoy restaurant-quality meals in the comfort of your home.

Say goodbye to time-consuming meal preparations and hello to a smarter way of cooking. With the Auto-Cooking Machine, we're redefining convenience in the kitchen, empowering you to create culinary masterpieces effortlessly. Elevate your cooking game with technology that works for you.
    `
}


async function setdata(data) {
    const { title,status,description } = data;

    let time = new Date().getTime();

    hashdata = title+status+description+time.toString();
    
    pid =  hash = hash = crypto.createHash("sha256").update(hashdata.toString()).digest("hex").slice(0,12);

    sql.query(`insert into projects values(
        "${pid}",
        "",
        "${title}",
        "${status}",
        0,
        "${time}",      
        "${description}"        
    )`,(err,result)=>{
        if (err) throw err;
        else{
            console.log(result);
        }
    })
}

module.exports = setdata;
