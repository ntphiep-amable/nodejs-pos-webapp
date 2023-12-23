// const changePassForm = document.querySelector('#formPassChange');

// const username = localStorage.getItem("username");
// const role = localStorage.getItem("role");

// // console.log(role);

// changePassForm.addEventListener('submit', async e => {
//     e.preventDefault();

//     const oldPass = document.querySelector("#oldPass").value;
//     const newPass = document.querySelector("#newPass").value;
//     const reNewPass = document.querySelector("#reNewPass").value;


//     // if (role === "admin") {
//         const response = await fetch(`/${role}/p/update`, {
//             method: 'post',
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, oldPass, newPass, reNewPass }),
//         });

//         const data = await response.json();

//         console.log(data.message);

//         document.querySelector("#message").innerHTML = data.message;

//         if (data.status) {
//             setTimeout(function () {
//                 window.location.href = '/admin';
//             }, 3000);
//         }
        

//         console.log(newPass);

        
    // } else {
    //     const response = await fetch('/employee/p/update', {
    //         method: 'post',
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ username, oldPass, newPass, reNewPass }),
    //     });

    //     const data = await response.json();

    //     console.log(data.message);
    // }

    
// });

$(document).ready(function () {
    var $form = $('#changePasswordF'),
        regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
    $form.submit(async function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        let oldPass = $('#curPassword').val();
        let newPass = $('#password').val();
        let reNewPass = $('#confirmPassword').val();
        if (!regex.test(newPass)) {
            await dialogAlertWait("Error", "Unvalid password");
            return;
        } else
        if (oldPass === newPass) {
            await dialogAlertWait("Error", "New password must be different from old password");
            return;
        } else
        if (newPass !== reNewPass) {
            await dialogAlertWait("Error", "Password and confirm password not match");
            return;
        } else {
            $form.addClass('was-validated');
        }

        const response = await fetch(location.pathname, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.status) {
            await dialogAlertWait("Success", data.message);
            window.location.href = '/admin';
        } else {
            await dialogAlertWait("Error", data.message);
        }
    });
});