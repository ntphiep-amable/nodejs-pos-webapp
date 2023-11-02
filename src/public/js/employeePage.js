if (localStorage.getItem("role") !== "employee" || !localStorage.getItem("username")) {
    window.location.href = '/login';
}

document.querySelector('#name').innerHTML =  localStorage.getItem("fullname");

document.querySelector('#signoutBtn').addEventListener('click', e => {
    localStorage.clear();
    window.location.href = '/';
});

document.querySelector('#changePass').addEventListener('click', async e => {
    e.preventDefault();
    window.location.href = 'employee/p/update';
});

document.querySelector('#changeAvt').addEventListener('click', async e => {
    e.preventDefault();
    window.location.href = 'employee/avt/update';
});


async function hmm () {
    const username = localStorage.getItem("username");
    console.log(username);

    const response = await fetch("/employee/c", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({username}),
    }); 

    const data = await response.json();
    console.log(data);

    if (!data.status){
        document.querySelector("#changePassMess").innerHTML = data.message;
        document.getElementById("feature").style.display = "none";
    }
};

hmm();