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
  user: "upu6jdctcxjf6f6a",
  host: "byodwdp9gst6ojbbl16c-mysql.services.clever-cloud.com",
  password: "iAW5FVLu4LmqDsixB21m",
  database: "byodwdp9gst6ojbbl16c"
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
  service: "Gmail",
  auth: {
    user: "help.sudorv@gmail.com",
    pass: "frbu rijm dzaz qxsx",
  },
});


app.get("/rough", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "rough.html"));
})


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "home.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "signup.html"));
});

app.get("/resume", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "resume.html"));
});

app.get("/hireme", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "hireme.html"));
});

app.get("/innovations", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "innovation.html"));
});

app.get("/projects", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "innovation.html"));
});

app.get("/services", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "services.html"));
});

app.get("/blogs", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "blogs.html"));
});

app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "blog.html"));
});







//get project's data
app.get("/innovation/get/projectData", async (req, res) => {
  const headers = JSON.parse(req.headers.body);
  const pid = headers.pid;
  const payload = headers.payload;
  const request = headers.request;
  let like_check = null;

  const query = request == "data+media" ? `
      SELECT p.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
            'media_id', m.id,
            'media_url', m.media_url,
            'media_type', m.media_type,
            'caption', m.caption,
            'sort_order', m.sort_order
        )
      ) AS media
      FROM projects p
      LEFT JOIN (
          SELECT *
          FROM project_media
          ORDER BY sort_order
      ) m ON p.pid = m.pid
      WHERE p.pid = '${pid}'
      GROUP BY p.pid, p.title, p.description, p.status, p.time;` : `select * from projects ${headers.query_type}`;

  if (pid) {
    const ip = cleanIP(req.ip);

    // check if liked or not
    const like_result = await getSetData(`SELECT * FROM likes WHERE pid = '${pid}' AND likedBy = '${payload.username}' AND email = '${payload.email}'`);
    like_check = like_result.length > 0 ? 1 : 0;

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


// pagination endpoint
app.get("/get/blogs", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  // First, get total count
  sql.query("SELECT COUNT(*) AS count FROM blogs", (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }

    const total = countResult[0].count;

    // Then, get page data
    sql.query(
      "SELECT * FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "DB error" });
        }

        res.json({
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          blogs: rows,
        });
      }
    );
  });
});


// search blogs OR fetch by ID
app.get("/search/blogs", (req, res) => {
  const { id, q = "", filter = "", page = 1, limit = 6, email } = req.query;
  const offset = (page - 1) * limit;

  // ✅ If `id` is provided → fetch single blog + increment views safely
  if (id) {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Step 1: check if already viewed
    const checkQuery = `
      SELECT * FROM blog_views 
      WHERE blog_id = ? AND (email = ? OR (email IS NULL AND ip_address = ?)) 
      LIMIT 1`;

    sql.query(checkQuery, [id, email || null, ipAddress], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to check views" });
      }

      if (rows.length === 0) {
        // Step 2: not viewed → increment views
        const updateQuery = `UPDATE blogs SET views = views + 1 WHERE id = ?`;
        sql.query(updateQuery, [id], (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Failed to update views" });
          }

          // Step 3: insert into blog_views
          const insertQuery = `INSERT INTO blog_views (blog_id, email, ip_address) VALUES (?, ?, ?)`;
          sql.query(insertQuery, [id, email || null, ipAddress], (err3) => {
            if (err3) {
              console.error(err3);
              // still continue to fetch blog even if insert fails
            }

            // Step 4: fetch updated blog
            const fetchQuery = `SELECT * FROM blogs WHERE id = ? LIMIT 1`;
            sql.query(fetchQuery, [id], (err4, rows2) => {
              if (err4) {
                console.error(err4);
                return res.status(500).json({ error: "Failed to fetch blog" });
              }

              if (rows2.length === 0) {
                return res.status(404).json({ error: "Blog not found" });
              }

              return res.json(rows2[0]);
            });
          });
        });
      } else {
        // Already viewed → just fetch blog without increment
        const fetchQuery = `SELECT * FROM blogs WHERE id = ? LIMIT 1`;
        sql.query(fetchQuery, [id], (err2, rows2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: "Failed to fetch blog" });
          }

          if (rows2.length === 0) {
            return res.status(404).json({ error: "Blog not found" });
          }

          return res.json(rows2[0]);
        });
      }
    });
    return;
  }

  // ✅ Otherwise → normal search + pagination
  let where = [];
  let values = [];

  if (q) {
    where.push("(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)");
    values.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (filter) {
    where.push("category = ?");
    values.push(filter);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const searchQuery = `
    SELECT * FROM blogs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?`;

  sql.query(searchQuery, [...values, Number(limit), Number(offset)], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Search failed" });
    }

    const countQuery = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
    sql.query(countQuery, values, (err2, countResult) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: "Count failed" });
      }

      const total = countResult[0].total;

      res.json({
        data: rows,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      });
    });
  });
});



