const categoryData = [
    {
        icon: "./imgs/icons/skills/software.svg",
        title: "FRONTEND",
        subtitle: "WEB MAGIC",
        description: "Craft beautiful, interactive user experiences.",
        skills: [
            { title: "HTML", icon: "./imgs/icons/skills/html.svg", description: "Structure your web content." },
            { title: "CSS", icon: "./imgs/icons/skills/css.svg", description: "Style and beautify your website." },
            { title: "JavaScript", icon: "./imgs/icons/skills/js.svg", description: "Add interactivity to your pages." },
            { title: "React", icon: "./imgs/icons/skills/react.svg", description: "Build modern UI components with ease." }
        ]
    },
    {
        icon: "./imgs/icons/skills/backend.svg",
        title: "BACKEND",
        subtitle: "SERVER POWER",
        description: "Handle logic, databases, and APIs behind the scenes.",
        skills: [
            { title: "Node.js", icon: "./imgs/icons/skills/nodejs.svg", description: "JavaScript runtime for server-side logic." },
            { title: "Django", icon: "./imgs/icons/skills/dj.svg", description: "Python framework for rapid backend development." },
            { title: "Spring Boot", icon: "./imgs/icons/skills/spring.svg", description: "Powerful Java framework for microservices." }
        ]
    },
    {
        icon: "./imgs/icons/skills/programming.svg",
        title: "PROGRAMMING",
        subtitle: "CODE WIZARD",
        description: "Master languages to build anything.",
        skills: [
            { title: "Python", icon: "./imgs/icons/skills/Python.svg", description: "Readable, versatile scripting language." },
            { title: "C", icon: "./imgs/icons/skills/c.svg", description: "Low-level programming with high performance." },
            { title: "C++", icon: "./imgs/icons/skills/cpp.svg", description: "Object-oriented extension of C." },
            { title: "Java", icon: "./imgs/icons/skills/java.svg", description: "Platform-independent, robust programming." }
        ]
    },
    {
        icon: "./imgs/icons/skills/databse.svg",
        title: "DATABASE",
        subtitle: "DATA HUB",
        description: "Store, retrieve, and manage information efficiently.",
        skills: [
            { title: "MySQL", icon: "./imgs/icons/mysql.svg", description: "Relational database with SQL support." },
            { title: "MongoDB", icon: "./imgs/icons/skills/Mongodb.svg", description: "NoSQL database for flexible document storage." },
            { title: "PostgreSQL", icon: "./imgs/icons/skills/postgresql.svg", description: "Advanced, open-source relational database." },
            { title: "DynamoDB", icon: "./imgs/icons/skills/dynamodb.svg", description: "Scalable, serverless NoSQL database by AWS." }
        ]
    },
    {
        icon: "./imgs/icons/skills/uiux.svg",
        title: "UI/GRAPHICS",
        subtitle: "VISUAL THINKER",
        description: "Design engaging and user-friendly interfaces.",
        skills: [
            { title: "Figma", icon: "./imgs/icons/skills/figma.svg", description: "Collaborative interface design tool." },
            { title: "Canva", icon: "./imgs/icons/skills/canva.svg", description: "Quick design tool for social media and more." },
            { title: "Photoshop", icon: "./imgs/icons/skills/photoshop.svg", description: "Industry standard for image editing." }
        ]
    },
    {
        icon: "./imgs/icons/skills/tools.svg",
        title: "TOOLS",
        subtitle: "DEV ESSENTIALS",
        description: "Boost your development workflow with essential tools.",
        skills: [
            { title: "GitHub", icon: "./imgs/icons/skills/github.svg", description: "Host and collaborate on code." },
            { title: "Git", icon: "./imgs/icons/skills/git.svg", description: "Version control to track code changes." },
            { title: "VS Code", icon: "./imgs/icons/skills/vscode.svg", description: "Powerful, lightweight code editor." }
        ]
    }
];


const skillsContainer = document.getElementById("skillsCont");

