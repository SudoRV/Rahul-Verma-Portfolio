const express = require("express");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
// const { resourceLimits } = require("worker_threads");
const nodemailer = require("nodemailer");
const { REFUSED } = require("dns");
const { clear } = require("console");

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
app.get("/innovation/get/projectData", async (req, res) => {
  const headers = JSON.parse(req.headers.body);
  const pid = headers.pid;
  const payload = headers.payload;
  const query = headers.query;
  let like_check = null;


  if (query.includes("pid") && !query.includes("mediaurl")) {
    const ip = cleanIP(req.ip);

    // check if liked or not
    const like_result = await getSetData(`SELECT * FROM likes WHERE pid = '${pid}' AND likedBy = '${payload.username}' AND email = '${payload.email}'`);
    like_check = like_result.length > 0 ? 1 : 0;
    console.log(like_check)

    // Build conditional fetch_query and insert_query
    let fetch_query = "";
    let insert_query = "";

    if (payload.username.startsWith("guest-")) {
      fetch_query = `SELECT * FROM views
        WHERE \`pid\` = '${pid}' 
        AND \`ip\` = '${ip}';`;

      insert_query = `
        INSERT INTO views (\`pid\`, \`ip\`, \`viewer-username\`, \`viewer-email\`)
        VALUES ('${pid}', '${ip}', '${payload.username}', '${payload.email}');
      `;
    } else {
      fetch_query = `SELECT * FROM views
        WHERE \`pid\` = '${pid}' 
        AND \`ip\` = '${ip}'
        AND \`viewer-username\` = '${payload.username}'
        AND \`viewer-email\` = '${payload.email}';`;

      insert_query = `
        INSERT INTO views (\`pid\`, \`ip\`, \`viewer-username\`, \`viewer-email\`)
        VALUES ('${pid}', '${ip}', '${payload.username}', '${payload.email}');
      `;
    }

    sql.query(fetch_query, (err, result) => {
      if (err) console.log("Fetch error:", err);

      if (result.length <= 0) {
        // Insert view
        sql.query(insert_query, (err, insertResult) => {
          if (err) {
            console.log("Insert error:", err);
          } else {
            console.log("View recorded.");

            // ✅ Update the view count in projects table
            const update_views_query = `
              UPDATE projects
              SET views = views + 1
              WHERE pid = '${pid}';
            `;

            sql.query(update_views_query, (err, updateResult) => {
              if (err) console.log("Error updating view count:", err);
              else console.log("Project views count incremented.");
            });
          }
        });
      } else {
        console.log("Project already viewed");
      }
    });
  }

  // Return the actual project data
  sql.query(query, async (err, result) => {
    if (err) throw err;
    else {
      result.length > 0 ? result[0].liked = like_check : "";
      res.status(200).json({ data: result });
    }
  });
});

function cleanIP(ip) {
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  } else if (ip.startsWith("::1")) return "127.0.0.1";
  return ip;
}

app.get("/like-project", async (req, res) => {
  const pid = req.query.pid;
  const username = req.query.username;
  const email = req.query.email;

  if (!pid || !username || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parameters" });
  }

  // Step 1: Check if already liked
  const checkQuery = `
    SELECT * FROM likes
    WHERE pid = '${pid}' 
      AND \`likedBy\` = '${username}'
      AND \`type\` = 'project';
  `;

  sql.query(checkQuery, async (err, result) => {
    if (err) {
      console.error("Error checking like:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (result.length > 0) {
      console.log("already liked");

      // 🔹 Step 1: Delete like from likes table
      const deleteLikeQuery = `
        DELETE FROM likes
        WHERE pid = '${pid}' 
          AND \`likedBy\` = '${username}' 
          AND \`type\` = 'project';
      `;

      sql.query(deleteLikeQuery, (err, delResult) => {
        if (err) {
          console.error("Error removing like:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to unlike" });
        }

        // 🔹 Step 2: Decrease project's likes count
        const decrementQuery = `
          UPDATE projects
          SET likes = likes - 1
          WHERE pid = '${pid}';
        `;

        sql.query(decrementQuery, (err, decResult) => {
          if (err) {
            console.error("Error decrementing like count:", err);
            return res
              .status(500)
              .json({ success: false, message: "Failed to update like count" });
          }

          return res
            .status(200)
            .json({ success: true, message: "disliked" });
        });
      });

      return;
    }

    try {
      // Step 2: Get next srno
      const maxSrnoResult = await getSetData(
        "SELECT IFNULL(MAX(srno), 0) AS srno FROM likes"
      );
      const nextSrno = maxSrnoResult[0].srno + 1;

      // Step 3: Insert like with srno
      const insertLikeQuery = `
        INSERT INTO likes (srno, pid, likedBy, email, type)
        VALUES (${nextSrno}, '${pid}', '${username}', '${email}', 'project');
      `;

      sql.query(insertLikeQuery, (err, result) => {
        if (err) {
          console.error("Error inserting like:", err);
          return res
            .status(500)
            .json({ success: false, message: "Failed to like" });
        }

        // Step 4: Update like count in projects
        const updateProjectQuery = `
          UPDATE projects
          SET likes = likes + 1
          WHERE pid = '${pid}';
        `;

        sql.query(updateProjectQuery, (err, result) => {
          if (err) {
            console.error("Error updating project likes:", err);
            return res
              .status(500)
              .json({
                success: false,
                message: "Failed to update project likes",
              });
          }

          return res
            .status(200)
            .json({ success: true, message: "liked" });
        });
      });
    } catch (e) {
      console.error("Error fetching max srno:", e);
      return res
        .status(500)
        .json({ success: false, message: "Failed to process like" });
    }
  });
});