// post request

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }

  const query = "SELECT * FROM loginData WHERE email = ? AND password = ?";
  sql.query(query, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      // User found
      res.json({ success: true, message: "Login successful", data: results[0] });
    } else {
      // No matching user
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

app.post("/newsletter", (req, res) => {
  const { name, email } = req.body;
  const time = new Date().getTime();

  // Insert into database
  const query = `INSERT INTO newsletter (name, email, time) VALUES (?, ?, ?)`;
  sql.query(query, [name, email, time], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ msg: "Already subscribed to the newsletter." });
    }

    // Send welcome email
    const mailOptions = {
      from: "help.sudorv@gmail.com",
      to: email,
      subject: "Newsletter Subscription @Rahul Verma's Portfolio!",
      html: `
  <div
    style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:0 auto; border:1px solid #e0e0e0; border-radius:10px; overflow:hidden;">

    <!-- Header -->
    <div style="background:#f9f9f9; padding:15px; text-align:center;">
      <img src="https://v2vision.blog/imgs/rahul1.png" alt="Rahul Verma Logo" style="width:60px;" />
    </div>

    <!-- Body -->
    <div style="padding:25px; text-align:left; font-family: Arial, sans-serif; line-height:1.6; color:#333;">
      <p style="font-size:14px; color:#777; margin:0;">📩 Subscription Confirmed</p>

      <h2 style="color:#111; margin:8px 0 15px; font-size:22px;">
        Welcome aboard, ${name}! 🎉
      </h2>

      <p style="font-size:15px; margin:0 0 15px;">
        You’ve successfully joined <span style="color:#0d6efd; font-weight:bold;">Rahul Verma’s Newsletter</span>.
        From now on, you’ll be the first to receive updates on my latest <strong>blogs</strong>,
        <strong>projects</strong>, and <strong>innovations</strong> 🚀
      </p>

      <div style="background:#f9f9f9; border-left:4px solid #0d6efd; padding:15px; margin:15px 0; border-radius:5px;">
        <p style="margin:0; font-size:14px; color:#444;">
          Here’s what you can expect in your inbox: <br>
          🔹 Insights from my newest blog posts <br>
          🔹 Behind-the-scenes of innovative projects <br>
          🔹 Fresh ideas and experiments in tech
        </p>
      </div>

      <p style="font-size:15px; margin-bottom:20px;">
        I’m excited to share this journey with you — let’s explore, build, and innovate together.
      </p>

      <a href="https://rahulverma.is-a.dev"
        style="display:inline-block; padding:10px 16px; background:#0d6efd; color:#fff; text-decoration:none; border-radius:5px; font-size:14px; font-weight:bold;">
        🌐 Visit Portfolio
      </a>
    </div>



    <!-- Footer -->
    <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#555;">
      <p style="margin:5px 0;">Follow me:</p>
      <a href="https://github.com/SudoRV" style="margin:0 5px;"><img
          src="https://cdn-icons-png.flaticon.com/24/25/25231.png" alt="GitHub" /></a>
      <a href="https://www.linkedin.com/in/rahul-verma-92a4b01b2/" style="margin:0 5px;"><img
          src="https://cdn-icons-png.flaticon.com/24/174/174857.png" alt="LinkedIn" /></a>

      <p style="margin:10px 0 5px; font-size:10px; color:#888;">
        © 2025 Rahul Verma. All rights reserved.
      </p>

      <!-- Small unsubscribe button -->
      <a href="https://rahulverma.is-a.dev/unsubscribe?email=${encodeURIComponent(email)}"
        style="display:inline-block; padding:5px 10px; background:#ccc; color:#333; text-decoration:none; border-radius:3px; font-size:10px;">
        Unsubscribe
      </a>
    </div>
  </div>
  `,
    };



    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ msg: "Subscription saved, but failed to send email." });
      }
      res.json({ msg: "Subscribed to the newsletter! Check your email for confirmation." });
    });
  });
});


app.post("/contactus", (req, res) => {
  const { name, email, message } = req.body;
  // Define email options
  const mailOptions = {
    from: "help.sudorv@gmail.com", // Replace with your email address
    to: email, // Replace with your recipient's email address
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
    from comments where projectId = "${req.body.projectId}" and username = "${req.body.parent
      }" and time = "${req.body.replyingCommentTime}" and parent = "${req.body.replyingCommentParent
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
  query3 = `insert into likes(srno,indexes,likedBy,type) values(${maxSrno.srno + 1
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