// Inject cards dynamically
categoryData.forEach((cat) => {
    const card = document.createElement("div");
    card.classList.add("container", "skill-categories");

    card.innerHTML = `
      <div class="icon"><img class="img100" src="${cat.icon}"/></div>
      <h2>${cat.title}</h2>
      <p>${cat.description}</p>
    `;

    skillsContainer.appendChild(card);
});

// Card Click Logic (same as your original)
const categories = [...document.querySelectorAll(".skill-categories")];
let originalHeight = 0;

let activeCat = null;
let isMobile = document.body.clientWidth <= 720;
let isMobileSm = document.body.clientWidth <= 450;
let resizing = false;

window.addEventListener("resize", () => {
    if (activeCat) {
        resizing = true;
        const skills = categoryData[categories.indexOf(activeCat)].skills;

        isMobile ? createSkillElementsMobile(skillsContainer, activeCat, skills) : createSkillElements(skillsContainer, activeCat, skills);


        // remove the added ui of skills
        const skill_lines = [...document.getElementsByClassName("branch-line")];
        const skill_wrapper = [...document.getElementsByClassName("skill-wrapper")];
        skill_lines.forEach((line) => {
            line.remove();
            skill_wrapper[skill_lines.indexOf(line)]?.remove();
        })
        skillsContainer.style.height = `${originalHeight}px`;

        setTimeout(() => {
            resizing = false;
        }, 2000);
    }

    isMobile = document.body.clientWidth <= 720;
    isMobileSm = document.body.clientWidth <= 450;
})

categories.forEach((category) => {
    category.addEventListener("click", async (event) => {
        const currentEl = event.currentTarget;
        const isActive = currentEl.classList.contains("active");
        const skills = categoryData[categories.indexOf(category)].skills;

        // blur rest of categories
        categories.forEach((cat) => {
            cat.classList.remove("active", "blurred");
            cat.style.transform = "translate(0, 0)";
            if (isActive) return;

            if (cat !== currentEl) {
                cat.classList.add("blurred");
            } else {
                currentEl.classList.add("active");
            }
        });

        if (!isActive) {
            originalHeight = skillsContainer.clientHeight;
            isMobile ? createSkillElementsMobile(skillsContainer, currentEl, skills) : createSkillElements(skillsContainer, currentEl, skills);

            activeCat = currentEl;
        } else {
            activeCat = null;
            // remove the added ui of skills
            const skill_lines = [...document.getElementsByClassName("branch-line")];
            const skill_wrapper = [...document.getElementsByClassName("skill-wrapper")];
            skill_lines.forEach((line) => {
                line.remove();
                skill_wrapper[skill_lines.indexOf(line)]?.remove();
            })
            skillsContainer.style.height = `${originalHeight}px`;
            return;
        }
    });
});




