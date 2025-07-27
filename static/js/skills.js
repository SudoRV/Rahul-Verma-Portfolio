const categoryData = [
    {
        icon: "🌐",
        title: "FRONTEND",
        subtitle: "WEB MAGIC",
        description: "Craft beautiful, interactive user experiences.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
    },
    {
        icon: "🛠️",
        title: "BACKEND",
        subtitle: "SERVER POWER",
        description: "Handle logic, databases, and APIs behind the scenes.",
        skills: ["Node.js", "Django", "Spring Boot"],
    },
    {
        icon: "💻",
        title: "PROGRAMMING",
        subtitle: "CODE WIZARD",
        description: "Master languages to build anything.",
        skills: ["Python", "C", "C++", "Java"],
    },
    {
        icon: "🗄️",
        title: "DATABASE",
        subtitle: "DATA HUB",
        description: "Store, retrieve, and manage information efficiently.",
        skills: ["MySQL", "MongoDB", "PostgreSQL", "DynamoDB"],
    },
    {
        icon: "🎨",
        title: "UI/GRAPHICS",
        subtitle: "VISUAL THINKER",
        description: "Design engaging and user-friendly interfaces.",
        skills: ["Figma", "Canva", "Photoshop"],
    },
    {
        icon: "📦",
        title: "TOOLS",
        subtitle: "DEV ESSENTIALS",
        description: "Boost your development workflow with essential tools.",
        skills: ["GitHub", "Git", "VS Code"],
    },
];

const skillsContainer = document.getElementById("skillsCont");

// Inject cards dynamically
categoryData.forEach((cat) => {
    const card = document.createElement("div");
    card.classList.add("container", "skill-categories");

    card.innerHTML = `
      <div class="icon">${cat.icon}</div>
      <h2>${cat.title}</h2>
      <h1>${cat.subtitle}</h1>
      <div class="divider"></div>
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
    category.addEventListener("click", (event) => {
        const currentEl = event.currentTarget;
        const isActive = currentEl.classList.contains("active");

        categories.forEach((cat) => {
            cat.classList.remove("active", "blurred");
            cat.style.transform = "translate(0, 0)";
        });

        if (isActive) {
            // parent.style.aspectRatio = "";
            parent.style.height = originalHeight + "px";
            isAspectSet = false;
            return;
        }

        currentEl.classList.add("active");

        if (!isAspectSet) {
            parent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

            originalHeight = parent.clientHeight;
            parent.style.height = (parent.getBoundingClientRect().width * 9) / 16 + "px";
            // parent.style.aspectRatio = "16/9";
            isAspectSet = true;
        }

        categories.forEach((cat) => {
            if (cat !== currentEl) {
                cat.classList.add("blurred");
            }
        });

        const parentRect = parent.getBoundingClientRect();
        const currentRect = currentEl.getBoundingClientRect();
        const xOffset =
            -(currentRect.left - parentRect.left) +
            firstEltRect.left -
            parentRect.left;
        const yOffset =
            parentRect.height / 2 -
            (currentRect.top - parentRect.top) -
            currentEl.offsetHeight / 2;

        currentEl.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(0.7)`;


        //handle skills 
        const index = categories.indexOf(currentEl);
        const center = {
            x: firstEltRect.left - parentRect.left + (firstEltRect.width / 2) * 0.7,
            y: parentRect.top + parentRect.height / 2,
            width: currentRect.width,
            height: currentRect.height
        };

        const skills = categoryData[index].skills;
        const baseAngle = 180 / skills.length;

        skills.forEach((skill) => {
            const skillIndex = skills.indexOf(skill);

            let angle = baseAngle * skillIndex + baseAngle / 2;
            const h = (firstEltRect.width / 2);
            const y = h * Math.cos(angle * Math.PI / 180);
            const x = h * Math.sin(angle * Math.PI / 180);

            // console.log(h, -angle, x, y)
            insertBentLineDivs(center, parent, center.x + x, center.y - y, -angle);
        })

    });
});


function insertBentLineDivs(center, container, x, y, angle) {
    // tail line
    const line1 = document.createElement("div");
    line1.classList.add("branch-line");
    line1.classList.add("tail-line");
    line1.style.left = x + "px";
    line1.style.top = y + "px";
    const transformAngle = angle <= -90 ? (angle == -90 ? 0 : 45) : -45;
    line1.style.transform = `rotate(${transformAngle}deg)`;

    const baseLength = 80;
    const length = (1 - Math.cos(Math.abs(angle + 90) * Math.PI / 180)) * 100 + baseLength;
    line1.style.width = length + "px";
    container.appendChild(line1);

    const line1Rect = line1.getBoundingClientRect();
    // console.log(line1Rect.right, line1Rect.top, line1Rect.width, line1Rect.height)

    // head line
    const line2 = document.createElement("div");
    // line2.style.width = length + "px";

    if (angle != -90) {
        line2.classList.add("branch-line");
        line2.classList.add("end-line");
        line2.style.left = line1Rect.right - 9 + "px";

        if (angle < -90) {
            line2.style.top = line1Rect.bottom + "px";
        } else {
            line2.style.top = line1Rect.top + 2 + "px";
        }

        setTimeout(()=>{
            
        },1000)

        container.appendChild(line2);
    } else {
        line1.classList.add("center-line");
    }

    console.log(line1Rect.right)
}
