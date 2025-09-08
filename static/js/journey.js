const timelineContainer = document.querySelector(".timeline");
const timelineDetails = document.getElementById('timeline-details');
const viewFullTimelineBtn = document.getElementById('view-full-timeline-btn');


// populate the cards
// journey.js
fetch('/data/journey.json')
  .then(response => response.json())
  .then(data => {

    // Example: Render to DOM
    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("timeline-cards", "container", "left", item?.visibility, item?.class);

      card.innerHTML = `
        <div class="circle"></div>
        <div class="content">
            <p class="title">${item.title}</p>
            <p class="year">${item.year}</p>
            <p class="desc">${item.desc}</p>
        </div>
      `;

      card.setAttribute("detailed", item.detailed.join("<br>"));
      timelineContainer.insertBefore(card, viewFullTimelineBtn);
    });


    // functionalities
    const cards = document.querySelectorAll('.timeline-cards');

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const title = card.querySelector('.title').innerText;
        const year = card.querySelector('.year').innerText;
        const desc = card.querySelector('.desc').innerText;

        timelineDetails.innerHTML = `
      <p class="title">${title}</p>
      <p class="year">${year}</p>
      <p class="desc">${desc}</p>
      </br>
      <p>${card.getAttribute("detailed") || ""}</p>
    `;

      });

      card.addEventListener('mouseleave', () => {
        // timelineDetails.innerHTML = `<p>Hover on a milestone → details will appear here</p>`;
      });
    });


    viewFullTimelineBtn.addEventListener('click', () => {
      cards.forEach(card => {
        if (card.classList.contains('extra-timeline-cards')) {
          card.classList.toggle('hidden');

          if (viewFullTimelineBtn.innerText === "View Full Journey ↓") {
            viewFullTimelineBtn.innerText = "View Less Journey ↑";
            cards[2].scrollIntoView({ behavior: "smooth" });

          } else {
            card.parentElement.scrollIntoView({ behavior: "smooth" });
            viewFullTimelineBtn.innerText = "View Full Journey ↓";
          }
        }
      });
    })
  })
  .catch(err => console.error("Error loading journey.json:", err));
