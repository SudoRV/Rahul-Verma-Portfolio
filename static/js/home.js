// readmore content for about section

readmore = document.getElementsByClassName("readmore")[0]

rmt = `

Beyond my technical pursuits, I have a deep passion for music and singing. 🎵 I find solace and inspiration in melodies and love to express myself through music. In my free time, you might catch me humming along to my favorite tunes. 🎶 I also have a curious mind and enjoy expanding my knowledge by diving into various subjects, including the cosmos and scientific wonders. 🚀📚
        
I have a strong aversion to restrictions and constraints, always seeking to expand my knowledge and skill set. I love pushing the boundaries of what I can accomplish, continuously learning and improving my computational thinking skills. When I take on a project, I give it my all, striving to deliver exceptional results. 💪

Thank you for taking the time to visit my portfolio. I'm excited to connect with like-minded individuals, potential collaborators, and employers who share a passion for technology and innovation. If you have any inquiries or would like to discuss potential projects or collaborations, please feel free to reach out. Let's embark on an exciting journey together! ✨`

// readmore.addEventListener("click", async (e) => {
//     if (readmore.innerText == "Read More") {
//         readmorePn = document.getElementById("aboutText")
//         readmorePnt = readmorePn.innerHTML

//         await sleepFor(0, rmt.length, `
//             readmorePnt+= rmt[i]
//             readmorePn.innerHTML = readmorePnt
//         `)
//         readmore.innerText = "Read Less"
//     }
//     else {
//         aboutText.innerText = `Hey there! I'm Rahul Verma, a passionate individual currently pursuing my B.Tech in Computer Science and Engineering at Dr. APJ Abdul Kalam Institute of Technology. My educational journey started at Kendriya Vidyalaya No.2 NHPC Banbasa, where I completed my schooling. 🎓

//         I consider myself a versatile developer with expertise in various areas. My skills span across full-stack web development, utilizing HTML, CSS, JavaScript, Node.js, and working with databases such as SQLite, MongoDB, and MySQL. I also have a strong foundation in Python, which I employ for software development. Additionally, I possess intermediate knowledge in the C programming language. 💻

//         One of my areas of interest lies in the field of Artificial Intelligence and Machine Learning, where I leverage my Python skills to develop AI/ML applications. I enjoy exploring the potential of these technologies and applying them to solve real-world problems.🤖`
//         readmore.innerText = "Read More"
//     }
// })

// render child skills on hover  parent 
skillItemMain = document.getElementsByClassName("skillItemMain")
skillItemChildMain = document.getElementsByClassName("skillItem-child-main")
skillItemChild = document.getElementsByClassName("skillItem-child")

arr = Array.from(skillItemMain)
arr2 = Array.from(skillItemChildMain)
arr3 = Array.from(skillItemChild)

for (let i = 0; i < skillItemMain.length; i++) {
    item = skillItemMain[i]
    item.addEventListener("click", (event) => {
        index = arr.indexOf(event.currentTarget)

        if (window.getComputedStyle(arr2[index]).getPropertyValue("display") == "none") {
            arr2[index].classList.remove("skills-display-none")
            arr2[index].classList.add("skills-display-flex")

            arr2[index].classList.remove("skillItem-child-main-heightn")
            arr2[index].classList.add("skillItem-child-main-heightp")
        }
        else {
            arr2[index].classList.remove("skills-display-flex")

            arr2[index].classList.remove("skillItem-child-main-heightp")
            arr2[index].classList.add("skillItem-child-main-heightn")

            setTimeout(() => {
                arr2[index].classList.add("skills-display-none")
            }, 500);
        }

        crntSkillVisible = arr2[index]
        lastSkillVisible = document.getElementsByClassName("skills-display-flex")[0]

        if (crntSkillVisible != lastSkillVisible) {
            // alert()
            // lastSkillVisible.style.cssText="display:none !important";
        }
    })
}

// load page on a click
// scroll to the page onclick
async function getPage(id) {
  const page = document.getElementById(id)
  sudo_body = document.getElementById("psuedo-body");
  y = page.getBoundingClientRect().top + sudo_body.scrollTop - ((window.innerHeight * 12) / 100)
  sudo_body.scrollTo(0, y)
  window.history.pushState("", "", `#${id}`)
}

if (window.history.scrollRestoration) {
    // console.log(window.history.scrollRestoration)
    // window.history.scrollRestoration = "auto"
    // console.log(window.history.scrollRestoration)
}
//  reload on refer
if (window.localStorage.getItem("scrollId")) {
    const id = window.localStorage.getItem("scrollId");
    const elt = document.getElementById(id);
    const sudo_body = document.getElementById("psuedo-body")

    setTimeout(() => {
        const y = elt.getBoundingClientRect().top + sudo_body.scrollTop - ((window.innerHeight * 12) / 100)
        sudo_body.scrollTo(0, y);
    }, 300);
    
    window.localStorage.removeItem("scrollId");
}

async function sleepFor(time, loop, code) {
    for (i = 0; i < loop; i++) {
        eval(code)
        await sleep(time)
    }
}

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}