function createSkillElements(container, currentEl, skills, maxww = 0, maxhh = 0) {
    const baseAngle = 180 / skills.length;
    let containerRect = container.getBoundingClientRect();

    let maxw = 0;
    let maxh = 0;
    let firstT;

    let updatedLeft = maxww != 0 ? (containerRect.width - maxww) / 2 : 0;
    // console.log("cont", containerRect.width, maxww, updatedLeft)

    skills.forEach((skill, index) => {
        // prepare lines
        const skillIndex = skills.indexOf(skill);
        let angle = baseAngle * skillIndex + baseAngle / 2;
        const h = (currentEl.clientWidth / 2) * 0.9;
        const y = h * Math.cos(angle * Math.PI / 180);
        const x = h * Math.sin(angle * Math.PI / 180);

        angle = -angle;

        const line1 = document.createElement("div");
        line1.classList.add("branch-line");
        line1.classList.add("tail-line");
        line1.style.left = updatedLeft + currentEl.clientWidth / 2 * 0.9 + x + "px";
        line1.style.top = container.clientHeight / 2 - y + "px";

        const transformAngle = angle <= -90 ? (angle == -90 ? 0 : 45) : - 45;
        line1.style.transform = `rotate(${transformAngle}deg)`;

        const baseLength = 50;
        const angleDiff = Math.abs(angle + 90); // 0 to 90

        // Exponential scale (steeper than quadratic)
        const scale = Math.exp(angleDiff / 29.6) - 1;
        const length = baseLength + scale * 10;

        line1.style.width = length + "px";
        container.appendChild(line1);




        // line2 head
        const line1Rect = line1.getBoundingClientRect();
        // head line or bent line
        const line2 = document.createElement("div");

        if (angle != -90) {
            line2.classList.add("branch-line");
            line2.classList.add("end-line");
            line2.style.left = line1Rect.right - containerRect.left - 3 + "px";

            if (angle < -90) {
                line2.style.top = line1Rect.bottom - containerRect.top - 4 + "px";
            } else {
                line2.style.top = line1Rect.top - containerRect.top + "px";
            }
            container.appendChild(line2);
        } else {
            line1.classList.add("center-line");
        }




        // prepare skill divs
        const line2Rect = line2.getBoundingClientRect();
        let sx = angle == -90 ? line1Rect.right : line2Rect.right;
        let sy = angle == -90 ? line1Rect.top : line2Rect.top;

        const wrapper = document.createElement("div");
        wrapper.className = "skill-wrapper";

        wrapper.innerHTML = `
            <div class="skill-icon">
                <img class="icon" src="${skill.icon}"/>
            </div>
            <div class="info-box">
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
            </div>
        `;

        // Temporarily attach to DOM to measure size
        wrapper.style.position = 'absolute';
        container.appendChild(wrapper);

        const wrapperRect = wrapper.getBoundingClientRect();
        const l = sx - container.getBoundingClientRect().left + 20;
        const t = sy - container.getBoundingClientRect().top - wrapperRect.height / 2;
        wrapper.style.left = `${l}px`;
        wrapper.style.top = `${t}px`;

        if (index == 0) {
            firstT = t;
        }
        // calculate the max width and height
        maxw = Math.max(maxw, l + wrapperRect.width - currentEl.clientWidth / 2) + 30;
        maxh = t + wrapperRect.height - firstT;


        // remove the ui 
        if (!maxww || !maxhh) {
            try {
                container.removeChild(line1);
                container.removeChild(wrapper);
                container.removeChild(line2);
            } catch (err) {
                console.log(err)
            }
        }
    });

    // console.log(maxw, maxh)
    if (!maxhh || !maxww) {
        container.style.height = maxh + 80 + "px";

        setTimeout(() => {
            let currentRect = currentEl.getBoundingClientRect();
            containerRect = container.getBoundingClientRect();
            const containerGap = parseInt(window.getComputedStyle(container).gap.replace("normal", "").replace("px", ""));

            console.log(containerGap)

            const yOffset =
                containerRect.height / 2 -
                (currentRect.top - containerRect.top) -
                currentEl.offsetHeight / 2;

            let offset = 20;
            if(containerRect.width > 800) offset = 60;
            if(containerRect.width > 1000) offset = 120;

            const xOffset = (containerRect.width - maxw) / 2 - currentRect.left +  containerGap - offset;

            currentEl.style.transform = `translate(${xOffset}px,${yOffset}px)`;
            createSkillElements(container, currentEl, skills, maxw, maxh);
        }, 350);
    }
}











