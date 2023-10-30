const lockBtn = document.querySelector("#lock");

lockBtn.addEventListener('click', async e => {
    e.preventDefault();

    const mail = document.querySelector("#mail").innerHTML;
    console.log(mail);

    const response = await fetch('/admin/l/employee', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
    });

    const data = await response.json();

    console.log(data.data.isLocked);

    // if (!data.data.isLocked) {
    //     document.querySelector("#lock").innerHTML = "khóa mõm";
        
    // } else {
    //     console.log('ls');
    //     document.querySelector("#lock").innerHTML = "mở khóa";
    // }

    console.log(data.data.isLocked);
    window.location.reload();
})