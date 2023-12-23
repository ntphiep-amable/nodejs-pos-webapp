$(window).on('load', function() {
    $(".search-spec input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
    // See barcode image
    $(".see-barcode").click(function() {
        let barcode = $(this).data("src");
        Swal.fire({
            title: '<span style="color: var(--bg-primary-color)">Barcode</span>',
            html: `<img src="${barcode}" alt="barcode" style="width: 100%">`,
            showCloseButton: true,
            showConfirmButton: false,
            background: 'var(--text-primary-color)',
        });
    });
});

// document.querySelector('#name').innerHTML =  localStorage.getItem("fullname");

document.querySelector('#signoutBtn').addEventListener('click', e => {
    localStorage.clear();
    window.location.href = '/';
});

document.querySelector('#changePass').addEventListener('click', async e => {
    e.preventDefault();
    window.location.href = '/employee/p/update';
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