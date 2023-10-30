const lockBtn = document.querySelector("#lock");

lockBtn.addEventListener('click', async e => {
    e.preventDefault();

    const mail = document.querySelector("#mail").value;
    console.log(mail);

    const response = await fetch('/admin/l/employee', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
})