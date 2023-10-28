const isLogin = localStorage.getItem("user");

console.log(isLogin);

if (!isLogin) {
    window.location.href = '/login';
}



document.querySelector('#signoutBtn').addEventListener('click', e => {
    localStorage.clear();
    window.location.href = '/';
});


const addEmployeeForm = document.querySelector(".addEmployee");
    addEmployeeForm.addEventListener("submit", async e => {
        e.preventDefault();

        const fullname = document.querySelector("#fullname").value;
        const email = document.querySelector("#email").value;

        console.log(fullname);
        console.log(email);

        const response = await fetch("/admin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify({fullname, email})
        });

        const data = await response.json();
        console.log(data);

        if(!data.status) {
            // window.location.reload();
            document.querySelector(".message").innerHTML = "thêm k thành công";
        } else {
            // save to stored
            localStorage.setItem("user", data.data);
            window.location.reload();
        };
})