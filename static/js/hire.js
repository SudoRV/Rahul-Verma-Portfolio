services = document.getElementsByClassName("checkServicesInp")
budgetlabel = document.getElementById("estbudget")
totalBudget = 0
for (box of services){
    box.addEventListener("change",(event)=>{
        t = event.currentTarget
        if (t.checked){
            if (t.classList.contains("checkServicesInp")){
                totalBudget += parseInt(t.getAttribute("price"))
                budgetlabel.style.display =  "flex"
                budgetlabel.innerText =`Rs. ${totalBudget} /-`
            }
        }
        else{
            totalBudget -= parseInt(t.getAttribute("price"))
            budgetlabel.innerText =`Rs. ${totalBudget} /-`
            if (totalBudget == 0){
                budgetlabel.style.display = "none"
            }
        }
    })
}

userBudget = document.getElementById("userBudget")

document.querySelector("textarea[name=customService]").addEventListener("input",(event)=>{
    if (event.target.value.length > 5){
        userBudget.style.display="flex"
    }
    else{
        userBudget.style.display="none"
    }
})