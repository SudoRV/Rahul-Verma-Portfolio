const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
// const { resourceLimits } = require("worker_threads");
const nodemailer = require("nodemailer");
const { REFUSED } = require("dns");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));

// database

const sql = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "rahul@1992#",
  database: "rahulPortfolio",
});

sql.query("show tables like 'loginData'", (err, result) => {
  if (err) {
    console.log(err);
    return;
  } else if (result.length <= 0) {
    console.log("table not exists");
    queryTable = `
        create table loginData(
            sno char(100),
            name varchar(40),
            username varchar(100),
            email varchar(100),
            password varchar(10)
        );`;
    sql.query(queryTable, (err, result) => {
      if (err) console.log(err);
      else {
        console.log("table created successfully");
      }
    });
  }
});

// Create a transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rahulverma.1.2005@gmail.com", // Replace with your email address
    pass: "mahhsilqlhpzyxxl", // Replace with your email password
  },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "home.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html"));
});

app.get("/resume", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "resume.html"));
});

app.get("/hireme", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "hireme.html"));
});

app.get("/innovation", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "innovation.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "services.html"));
});





//get project's data
app.get("/innovation/get/projectData",async (req,res)=>{
  let headers = JSON.parse(req.headers.body);
  console.log(headers)
  let pid = headers.pid;
  let query = headers.query;
  sql.query(query,(err,result)=>{
    if (err) throw err;
    else{
      res.status(200).json({data:result});
    }
  });
})








// get comments
// fetchType 100 means fetch comment for all projects quantity 1 means fetch one comment for all  projects
app.get("/innovation/getcomments", (req, res) => {
  let headers = JSON.parse(req.headers.body);
  console.log("hey",headers)
  limit = headers.quantity;
  offset = headers.lastIndex;

  let query = "";
  if(headers.parent=="NULL"){
    query = `select * from comments where projectId = '${headers.projectId}' and parent = '${headers.parent}'`;
  }
  else{
    query = `select * from comments where projectId = '${headers.projectId}' and parent = '${headers.parent}' and relatedIndexes = (select indexes from comments where projectId = "${headers.projectId}" and username = "${headers.parent}" and parent = "${headers.rcp}" and time = "${headers.time}")`
    // console.log(query)
  }
  
  sql.query(query, async (err, result) => {
    if (err) console.log(err);
    else {
      if (result.length > 0) {
        if(headers.parent == "NULL"){
          query=`select count(*) as totalComment from comments where projectId = "${headers.projectId}"`
        }else{
          query= `select count(*) as totalComment from comments where projectId = "${headers.projectId}" and parent = "${headers.parent}"`
        }
        let totalComment = (await getSetData(query))[0];

        likedCommentsByTheUser = await getSetData(`select indexes from likes where likedBy = "${headers.username}"`);

        result[result.length] = {totalComment:totalComment.totalComment};
        result[result.length] = {likedComments:likedCommentsByTheUser.map(obj => obj.indexes)}
      }
      else{
        result = [{totalComment:0},{likedComments:[]}];
      }
      // console.log(result)
      res.send(result);
    }
  });
});

// post request

app.post("/newsletter", (req, res) => {
  req.body.time = new Date().getTime()

  const { name, email, time} = req.body;  
  let query = `insert into newsletter values("${name}", "${email}", "${time}")`
  sql.query(query,(err,result)=>{
    if(err){
      console.log(err)
      res.json({msg:"already subscribed the newsletter"})
    }
    else{
      res.json({msg:"subscribed the newsletter"})
    }
  })
});

app.post("/contactus", (req, res) => {
  const { name, email, message } = req.body;
  // Define email options
  const mailOptions = {
    from: "rahulverma.1.2005@gmail.com", // Replace with your email address
    to: "rahulverma.1.1618@gmail.com", // Replace with your recipient's email address
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send({msg:"Internal Server Error"});
    } else {
      res.send({msg:"Thank you! Your message has been sent."});
    }
  });

// res.send(req.body)
});

