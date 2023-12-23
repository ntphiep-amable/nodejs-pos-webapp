document.querySelector('#signoutBtn').addEventListener('click', e => {
    localStorage.clear();
    window.location.href = '/';
});
document.querySelector('#changePass').addEventListener('click', async e => {
    e.preventDefault();
    window.location.href = 'admin/p/update'
});
document.querySelector('#name').innerHTML = localStorage.getItem("fullname");
const addEmployeeForm = document.querySelector(".addEmployee");
addEmployeeForm.addEventListener("submit", async e => {
    e.preventDefault();
    const fullname = document.querySelector("#fullname").value;
    const email = document.querySelector("#email").value;
    const response = await fetch("/admin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body : JSON.stringify({fullname, email}),
    });

    const data = await response.json();
    if(!data.status) {
        dialogAlert("Add employee failed", "Email already exists, please try again!");
    } else {
        localStorage.setItem("empl", data.data);
        await dialogAlertWait("Add employee successfully", "Please tell your employee to check email to set password!");
        window.location.reload();
    };
});

$(window).on('load', function () {
    $(".close").click(()=>{
      $(".alert").fadeOut();
    });
    $(".search-spec input").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("table tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 || $(this).find('.hidden-btn').data("status").startsWith(value));
      });
    });
  });
  $(".lock-btn").click(async function(){
    let isLocked = !$(this).find(".badge-danger").hasClass("d-none");
    let isAccept = await confirmDialog("Confirm", `Are you sure to ${
        isLocked ? "unlock" : "lock"
    } this employee?`, isLocked ? "Unlock" : "Lock");
    if(!isAccept){
      return;
    }
    let email = $(this).closest("td").data("email");
    let data = {
      mail: email,
      isLocked: isLocked
    }
    let $this = $(this);
    $.ajax({
      url: "/admin/l/employee",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(res){
        if(res.status){
          $this.find(".badge").toggleClass("d-none");
          $("#message-dia .modal-body").text(res.message);
          $("#message-dia").modal("show");
          $this.attr("data-status", res.data.isLocked ? "unlook" : "lock");
          $this.data("status", res.data.isLocked ? "unlook" : "lock");
        }
      }
    });
    
  })
  $(".send-link-btn").click(async function(){
    let isAccept = await confirmDialog("Confirm", `Are you sure to send mail to this employee?`, "Send");
    if(!isAccept){
      return;
    }
    let email = $(this).closest("td").data("email");
    let data = {
      mail: email
    }
    let $this = $(this);
    $.ajax({
      url: "/admin/send/employee",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function(res){
        $("#message-dia .modal-body").text(res.message);
        $("#message-dia").modal("show");
      }
    });
  });