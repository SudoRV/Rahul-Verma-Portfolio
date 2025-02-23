
function timeAgo(date) {
  old = new Date(date);
  crnt = new Date();

  agoStamp = (crnt - old) / 1000;
  ret_data = "";

  if (agoStamp <= 2) {
    ret_data = `Just Now`;
  } else if (agoStamp <= 60) {
    ret_data = `${Math.floor(agoStamp)} sec ago`;
  } else if ((agoStamp >= 60) & (agoStamp <= 3600)) {
    ret_data = `${Math.floor(agoStamp / 60)}  min ago`;
  } else if ((agoStamp >= 3600) & (agoStamp <= 3600 * 24)) {
    ret_data = `${Math.floor(agoStamp / 3600)} hours ago`;
  } else if ((agoStamp >= 3600 * 24) & (agoStamp <= 3600 * 24 * 30)) {
    ret_data = `${Math.floor(agoStamp / (3600 * 24))} days ago`;
  } else if ((agoStamp >= 3600 * 24 * 30) & (agoStamp <= 3600 * 24 * 365)) {
    ret_data = `${Math.floor(agoStamp / (3600 * 24 * 30))} months ago`;
  } else if (agoStamp >= 3600 * 24 * 30 * 12) {
    ret_data = `${Math.floor(agoStamp / (3600 * 24 * 30 * 12))} years ago`;
  }
  return ret_data;
}

// all functions

// checkbox
function check(cls, newcls) {
  cchecks = document.getElementsByClassName(cls);
  for (box of cchecks) {
    box.addEventListener("change", (event) => {
      t = event.currentTarget;
      if (t.checked) {
        t.classList.add(newcls);
      } else {
        t.classList.remove(newcls);
      }
    });
  }
}

check("checkbox", "checked");

//menu button
menuBtn = document.getElementById("menuBtn");
menu = document.getElementById("menu");
nav = document.getElementsByTagName("nav")[0];
document.head.innerHTML += `<style>
:root{
    --topVal:${menu.clientHeight}px;
    --navH:${nav.clientHeight}px;
</style>`;

menu.style.cssText = "display:none;";

menuBtn.addEventListener("click", () => {
  if (window.getComputedStyle(menu).display == "none") {
    menu.classList.remove("menuUp");
    menu.classList.add("menuDown");

    nav.classList.remove("navUp");
    nav.classList.add("navDown");
  } else {
    menu.classList.add("menuUp");
    nav.classList.add("navUp");
    setTimeout(() => {
      menu.classList.remove("menuDown");
      nav.classList.remove("navDown");
      nav.classList.remove("navUp");
      menu.style.display = "none";
    }, 300);
  }
});

function redirectScroll(id) {
  window.localStorage.setItem("scrollId", id);
  window.location.href = "/";
}

// detect scrollup
// prev = 0
// nav = document.getElementsByTagName("nav")[0]

// window.addEventListener("scroll", () => {
//     crnt =  window.scrollY;
//     navTop = parseInt(window.getComputedStyle(nav).top.replace("px"))
//     navH = nav.clientHeight;

//     if(crnt>prev){
//         if (crnt >= navH){
//             nav.style.position="sticky";
//             nav.style.cssText = `
//                 top:${-navH}px;
//             `
//         }
//     }
//     else if(crnt<prev) {

//         if (navTop<=0){
//             nav.style.cssText = `
//                 top:${navTop+crnt}px;
//             `
//         }
//     }

//     prev=crnt;
// })

document.body.addEventListener("touchstart", () => {});
document.body.addEventListener("touchend", () => {
  navTop = parseInt(window.getComputedStyle(nav).top.replace("px"));

  if (navTop <= -nav.clientHeight / 2) {
    //nav.style.top="0px";
  } else {
    //nav.style.background="0px";
  }
});

// set PID on click on comment field
function setPid(field) {
  projectId = field.id;
  window.history.pushState(
    "null",
    "null",
    `${window.location.pathname}?pid=${projectId}`
  );
}

//open description in full mode 
function openFull(elt) {
  if(elt.getAttribute("height")=="initial" || elt.getAttribute("height") == null){
    elt.style.height = "auto";
    elt.setAttribute("height","full");
  }else{
    elt.style.height = "100px";
    elt.setAttribute("height","initial");
  }
}


//submit form 

function submitForm(form){
  formElement = form.currentTarget;
  submitBtn = formElement.querySelector("input[type=submit]")
  submitBtn.disabled = true;
  form.preventDefault()
  const { method, action } =  formElement.attributes; 

  var formData =  new FormData(event.target);
  formData = Object.fromEntries(formData.entries())
  
  fetch(action.value,{
    method:method.value,
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(formData)
  })
  .then(res=>res.json())
  .then((res)=>{
    formElement.reset()
    submitBtn.disabled = false;
    alert(res.msg)
  })
}



// innovation section
async function setData() {
  if (window.location.href.toString().includes("pid")) {
    await sleep(400);
  }

  fetch("/innovation/get/projectData", {
    method: "get",
    headers: {
      body: JSON.stringify({
        query:
          "select * from projects",
      }),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const innovationProjectsCont =
        document.getElementById("innovationProjectsCont");

      res.data.forEach((data) => {
        const { pid, thumbnail, title, status, views, time, description } = data;
        const mainDiv = document.createElement("div");
        mainDiv.id = pid;
        
        if(window.location.href.toString().includes('/innovation')){
          mainDiv.setAttribute(
            "onclick",
            "openInnovationDisplay(this);setPid(this);"
          );
        }
        else{
          mainDiv.setAttribute(
            "onclick",
            `window.location.href='/innovation?pid=${pid}'`
          );
        }
        mainDiv.classList = "innovationContChilds mgt2";

        mainDiv.innerHTML = `
              <div class="innovationGalAll innovationChild">
                  <img class="galChild"
                      src="${thumbnail}">
              </div>

              <div class="innovationTitle innovationChild">
                  <p class="bold">Title : ${title}</p>
              </div>
              <div class="workStatus innovationChild">
                  <p>Project Status : ${status}</p>
              </div>

              <div class="innovationChild mg2">
                  <p>${description.trim().slice(0,100)}</p>
              </div>

              <div
                  class="analyticsChild analyticsChildAll innovationChild force-flex">
                  <p class="bold">${views} views</p> 
                  <p class="projectDate bold">${timeAgo(parseInt(time))}</p>
              </div>
              `;
        innovationProjectsCont.appendChild(mainDiv);
      });
    });
}

async function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}


// preserve scroll at reload

document.addEventListener("DOMContentLoaded", function () {
  preserveScrollPosition("psuedo-body");
});

function preserveScrollPosition(elementId) {
  const scrollableElement = document.getElementById(elementId);

  // Restore scroll position from localStorage
  const savedScrollPosition = localStorage.getItem(`${elementId}-scrollPosition`);
  if (savedScrollPosition) {
      setTimeout(() => {
        scrollableElement.scrollTop = savedScrollPosition;
      }, 100);
  }

  // Save scroll position when scrolling
  scrollableElement.addEventListener("scroll", function () {
      localStorage.setItem(`${elementId}-scrollPosition`, scrollableElement.scrollTop);
  });
}