// get comments
// fetchType 100 means fetch comment for all projects quantity 1 means fetch one comment for all  projects
app.get("/innovation/getcomments", (req, res) => {
  let headers = JSON.parse(req.headers.body);
  limit = headers.quantity;
  offset = headers.lastIndex;

  let query = "";
  if (headers.parent == "NULL") {
    query = `select * from comments where projectId = '${headers.projectId}' and parent = '${headers.parent}'`;
  } else {
    query = `select * from comments where projectId = '${headers.projectId}' and parent = '${headers.parent}' and relatedIndexes = (select indexes from comments where projectId = "${headers.projectId}" and username = "${headers.parent}" and parent = "${headers.rcp}" and time = "${headers.time}")`;
    // console.log(query)
  }

  sql.query(query, async (err, result) => {
    if (err) console.log(err);
    else {
      if (result.length > 0) {
        if (headers.parent == "NULL") {
          query = `select count(*) as totalComment from comments where projectId = "${headers.projectId}"`;
        } else {
          query = `select count(*) as totalComment from comments where projectId = "${headers.projectId}" and parent = "${headers.parent}"`;
        }
        let totalComment = (await getSetData(query))[0];

        likedCommentsByTheUser = await getSetData(
          `select indexes from likes where likedBy = "${headers.username}"`
        );

        result[result.length] = { totalComment: totalComment.totalComment };
        result[result.length] = {
          likedComments: likedCommentsByTheUser.map((obj) => obj.indexes),
        };
      } else {
        result = [{ totalComment: 0 }, { likedComments: [] }];
      }
      // console.log(result)
      res.send(result);
    }
  });
});

// post request

app.post("/newsletter", (req, res) => {
  req.body.time = new Date().getTime();

  const { name, email, time } = req.body;
  let query = `insert into newsletter values("${name}", "${email}", "${time}")`;
  sql.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ msg: "already subscribed the newsletter" });
    } else {
      res.json({ msg: "subscribed the newsletter" });
    }
  });
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
      res.status(500).send({ msg: "Internal Server Error" });
    } else {
      res.send({ msg: "Thank you! Your message has been sent." });
    }
  });

  // res.send(req.body)
});

app.post("/hireme", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});


// Check if email or username is already taken
app.get('/check-signup-creds', (req, res) => {
  const { email, username } = req.query;

  let query = '';
  let value = '';

  if (username) {
    query = 'SELECT username, email FROM loginData WHERE username = ?';
    value = username;
  } else if (email) {
    query = 'SELECT username, email FROM loginData WHERE email = ?';
    value = email;
  } else {
    return res.status(400).json({ available: false, error: "Invalid parameters" });
  }

  sql.query(query, [value], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ available: false });
    }

    if (result.length > 0) {
      res.json({ available: false }); // already taken
    } else {
      res.json({ available: true });  // available
    }
  });
});


app.use(express.urlencoded({ extended: true })); // important for form data
app.use(express.json()); // if needed for API

app.post("/signup", async (req, res) => {
  try {
    const referer = req.get("Referer") || req.originalUrl;

    // Get the last sno
    const lastRow = (
      await getSetData("SELECT sno FROM loginData ORDER BY sno DESC LIMIT 1")
    )[0] || { sno: 0 };
    const sno = parseInt(lastRow.sno) + 1;

    const { name, username, email, password } = req.body;

    const query = `
      INSERT INTO loginData (sno, name, username, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    sql.query(query, [sno, name, username, email, password], (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).send("Database error.");
      }

      // You can redirect or send a success message
      res.send("Signup successful!");
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Internal server error.");
  }
});



app.post("/innovation/add/comment", async (req, res) => {
  console.log(req.body);
  maxIndex = (
    await getSetData("select ifnull(max(indexes),0) as indexes from comments")
  )[0];

  feedCommentData = "";
  if (req.body.parent == "NULL") {
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
  } else {
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
    from comments where projectId = "${req.body.projectId}" and username = "${
      req.body.parent
    }" and time = "${req.body.replyingCommentTime}" and parent = "${
      req.body.replyingCommentParent
    }"
    `;
  }

  sql.query(feedCommentData, (err, result) => {
    if (err) console.log(err);
    else {
      // console.log(feedCommentData)
    }
  });

  let resp = { status: 200, message: "comment added" };
  if (req.body.parent !== "NULL") {
    let query = `update comments set replies = replies+1 where projectId = "${req.body.projectId}" and username = "${req.body.parent}" and parent = "${req.body.replyingCommentParent}" and time = "${req.body.replyingCommentTime}"`;
    sql.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        resp.replies = parseInt(req.body.replyingCommentReplies) + 1;
        res.status(200).send(JSON.stringify(resp));
      }
    });
  } else {
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
  query2 = `select indexes from comments where projectId="${data.projectId}" and username="${data.commentUsername}" and time="${data.time}"`;
  let index = (await getSetData(query2))[0];

  //update likes table
  maxSrno = (
    await getSetData("select ifnull(max(srno),0) as srno from likes")
  )[0];
  query3 = `insert into likes(srno,indexes,likedBy,type) values(${
    maxSrno.srno + 1
  },${index.indexes}, "${data.subjectUsername}", "comment")`;

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
