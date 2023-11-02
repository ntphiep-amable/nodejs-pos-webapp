const changePassForm = document.querySelector('#formPassChange');

const username = localStorage.getItem("username");
const role = localStorage.getItem("role");

// console.log(role);

changePassForm.addEventListener('submit', async e => {
    e.preventDefault();

    const oldPass = document.querySelector("#oldPass").value;
    const newPass = document.querySelector("#newPass").value;
    const reNewPass = document.querySelector("#reNewPass").value;


    // if (role === "admin") {
        const response = await fetch(`/${role}/p/update`, {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, oldPass, newPass, reNewPass }),
        });

        const data = await response.json();

        console.log(data.message);

        document.querySelector("#message").innerHTML = data.message;

        if (data.status) {
            setTimeout(function () {
                window.location.href = '/admin';
            }, 3000);
        }
        

        console.log(newPass);

        
    // } else {
    //     const response = await fetch('/employee/p/update', {
    //         method: 'post',
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ username, oldPass, newPass, reNewPass }),
    //     });

    //     const data = await response.json();

    //     console.log(data.message);
    // }

    
})