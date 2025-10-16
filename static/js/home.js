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


