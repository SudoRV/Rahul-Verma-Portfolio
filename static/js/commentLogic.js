let indexToAppendComment = 0;
isReplyUserCommentLoaded = 0;

let prevCommentData = {
  username: "",
  time: "",
};

let projectId = "NULL";
let openInnovationDisplayStat = 0;
parentUserName = "NULL";
replyingCommentParent = "NULL";
replyingCommentTime = "";
replyingCommentReplies = "";

localData = JSON.parse(window.localStorage.getItem("loginData"));

lastIndexToLoadComment = 0;

// comment logic
innovationContChilds = document.getElementsByClassName("innovationContChilds");

for (innovationContChild of innovationContChilds) {
  innovationContChild.addEventListener("click", () => { });
}

//functions

function fetchSetComments(
  url,
  qty,
  pid,
  username,
  puname,
  rcp,
  time,
  indexToAppend
) {
  activeCommentableElt.innerHTML = "";
  //fetch comments
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      body: JSON.stringify({
        quantity: qty,
        lastIndex: 10,
        projectId: pid,
        parent: puname,
        rcp: rcp,
        username: username,
        time: time,
      }),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      likedComments = res.pop().likedComments;
      totalComments = res.pop().totalComment;
      totalComment = document.getElementById("projectTotalComment");
      totalComment.innerText = totalComments;

      res.forEach((data) => {
        if (likedComments.includes(data.indexes)) {
          isCommentLiked = true;
          likedComments.splice(likedComments.indexOf(data.indexes), 1);
        } else {
          isCommentLiked = false;
        }

        try {
          let comment_box = activeCommentableElt;
          addComment(
            comment_box,
            indexToAppend,
            comment_input,
            data.comment,
            data.name,
            data.username,
            data.time,
            data.likes,
            data.replies,
            isCommentLiked
          );
        } catch (error) {
          console.log(error);
        }
      });
    });
}

function addComment(
  parent,
  child,
  inputToBeEmpty,
  commentData,
  name,
  username,
  date,
  likes,
  replies,
  likedOrNot
) {
  comment = document.createElement("div");
  if (likedOrNot) {
    likedOrNotUrl = "/imgs/like-filled.png";
  } else {
    likedOrNotUrl = "/imgs/like.png";
  }
  comment.classList = "comment force-flex";
  comment.innerHTML += `
        <div class="user-comment-prof-pic-box">
            <p class="user-comment-prof-pic">${name[0].toUpperCase()}</p>
        </div>

        <div class="comment-data">
            <div class="force-flex">
                <p class="comment-username all-center">${username}</p>
                <p time="${date}" class="comment-time all-center">${timeAgo(
    parseInt(date)
  )}</p>
            </div>

            <p class="user-comment">${commentData}</p>

            <div class="force-flex comment-funcs">
                <button style="background-image:url(${likedOrNotUrl})" onclick="likeComment(this)" class="like-comment comment-btn hand all-center"></button>
                <p class="comment-analytics comment-likes">${likes}</p>
                <button onclick="replyUserComment(this)" class="reply-comment-btn comment-btn hand"></button>
                <p class="comment-analytics comment-replies">${replies}</p>
            </div>
        </div>
        `;
  parent.insertBefore(comment, parent.children[child]);

  inputToBeEmpty.value = "";
}