function createSkillElementsMobile(container, currentEl, skills, maxww = 0, maxhh = 0) {
    const baseAngle = 180 / skills.length;
    let containerRect = container.getBoundingClientRect();

    let maxw = 0;
    let maxh = 0;
    let firstT;

    // const isMobile = document.body.clientWidth <= 720;

    let updatedLeft = maxww != 0 ? (containerRect.width - maxww) / 2 : 0;
    // console.log("cont", containerRect.width, maxww, updatedLeft)

    skills.forEach((skill, index) => {
        // prepare lines
        const skillIndex = skills.indexOf(skill);
        let angle = baseAngle * skillIndex + baseAngle / 2;
        angle = angle + 90;
        const h = (currentEl.clientWidth / 2) * 0.7;
        const y = h * Math.cos(angle * Math.PI / 180);
        const x = h * Math.sin(angle * Math.PI / 180);

        const line1 = document.createElement("div");
        line1.classList.add("branch-line");
        line1.classList.add("tail-line");
        line1.style.left = containerRect.width / 2 + x + "px";
        line1.style.top = currentEl.clientHeight - y + "px";

        // console.log(angle)
        const transformAngle = angle <= 180 ? (angle == 180 ? 90 : (isMobileSm ? 60 : 30)) : (isMobileSm ? 120 : 150);
        line1.style.transform = `rotate(${transformAngle}deg)`;

        const baseLength = 0;
        let angleDiff = Math.abs(angle); // 0 to 90
        angleDiff = 270 - (angleDiff > 180 ? 360 - angleDiff : angleDiff)

        // Exponential scale (steeper than quadratic)
        const scale = Math.exp(angleDiff / 33) - 1;
        const length = baseLength + scale * 1;

        line1.style.width = length + "px";
        container.appendChild(line1);




        // line2 head
        const line1Rect = line1.getBoundingClientRect();
        // head line or bent line
        const line2 = document.createElement("div");

        if (angle != 90) {
            line2.classList.add("branch-line");
            line2.classList.add("end-line");

            if (angle > 180) {
                line2.style.left = line1Rect.left - containerRect.left + "px";
            } else {
                line2.style.left = line1Rect.right - containerRect.left - 4 + "px";
            }
            line2.style.top = line1Rect.bottom - containerRect.top - 2 + "px";

            container.appendChild(line2);
        } else {
            line1.classList.add("center-line");
        }




        // prepare skill divs
        const line2Rect = line2.getBoundingClientRect();
        let sx = angle == -90 ? line1Rect.right : line2Rect.right;
        let sy = angle == -90 ? line1Rect.top : line2Rect.top;

        const wrapper = document.createElement("div");
        wrapper.className = "skill-wrapper";

        wrapper.innerHTML = `
            <div class="skill-icon">
                <img class="icon" src="${skill.icon}"/>
            </div>
            <div class="info-box">
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
            </div>
        `;

        // Temporarily attach to DOM to measure size
        wrapper.style.position = 'absolute';
        container.appendChild(wrapper);

        const wrapperRect = wrapper.getBoundingClientRect();
        const l = sx - container.getBoundingClientRect().left - wrapperRect.width / 2;
        const t = sy - container.getBoundingClientRect().top + (isMobileSm ? 10 : 20) + wrapperRect.width;
        wrapper.style.left = `${l}px`;
        wrapper.style.top = `${t}px`;

        if (index == 0) {
            firstT = t;
        }
        // calculate the max width and height
        maxw = Math.max(maxw, l + wrapperRect.width - currentEl.clientWidth / 2) + 30;
        maxh = wrapperRect.height + t;


        // remove the ui 
        if (!maxww || !maxhh) {
            try {
                container.removeChild(line1);
                container.removeChild(wrapper);
                container.removeChild(line2);
            } catch (err) {
                console.log(err)
            }
        }
    });

    // console.log(maxw, maxh)
    if (!maxhh || !maxww) {
        container.style.height = maxh + 0 + "px";

        setTimeout(() => {
            let currentRect = currentEl.getBoundingClientRect();
            containerRect = container.getBoundingClientRect();

            const yOffset =
                containerRect.y - currentRect.top;

            const xOffset = containerRect.width / 2 - currentRect.left - currentRect.width / 2 + containerRect.left;

            currentEl.style.transform = `translate(${xOffset}px,${yOffset}px)`;

            if (!resizing) {
                currentEl.parentElement.parentElement.scrollIntoView({
                    behavior: "smooth"
                });
            }

            createSkillElementsMobile(container, currentEl, skills, maxw, maxh);
        }, 350);
    }
}


