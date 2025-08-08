const categoryData = [
    {
        icon: "./imgs/icons/skills/software.svg",
        title: "FRONTEND",
        subtitle: "WEB MAGIC",
        description: "Craft beautiful, interactive user experiences.",
        skills: [
            { title: "HTML", icon: "📄", description: "Structure your web content." },
            { title: "CSS", icon: "🎨", description: "Style and beautify your website." },
            { title: "JavaScript", icon: "⚡", description: "Add interactivity to your pages." },
            { title: "React", icon: "⚛️", description: "Build modern UI components with ease." }
        ]
    },
    {
        icon: "./imgs/icons/skills/backend.svg",
        title: "BACKEND",
        subtitle: "SERVER POWER",
        description: "Handle logic, databases, and APIs behind the scenes.",
        skills: [
            { title: "Node.js", icon: "🌲", description: "JavaScript runtime for server-side logic." },
            { title: "Django", icon: "🐍", description: "Python framework for rapid backend development." },
            { title: "Spring Boot", icon: "🌱", description: "Powerful Java framework for microservices." }
        ]
    },
    {
        icon: "./imgs/icons/skills/programming.svg",
        title: "PROGRAMMING",
        subtitle: "CODE WIZARD",
        description: "Master languages to build anything.",
        skills: [
            { title: "Python", icon: "🐍", description: "Readable, versatile scripting language." },
            { title: "C", icon: "🔧", description: "Low-level programming with high performance." },
            { title: "C++", icon: "🚀", description: "Object-oriented extension of C." },
            { title: "Java", icon: "☕", description: "Platform-independent, robust programming." }
        ]
    },
    {
        icon: "./imgs/icons/skills/databse.svg",
        title: "DATABASE",
        subtitle: "DATA HUB",
        description: "Store, retrieve, and manage information efficiently.",
        skills: [
            { title: "MySQL", icon: "🧮", description: "Relational database with SQL support." },
            { title: "MongoDB", icon: "🍃", description: "NoSQL database for flexible document storage." },
            { title: "PostgreSQL", icon: "🐘", description: "Advanced, open-source relational database." },
            { title: "DynamoDB", icon: "⚡", description: "Scalable, serverless NoSQL database by AWS." }
        ]
    },
    {
        icon: "./imgs/icons/skills/uiux.svg",
        title: "UI/GRAPHICS",
        subtitle: "VISUAL THINKER",
        description: "Design engaging and user-friendly interfaces.",
        skills: [
            { title: "Figma", icon: "🖌️", description: "Collaborative interface design tool." },
            { title: "Canva", icon: "🧰", description: "Quick design tool for social media and more." },
            { title: "Photoshop", icon: "📷", description: "Industry standard for image editing." }
        ]
    },
    {
        icon: "./imgs/icons/skills/tools.svg",
        title: "TOOLS",
        subtitle: "DEV ESSENTIALS",
        description: "Boost your development workflow with essential tools.",
        skills: [
            { title: "GitHub", icon: "🐙", description: "Host and collaborate on code." },
            { title: "Git", icon: "🔄", description: "Version control to track code changes." },
            { title: "VS Code", icon: "🧠", description: "Powerful, lightweight code editor." }
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
const parent = document.getElementById("skillsCont");
let originalHeight = parent.clientHeight;
let isAspectSet = false;
const firstEltRect = categories[0].getBoundingClientRect();

categories.forEach((category) => {
    category.addEventListener("click", async (event) => {
        const currentEl = event.currentTarget;
        const isActive = currentEl.classList.contains("active");

        categories.forEach((cat) => {
            cat.classList.remove("active", "blurred");
            cat.style.transform = "translate(0, 0)";
        });

        if (isActive) {
            parent.style.height = originalHeight + "px";
            isAspectSet = false;

            // remove the added ui of skills
            const skill_lines = [...document.getElementsByClassName("branch-line")];
            const skill_wrapper = [...document.getElementsByClassName("skill-wrapper")];
            skill_lines.forEach((line) => {
                line.remove();
                skill_wrapper[skill_lines.indexOf(line)]?.remove();
            })
            return;
        }

        currentEl.classList.add("active");

        if (!isAspectSet) {
            originalHeight = parent.clientHeight;
            // parent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            isAspectSet = true;
        }

        // blur rest of categories
        categories.forEach((cat) => {
            if (cat !== currentEl) {
                cat.classList.add("blurred");
            }
        });

        //handle skills 
        setTimeout(() => {
            drawSkills(currentEl);

            // After drawing, resize container to fit everything
            setTimeout(() => {
                const wrappers = [...document.getElementsByClassName("skill-wrapper")];
                let maxBottom = 0;
                wrappers.forEach((el) => {
                    const bottom = el.getBoundingClientRect().bottom;
                    maxBottom = Math.max(maxBottom, bottom);
                });

                const containerTop = parent.getBoundingClientRect().top;
                const neededHeight = maxBottom - containerTop + 50; // +50 for padding
                parent.style.height = neededHeight + "px";
            }, 10); // allow DOM to update
        }, 400);
    });
});

function drawSkills(currentEl) {
    const parentRect = parent.getBoundingClientRect();
    const currentRect = currentEl.getBoundingClientRect();
    // transform the category to center while removing other categories
    const xOffset =
        -(currentRect.left - parentRect.left) +
        firstEltRect.left -
        parentRect.left;
        
    const yOffset =
        parentRect.height / 2 -
        (currentRect.top - parentRect.top) -
        currentEl.offsetHeight / 2;

    currentEl.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(0.9)`;

    const center = {
        x: firstEltRect.left - parentRect.left + (firstEltRect.width / 2) * 0.9,
        y: parentRect.height / 2,
        width: currentRect.width,
        height: currentRect.height
    };

    const skills = categoryData[categories.indexOf(currentEl)].skills;
    const baseAngle = 180 / skills.length;

    //inserting branches to connect skiils to skill category cont
    skills.forEach((skill) => {
        const skillIndex = skills.indexOf(skill);

        let angle = baseAngle * skillIndex + baseAngle / 2;
        const h = (firstEltRect.width / 2);
        const y = h * Math.cos(angle * Math.PI / 180);
        const x = h * Math.sin(angle * Math.PI / 180);

        // console.log(h, -angle, x, y)
        insertBentLineDivs(parent, center.x + x, center.y - y, -angle,skill);
    })
}


function insertBentLineDivs(container, x, y, angle, skill) {
    const containerRect = container.getBoundingClientRect();
    // tail line
    const line1 = document.createElement("div");
    line1.classList.add("branch-line");
    line1.classList.add("tail-line");
    line1.style.left = x + "px";
    line1.style.top = y + "px";
    const transformAngle = angle <= -90 ? (angle == -90 ? 0 : 45) : - 45;
    line1.style.transform = `rotate(${transformAngle}deg)`;

    const baseLength = 30;
    const angleDiff = Math.abs(angle + 90); // 0 to 90

    // Exponential scale (steeper than quadratic)
    //tail line
    const scale = Math.exp(angleDiff / 29) - 1;
    const length = baseLength + scale * 10;

    line1.style.width = length + "px";
    container.appendChild(line1);

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
            line2.style.top = line1Rect.top - containerRect.top - 2 + "px";
        }
        container.appendChild(line2);
    } else {
        line1.classList.add("center-line");
    }


    // place skills 
    const line2Rect = line2.getBoundingClientRect();
    let sx = angle == -90 ? line1Rect.right : line2Rect.right;
    let sy = angle == -90 ? line1Rect.top : line2Rect.top;

    createSkillBox(parent, sx, sy, skill.title, skill.description, skill.icon);
}

function createSkillBox(container, x, y, title, description, icon) {
    const wrapper = document.createElement("div");
    wrapper.className = "skill-wrapper";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "skill-icon";

    const iconEl = document.createElement("div");
    iconEl.className = "icon";
    iconEl.textContent = icon || "✨";

    const infoBox = document.createElement("div");
    infoBox.className = "info-box";

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;

    const descEl = document.createElement("p");
    descEl.textContent = description;

    // Assemble
    iconWrapper.appendChild(iconEl);
    infoBox.appendChild(titleEl);
    infoBox.appendChild(descEl);
    wrapper.appendChild(iconWrapper);
    wrapper.appendChild(infoBox);

    container.appendChild(wrapper);

    const wrapperRect = wrapper.getBoundingClientRect();
    wrapper.style.left = `${x - container.getBoundingClientRect().left + 20}px`;
    wrapper.style.top = `${y - container.getBoundingClientRect().top - wrapperRect.height/2}px`;
}