//reply btn logic
async function replyUserComment(elt) {
  index = Array.from(
    document.getElementsByClassName("reply-comment-btn")
  ).indexOf(elt);
  projectComments = document.getElementById("projectComments");
  if (activeCommentableElt == projectComments) {
    dataOfActiveComment =
      document.getElementsByClassName("comment")[index].innerHTML;

    replyingCommentParent = parentUserName;
    replyingCommentReplies =
      document.getElementsByClassName("comment-replies")[index].innerText;

    parentUserName =
      document.getElementsByClassName("comment-username")[index].innerText;

    replyingCommentTime = document
      .getElementsByClassName("comment-time")
    [index].getAttribute("time");

    // add current reply comment to new comment box

    projectComments.style.height = 0;
    projectComments.style.overflow = "hidden";

    replyUserComments = document.getElementById("reply-user-comments");
    replyUserComments.style.display = "block";
    replyUserComments.classList.remove("flip-right");
    replyUserComments.classList.add("flip-left");

    // load replied comments
    activeCommentableElt = replyUserComments;
    indexToAppendComment = 1;
    elt.disabled = true;
    puname = await getUserName(elt);

    crntCommentData = {
      username: parentUserName,
      time: replyingCommentTime,
    };

    console.log(crntCommentData, prevCommentData);
    console.log(
      !isReplyUserCommentLoaded ||
      (crntCommentData.username == prevCommentData.username &&
        crntCommentData.time == prevCommentData.time)
    );

    if (
      !isReplyUserCommentLoaded ||
      (crntCommentData.username == prevCommentData.username &&
        crntCommentData.time == prevCommentData.time)
    ) {
      replyUserComments.innerHTML = "";
      prevCommentData = crntCommentData;

      setTimeout(function () {
        comment = document.createElement("div");
        comment.classList = "comment force-flex";
        comment.innerHTML = dataOfActiveComment;
        replyUserComments.insertBefore(comment, replyUserComments.firstChild);
      }, 10);

      fetchSetComments(
        "/innovation/getcomments",
        10,
        projectId,
        localData.username,
        puname,
        replyingCommentParent,
        replyingCommentTime,
        1
      );
      isReplyUserCommentLoaded = 1;
    }
    replyUserComments.style.height = "auto";
    elt.disabled = false;
  } else {
    replyUserComments.classList.remove("flip-left");
    replyUserComments.classList.add("flip-right");
    setTimeout(function () {
      /*replyUserComments.style.display = "none";*/
      /*replyUserComments.innerHTML = "";*/
      replyUserComments.style.height = "0px";
      projectComments.style.height = "auto";
      projectComments.style.overflowY = "auto";
      /* fetchSetComments(
        "/innovation/getcomments",
        10,
        projectId,
        localData.username,
        "NULL",
        "NULL",
        "",
        0
      );*/
    }, 300);
    activeCommentableElt = projectComments;
    indexToAppendComment = 0;
    parentUserName = "NULL";
  }
}

async function getUserName(elt) {
  return new Promise((resolve, reject) => {
    index = Array.from(
      document.getElementsByClassName("reply-comment-btn")
    ).indexOf(elt);

    username = Array.from(document.getElementsByClassName("comment-username"))[
      index
    ].innerText;

    if (username) resolve(username);
    else reject("not found");
  });
}

// like comment
function likeComment(btn) {
  let index = Array.from(
    document.getElementsByClassName("like-comment")
  ).indexOf(btn);
  let avtiveProjectId = projectId;
  let commentUsername =
    document.getElementsByClassName("comment-username")[index].innerText;
  let time = document
    .getElementsByClassName("comment-time")
  [index].getAttribute("time");
  let likesBtnData = document.getElementsByClassName("comment-likes")[index];

  btn.disabled = true;
  fetch("/innovation/likecomment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: avtiveProjectId,
      commentUsername: commentUsername,
      subjectUsername: localData.username,
      time: time,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      likedSurity = data.likedSurity;
      likesBtnData.innerText =
        parseInt(likesBtnData.innerText) + parseInt(likedSurity);
      btn.disabled = false;

      if (likedSurity == 1) {
        btn.style.backgroundImage = "url('/imgs/like-filled.png')";
      } else {
        btn.style.backgroundImage = "url('/imgs/like.png')";
      }
    });
}