app.post("/hireme", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.post("/signup", async (req, res) => {
  const referer = req.get("Referer") || req.originalUrl;

  data = (await getSetData(
    "select sno from loginData order by sno desc limit 1"
  ))[0] || {sno:0};
  sno = parseInt(data.sno) + 1;

  feedLoginData = `
    insert into loginData()
    values(
        "${sno}",
        "${req.body.name}",
        "${req.body.username}",
        "${req.body.email}",
        "${req.body.password}"
    )`;

  sql.query(feedLoginData, (err, result) => {
    if (err) console.log(err);
  });

  res.send(req.body);
});





app.post("/innovation/add/comment", async (req, res) => {
  console.log(req.body)
  maxIndex = (await getSetData(
    "select ifnull(max(indexes),0) as indexes from comments"
  ))[0];
  
  feedCommentData = ""
  if (req.body.parent == "NULL"){
    feedCommentData = `
    insert into comments
    values( 
        ${maxIndex.indexes + 1},      
        "${req.body.username}",
        "${req.body.name}",
        "${req.body.time}",
        "${req.body.commentText}",
        "${req.body.likes}",
        "${req.body.replies}",
        "${req.body.parent}",
        NULL,
        "${req.body.projectId}"
    )`;
  }else{
    feedCommentData = `
    insert into comments(
      indexes, username, name, time, comment, likes, replies, parent, relatedIndexes, projectId
    )
    select
        ${maxIndex.indexes + 1},      
        "${req.body.username}",
        "${req.body.name}",
        "${req.body.time}",
        "${req.body.commentText}",
        "${req.body.likes}",
        "${req.body.replies}",
        "${req.body.parent}",
        indexes,
        "${req.body.projectId}"
    from comments where projectId = "${req.body.projectId}" and username = "${req.body.parent}" and time = "${req.body.replyingCommentTime}" and parent = "${req.body.replyingCommentParent}"
    `;
  }

  sql.query(feedCommentData, (err, result) => {
    if (err) console.log(err);
    else{
      // console.log(feedCommentData)
    }
  });
  
  let resp={ status: 200, message: "comment added" }
  if (req.body.parent !=="NULL"){
    let query = `update comments set replies = replies+1 where projectId = "${req.body.projectId}" and username = "${req.body.parent}" and parent = "${req.body.replyingCommentParent}" and time = "${req.body.replyingCommentTime}"`
    sql.query(query,(err,result)=>{
      if (err){
        console.log(err);
      }
      else{
        resp.replies = parseInt(req.body.replyingCommentReplies)+1;
        res.status(200).send(JSON.stringify(resp));
      }
    })
  }else{
    res.status(200).send(JSON.stringify(resp));
  }
});





app.post("/innovation/likecomment", async (req, res) => {
  let data = req.body;
  let query = `  
    SELECT CASE WHEN COUNT(*) > 0 THEN -1 ELSE 1 END AS likedSurity
FROM (  
    SELECT t2.indexes,t1.username,t1.time,t1.projectId,t2.likedBy
    FROM comments t1
    JOIN likes t2 ON t1.indexes = t2.indexes
    ) as combined
WHERE likedBy = '${data.subjectUsername}' AND projectId = '${data.projectId}' AND time = '${data.time}'
    `;

  let resp = (await getSetData(query))[0];
  //update comments table likes value
  query1 = `update comments set likes = likes + ${resp.likedSurity} where projectId = "${data.projectId}" and username = "${data.commentUsername}" and time = "${data.time}"`;
  getSetData(query1);

  //extract indexes value from comments for likes table
  query2 = `select indexes from comments where projectId="${data.projectId}" and username="${data.commentUsername}" and time="${data.time}"  `;
  let index = (await getSetData(query2))[0];

  //update likes table
  maxSrno = (await getSetData("select ifnull(max(srno),0) as srno from likes"))[0];
  query3 = `insert into likes(srno,indexes,likedBy) values(${maxSrno.srno + 1},${index.indexes}, "${data.subjectUsername}")`;

  query4 = `delete from likes where indexes = ${index.indexes}`;

  if (resp.likedSurity == 1) {
    getSetData(query3);
  } else {
    getSetData(query4);
  }

  res.status(200).send(JSON.stringify(resp));
});

// functions_

async function getSetData(q) {
  return new Promise((resolve, reject) => {
    sql.query(q, (err, result) => {
      if (err) console.log(err);
      else {
        resolve(result);
      }
    });
  });
}

app.listen(8000, () => {
  console.log("running at http://localhost:8000");
});
