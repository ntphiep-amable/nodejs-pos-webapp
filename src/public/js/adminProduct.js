const addEmployeeForm = document.querySelector(".addPrd");
addEmployeeForm.addEventListener("submit", async e => {
    e.preventDefault();

    const pname = document.querySelector("#pname").value;
    const importPrice = document.querySelector("#importPrice").value;
    const retailPrice = document.querySelector("#retailPrice").value;
    const category = document.querySelector("#category").value;

    // console.log(pname);
    // console.log(category);   

    const response = await fetch("/admin/products", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({pname, importPrice, retailPrice, category}),
    });

    const data = await response.json();
    console.log(data);

    if(!data.status) {
        // window.location.reload();
        document.querySelector(".message").innerHTML = "thêm k thành công";
    } else {
        // save to stored
        // localStorage.setItem("empl", data.data);
        window.location.reload();
    };
})

const updateBtns = document.querySelectorAll(".updatePrd");
// updateBtns.forEach(function(button) {
//     button.addEventListener('click', liste)
// })

for (let i = 0; i < updateBtns.length; i++) {
    let thisBtn = updateBtns[i];
    thisBtn.addEventListener('click', async e => {
        const prdID = thisBtn.id;

        const response = await fetch("/admin/products/update/e", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({prdID}),
        });

        const data = await response.json();
        console.log(data.data);

        localStorage.setItem('name', data.data.name);
        localStorage.setItem('imp', data.data.imp);
        localStorage.setItem('ret', data.data.ret);
        localStorage.setItem('cat', data.data.cat);


        window.location.href = '/admin/products/update'
    })    
}