function createCommentLogic() {
  // create comment logic
  comment_send = document.getElementById("comment-send");
  comment_input = document.getElementById("comment-input");

  projectId = new URL(window.location.href).searchParams.get("pid");

  activeCommentableElt = document.getElementsByClassName("projectComments")[0];

  comment_input.addEventListener("input", () => {
    if (comment_input.value.length > 0) {
      comment_send.style.opacity = "1";
      comment_send.disabled = false;
    } else {
      comment_send.style.opacity = "0.6";
      comment_send.disabled = true;
    }
  });

  comment_send.addEventListener("click", () => {
    commentText = comment_input.value;
    localData = JSON.parse(window.localStorage.getItem("loginData"));
    currentTime = new Date().getTime();

    // add comment to backend

    const commentData = {
      username: localData.username,
      name: localData.name,
      time: currentTime,
      commentText: commentText.trim(),
      likes: 0,
      likedby: [],
      replies: 0,
      parent: parentUserName,
      projectId: projectId,
      replyingCommentParent: replyingCommentParent,
      replyingCommentTime: replyingCommentTime,
      replyingCommentReplies: replyingCommentReplies,
    };

    // add comment to database
    fetch("/innovation/add/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.status == 200) {
          addComment(
            activeCommentableElt,
            indexToAppendComment,
            comment_input,
            commentText,
            localData.name,
            localData.username,
            currentTime,
            "0",
            "0",
            false
          );
          // if replied to comment then update the value

          if (parentUserName !== "NULL") {
            document.getElementsByClassName("comment-replies")[0].innerText =
              resp.replies;
            replyingCommentReplies = resp.replies;
          }
          totalCommentsElt = document.getElementById("projectTotalComment");
          totalCommentsElt.innerText = parseInt(totalCommentsElt.innerText) + 1;
        }
      });
  });
  fetchSetComments(
    "/innovation/getcomments",
    10,
    projectId,
    localData.username,
    "NULL",
    "NULL",
    "",
    0
  );
}

async function openInnovationDisplay(idelt) {
  const currentInnovationDisplay = document.getElementById("currentInnovationDisplay");
  currentInnovationDisplay.classList.remove("currentInnovationDisplayDownn");
  currentInnovationDisplay.classList.add("currentInnovationDisplayUpp");

  if (idelt instanceof HTMLElement) {
    projectId = idelt.id;
  } else if (window.location.href.toString().includes("pid")) {
    projectId = new URL(window.location.href).searchParams.get("pid");
  } else {
    projectId = idelt;
  }

  let dataToAdd = await loadMediaForProject();

  parser = new DOMParser();
  eltToAdd = parser.parseFromString(dataToAdd, "text/html").body.firstChild;

  currentInnovationDisplay.appendChild(eltToAdd);

  setTimeout(() => {
    createCommentLogic();
    if (!idelt instanceof HTMLElement) {
      fetchSetComments(
        "/innovation/getcomments",
        10,
        projectId,
        localData.username,
        "NULL",
        "NULL",
        "",
        0
      );
    }
  }, 300);
  openInnovationDisplayStat = 1;
}

function closeInnovationDisplay(elt) {
  // nav.classList.remove("display-none");

  if (
    window.location.href.toString().includes("pid") &&
    openInnovationDisplayStat
  ) {
    window.history.pushState("null", "null", `${window.location.pathname}`);
  }
  currentInnovationDisplay.classList.add("currentInnovationDisplayDownn");
  setTimeout(() => {
    currentInnovationDisplay.classList.remove("currentInnovationDisplayUpp");
    currentInnovationDisplay.style.display = "none";
    eltToRmv = document.getElementById("mainInnovationDiv");

    try {
      document.getElementById("currentInnovationDisplay").removeChild(eltToRmv);
    } catch (err) { }
    openInnovationDisplayStat = 0;
  }, 300);
}

// detect back and fro page and then make a innovation dispaly if the url contains pid

window.addEventListener("popstate", (event) => {
  if (window.location.href.toString().includes("pid")) {
    projectId = new URL(window.location.href).searchParams.get("pid");
    if (openInnovationDisplayStat == 0) {
      openInnovationDisplay(projectId);
      return;
    }
    closeInnovationDisplay(projectId);
    setTimeout(() => {
      openInnovationDisplay(projectId);
    }, 300);
  } else {
    if (openInnovationDisplayStat) {
      closeInnovationDisplay(projectId);
      openInnovationDisplayStat = 0;
    }
  }
});

