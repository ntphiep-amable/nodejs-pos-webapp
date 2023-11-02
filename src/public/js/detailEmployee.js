const mail = document.querySelector("#mail").innerHTML;


const lockBtn = document.querySelector("#lock");

lockBtn.addEventListener('click', async e => {
    e.preventDefault();

    
    console.log(mail);

    const response = await fetch('/admin/l/employee', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
    });

    const data = await response.json();

    console.log(data.data.isLocked);
    window.location.reload();
});


const sendMailBtn = document.querySelector("#sendLink");
sendMailBtn.addEventListener("click", async e => {
    e.preventDefault();

    const response = await fetch('/admin/send/employee', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
    });

    const data = await response.json();

    console.log(data);

})