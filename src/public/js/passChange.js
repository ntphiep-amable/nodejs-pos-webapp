const changePassForm = document.querySelector('#formPassChange');

const username = localStorage.getItem("username");

changePassForm.addEventListener('submit', async e => {
    e.preventDefault();

    const oldPass = document.querySelector("#oldPass").value;
    const newPass = document.querySelector("#newPass").value;
    const reNewPass = document.querySelector("#reNewPass").value;

    const response = await fetch('/admin/p/update', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, oldPass, newPass, reNewPass }),
    });

    const data = await response.json();

    console.log(data.message);



    console.log(newPass);
})