window.addEventListener("load", () => {
  if (window.location.href.toString().includes("pid")) {
    openInnovationDisplay(projectId);
  }
});

async function loadMediaForProject() {
  return new Promise((resolve, reject) => {
    fetch("/innovation/get/projectData", {
      method: "get",
      headers: {
        body: JSON.stringify({
          query: `select * from projects where pid = "${projectId}"`,
        }),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res.data[0];

        fetch("/innovation/get/projectData", {
          method: "get",
          headers: {
            body: JSON.stringify({
              query: `select mediaurl from projectmedia where pid = "${projectId}"`,
            }),
          },
        })
          .then((res) => res.json())
          .then((res) => {
            data.media = [res.data.map((elt) => elt.mediaurl)];

            const {
              pid,
              title,
              status,
              time,
              views,
              likes,
              rating,
              description,
              thumbnail,
              media,
            } = data;

            context = `
            <div id="mainInnovationDiv" class="flex mg2 mgt2">
      <div class="innovationCont mianGalLeftSide">
  
      <div class="innovationGal innovationChild">
          <!--<img class="galChild row1 col1" src="./imgs/innovationGallery/images/img1.webp" alt="">
          <img class="galChild row1 col1" src="./imgs/innovationGallery/images/img2.jpg" alt="">
          <img class="galChild row2 col1" src="./imgs/innovationGallery/images/img3.jpg" alt="">
          <video class="galChild row1 col2" type="mp4" controls></video>                
          <img class="galChild row1 col1" src="./imgs/innovationGallery/images/img5.jpg" alt="">
          <img class="galChild row2 col1" src="./imgs/innovationGallery/images/img6.jpg" alt="">
          <img class="galChild row1 col1" src="./imgs/innovationGallery/images/img7.jpg" alt="">
          <img class="galChild row1 col1" src="./imgs/innovationGallery/images/img9.jpg" alt="">-->
      </div>
  
      <div class="innovationTitle innovationChild">
          <p class="bold20">Title : ${title}</p>
      </div>
      <div class="workStatus innovationChild">
          <p class="bold20">Project Status : ${status}</p>
      </div>
      <p class="projectDate innovationChild">${timeAgo(parseInt(time))}</p>
  
      <div class="innovationAnalytics innovationChild">
          <div class="views analyticsChild">
              <img class="img100" src="./imgs/viewIcon.svg">
              <p>${views} Views</p>
          </div>
          <div class="project-likes analyticsChild">
              <img class="img100" src="./imgs/like.svg">
              <p>${likes} likes</p>
          </div>
          <div class="rating analyticsChild">
              <img class="img100" src="./imgs/rate.svg">
              <img class="img100" src="./imgs/rate.svg">
              <img class="img100" src="./imgs/rate.svg">
              <img class="img100" src="./imgs/rate.svg">
              <img class="img100" src="./imgs/rate.svg">
          </div>
      </div>
      <div onclick="openFull(this)" class="innovationDesc innovationChild">
          <p class="">${description.trim()}</p>
      </div>
  </div>
  
  <div onclick="" class="comments">
  <p class="comment-head">Comments<span id="projectTotalComment" style="color: grey; font-size: 14px;margin-left:2%;"> 1000</span></p>
  
  <div class="commentInpBox force-flex">
      <div class="user-comment-prof-pic-box">
          <p class="user-comment-prof-pic">R</p>
      </div>
      <textarea id="comment-input" rows="1" type="text" placeholder="Write Something"></textarea>
      <button id="comment-send" class="curvy-btn" disabled>Comment</button>
  </div>
  
  <div id="reply-user-comments" class="reply-user-comments">
  </div>
  <div id="projectComments" class="projectComments">
  </div>
  </div>
      </div>
      
            `;

            resolve(context);
          });
      });
  });
}
