let indexToAppendComment = 0;
let isReplyUserCommentLoaded = 0;

let prevCommentData = {
  username: "",
  time: "",
};

let projectId = "NULL";
let prevPID;
let openInnovationDisplayStat = 0;
let parentUserName = "NULL";
let replyingCommentParent = "NULL";
let replyingCommentTime = "";
let replyingCommentReplies = "";
let lastScrollOfInnoationCont;

let localData = JSON.parse(window.localStorage.getItem("loginData")) || {
  name: "Guest",
  username: "guest-adam",
  email: "adam@apple.com",
};

let lastIndexToLoadComment = 0;

// load specific project if pid in url
if (window.location.href.includes("pid")) {
  const pid = new URLSearchParams(window.location.search).get("pid");
  if (pid) {
    openInnovationDisplay(pid);
  }
}

window.addEventListener('popstate', (event) => {
  if (window.location.href.includes("pid")) {
    const pid = new URLSearchParams(window.location.search).get("pid");
    if (pid) {
      openInnovationDisplay(pid);
    }
  } else if (window.location.href.includes("/innovation")) {
    closeInnovationDisplay()
  }
});

// comment logic
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
    likedOrNotUrl = "/imgs/icons/projects/like-filled.png";
  } else {
    likedOrNotUrl = "/imgs/icons/projects/like.png";
  }
  comment.classList = "comment flex";
  comment.innerHTML += `
        <div class="user-comment-prof-pic-box">
            <p class="user-comment-prof-pic">${name[0].toUpperCase()}</p>
        </div>

        <div class="comment-data">
            <div class="flex">
                <p class="comment-username all-center">${username}</p>
                <p time="${date}" class="comment-time all-center">${timeAgo(
    parseInt(date)
  )}</p>
            </div>

            <p class="user-comment">${commentData}</p>

            <div class="flex comment-funcs">
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

    if (
      !isReplyUserCommentLoaded ||
      (crntCommentData.username == prevCommentData.username &&
        crntCommentData.time == prevCommentData.time)
    ) {
      replyUserComments.innerHTML = "";
      prevCommentData = crntCommentData;

      setTimeout(function () {
        comment = document.createElement("div");
        comment.classList = "comment flex";
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
        btn.style.backgroundImage = "url('/imgs/icons/projects/like-filled.png')";
      } else {
        btn.style.backgroundImage = "url('/imgs/icons/projects/like.png')";
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
    // localData = JSON.parse(window.localStorage.getItem("loginData"));
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

  lastScrollOfInnoationCont = currentInnovationDisplay.parentElement.scrollTop;
  setTimeout(() => {
    // currentInnovationDisplay.parentElement.scrollTo(0, 0);
    // currentInnovationDisplay.parentElement.style.overflow = "hidden";
  }, 100)

  if (idelt instanceof HTMLElement) {
    projectId = idelt.id;
  } else if (window.location.href.toString().includes("pid")) {
    projectId = new URL(window.location.href).searchParams.get("pid");
  } else {
    projectId = idelt;
  }

  setTimeout(async () => {
    let projectData = await loadMediaForProject("advance", { "username": localData.username, "email": localData.email });
    dataToAdd = buildContext(projectData);

    // parser = new DOMParser();
    // eltToAdd = parser.parseFromString(dataToAdd, "text/html").body.firstChild;

    currentInnovationDisplay.querySelector(".dummy-data").style.display = "none";
    currentInnovationDisplay.querySelector(".data").innerHTML = dataToAdd;

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

    setTimeout(() => {
      createHoverEffect();
    }, 100);
  }, 800)

  openInnovationDisplayStat = 1;
}

function closeInnovationDisplay() {
  // nav.classList.remove("display-none");
  // currentInnovationDisplay.parentElement.style.overflowY = "auto";
  // setTimeout(() => {
  //   currentInnovationDisplay.parentElement.scrollTo(0, lastScrollOfInnoationCont);
  // }, 100)

  if (
    window.location.href.toString().includes("pid") &&
    openInnovationDisplayStat && prevPID != projectId
  ) {
    // window.history.pushState("null", "", `${window.location.pathname}`);
    // window.history.replaceState(null, "", `${window.location.pathname}`);

    // prevPID = projectId;
  }
  currentInnovationDisplay.classList.add("currentInnovationDisplayDownn");
  setTimeout(() => {
    currentInnovationDisplay.classList.remove("currentInnovationDisplayUpp");
    currentInnovationDisplay.style.display = "none";
    eltToRmv = document.getElementById("mainInnovationDiv");

    try {
      document.getElementById("currentInnovationDisplay").removeChild(eltToRmv);
    } catch (err) { }

    currentInnovationDisplay.querySelector(".dummy-data").style.display = "block";
    openInnovationDisplayStat = 0;
  }, 400);
}

// detect back and fro page and then make a innovation dispaly if the url contains pid

async function loadMediaForProject(mode = "normal", payload) {
  return new Promise((resolve, reject) => {
    fetch("/innovation/get/projectData", {
      method: "get",
      headers: {
        body: JSON.stringify({
          pid: projectId,
          request: mode == "advance" ? "data+media" : "data",
          payload: payload
        }),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        let data = res.data[0];

        // If mode is not 'advance', skip fetching media
        if (mode !== "advance") {
          resolve(data);
        } else {
          resolve(data);
        }
      })
      .catch((err) => reject(err));
  });
}

// Extracted rendering logic into a separate function
function buildContext(data) {
  const {
    pid,
    title,
    status,
    time,
    views,
    likes,
    description,
    liked,
    media
  } = data;

  return `
    <div id="mainInnovationDiv" class="flex mg2 mgt2">
      <div class="innovationCont mianGalLeftSide">
        <div class="innovationGal innovationChild">
          ${media.map((data) => {
    if (data.media_type == "video") {
      if(data.media_url.includes("youtube.com")){
        return `<iframe class="galChild" src="${data.media_url}" title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`
      }
      return `<video class="galChild" controls><source src="${data.media_url}" type="video/mp4"></video>`;
    }
  }).join("")}
          ${media.map((data) => {
    if (data.media_type == "image") {
      return `<img class="galChild" src="${data.media_url}" alt="">`;
    }
  }).join("")}
        </div>

        <div class="innovationTitle innovationChild flex">
          <p class="bold20">Title : ${title}</p>
          <p class="projectDate innovationChild">${timeAgo(parseInt(time))}</p>
        </div>
        <div class="workStatus innovationChild">
          <p class="bold20">Project Status : ${status}</p>
        </div>
        <div class="innovationAnalytics innovationChild">
          <div class="views analyticsChild">
            <img class="img100" src="./imgs/icons/projects/viewIcon.svg">&nbsp
            <p>${views} Views</p>
          </div>
          <div onclick="likeProject('${pid}', this)" class="project-likes analyticsChild">
            <img class="img100" src="${liked ? './imgs/icons/projects/like.svg' : './imgs/icons/projects/dislike.svg'}">&nbsp
            <p>${likes || 0} Likes</p>
          </div>
        </div>
        <div onclick="expandProjectDescription(this)" class="innovationDesc innovationChild">
          ${renderMarkdown(description?.trim())}
        </div>
        <button id="expand-desc-btn" class="expand-desc-btn" onclick="expandProjectDescription(this)">Read more</button>
      </div>

      <div onclick="" class="comments">
        <p class="comment-head">Comments
          <span id="projectTotalComment">1000</span>
        </p>
        <div class="commentInpBox flex">
          <div class="user-comment-prof-pic-box">
            <p class="user-comment-prof-pic">R</p>
          </div>
          <textarea id="comment-input" rows="1" type="text" placeholder="Write Something"></textarea>
          <button id="comment-send" class="curvy-btn" disabled>Comment</button>
        </div>
        <div id="reply-user-comments" class="reply-user-comments"></div>
        <div id="projectComments" class="projectComments"></div>
      </div>
    </div>
  `;
}


function expandProjectDescription(btn) {
  const desc = document.querySelector(".innovationDesc");
  desc.classList.toggle("expanded");
}


function likeProject(pid, element) {
  if (localData.username.includes("guest")) {
    alert("You must be logged in to like a project");
    return;
  }

  fetch(`/like-project?pid=${pid}&username=${localData.username}&email=${localData.email}`)
    .then(res => res.json())
    .then((data) => {
      // Find the <p> tag inside the clicked element
      const pTag = element.querySelector("p");
      const imgTag = element.querySelector("img");
      if (!pTag || !imgTag) return;

      // Extract current likes from the text (e.g., "15 Likes")
      let currentLikes = parseInt(pTag.innerText) || 0;

      // Update based on response
      if (data.success && data.message == "liked") {
        // Like added
        currentLikes += 1;
        imgTag.src = "./imgs/icons/projects/like.svg";
      } else {
        // Like removed
        currentLikes = Math.max(currentLikes - 1, 0);
        imgTag.src = "./imgs/icons/projects/dislike.svg";
      }

      // Update the text inside <p>
      pTag.innerText = `${currentLikes} Likes`;
    });
}




// hover effect of image 
function createHoverEffect() {
  const imgs = document.querySelectorAll(".innovationGal img");
  [...imgs].forEach((img) => {
    img.addEventListener("mouseover", hoverEffect);
  })
}


function hoverEffect(event) {
  const target = event.target;

  const newImg = document.createElement("img");
  newImg.classList.add("hovered-image");
  newImg.setAttribute("src", target.src);

  // set positon
  const targetRect = target.getBoundingClientRect();
  newImg.style.width = targetRect.width + "px";

  newImg.style.height = targetRect.height + "px";

  const scrollPos = -document.getElementById("psuedo-body").getBoundingClientRect().y;

  newImg.style.top = scrollPos + targetRect.top + "px";
  newImg.style.left = targetRect.left + "px";

  // old hovered images
  const oldHovered = document.querySelectorAll(".hovered-image");
  oldHovered.forEach((old) => {
    setTimeout(() => {
      document.body.removeChild(old);
      // newImg.style.height = "auto";
    }, 10);
  })

  document.body.appendChild(newImg);

  const autoHeight = getAutoHeight(target) - 4;

  newImg.style.top = -document.getElementById("psuedo-body").getBoundingClientRect().y + targetRect.top - ((autoHeight - targetRect.height) / 2) + "px";

  // // Animate to full height
  requestAnimationFrame(() => {
    newImg.style.height = Math.ceil(autoHeight) + "px";
  });


  // remove child mouse out
  newImg.addEventListener("mouseout", () => {
    newImg.style.height = targetRect.height + "px";
    newImg.style.top = scrollPos + targetRect.top + "px";

    newImg.addEventListener("transitionend", () => {
      if (newImg.parentNode) newImg.parentNode.removeChild(newImg);
    }, { once: true }); // fires only once
  }, { once: true }); // ensures this mouseout listener fires only once
}


function getAutoHeight(element) {
  // Create a hidden clone
  const clone = element.cloneNode(true);

  clone.style.position = "absolute"; // remove from layout
  clone.style.visibility = "hidden";  // invisible
  clone.style.height = "auto";        // get natural auto height
  clone.style.width = element.offsetWidth + "px"; // keep same width
  clone.style.top = "0";
  clone.style.left = "0";

  document.body.appendChild(clone); // append temporarily

  const autoHeight = clone.offsetHeight; // measure

  document.body.removeChild(clone); // clean up

  return autoHeight;
}






function renderMarkdown(mdText) {
  let html = mdText;

  // remove short desc
  html = html.replace(/~\s*([\s\S]*?)\s*~/, "")

  // Headings
  html = html.replace(/^# (.*)$/gm, '<span style="font-size:28px; font-weight:bold; display:block;">$1</span>');
  html = html.replace(/^## (.*)$/gm, '<span style="font-size:22px; font-weight:bold; display:block;">$1</span>');
  html = html.replace(/^### (.*)$/gm, '<span style="font-size:20px; font-weight:bold; display:block;">$1</span>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight:bold;">$1</span>');

  // Italics
  html = html.replace(/\*(.*?)\*/g, '<span style="font-style:italic;">$1</span>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<span style="font-family:monospace; background:#f5f5f5; padding:2px 4px; border-radius:3px;">$1</span>');

  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#0366d6;">$1</a>');

  // Unordered lists
  html = html.replace(/^\-\s+(.*)$/gm, '<div style="margin-left:20px;">• $1</div>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<div style="margin-left:20px;">$&</div>');

  // Line breaks
  html = html.replace(/\n---\n/g, '<div style="width: calc(100% - 2rem); height: 2px ; background-color: rgb(100,100,100); margin: 1rem"></div>');

  // Wrap entire content in monospace
  html = `<div style="font-family:monospace; white-space:pre-line;">${html}</div>`;

  return html;
}