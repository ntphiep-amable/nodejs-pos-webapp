$(document).ready(function() {
    var $form = $('#addPdForm');
    // support checkbox caption
    $("#enter-category").click(function() {
        let isChecked = $(this).is(":checked");
        let $newCategoryName = $("#new-category-name"),
            $productCategory = $("#product-category");
        if (!isChecked) {
            $productCategory.attr("disabled", false);
            $productCategory.attr("required", true);
            $newCategoryName.attr("required", false);
        } else {
            $productCategory.attr("disabled", true);
            $productCategory.attr("required", false);
            $newCategoryName.attr("required", true);
        }
    });
    $("#enter-category-e").click(function() {
        let isChecked = $(this).is(":checked");
        let $newCategoryName = $("#new-category-name-e"),
            $productCategory = $("#product-category-e");
        if (!isChecked) {
            $productCategory.attr("disabled", false);
            $productCategory.attr("required", true);
            $newCategoryName.attr("required", false);
        } else {
            $productCategory.attr("disabled", true);
            $productCategory.attr("required", false);
            $newCategoryName.attr("required", true);
        }
    });
    $("#product-barcode").on("dblclick", function() {
        $(this).attr("readonly", false);
    });
    $("#product-barcode").blur(function() {
        $(this).attr("readonly", true);
    });
    $("#submitAdd").click(e => {
        e.preventDefault();
        $form.find("input[type='submit']").trigger("click");
    });
    $form.submit(function(e) {
        e.preventDefault();
        let formData = new FormData(this);
        var category;
        if ($("#enter-category").is(":checked")) {
            category = $("#new-category-name").val();
        } else {
            category = $("#product-category").val();
        }
        formData.append("category", category);
        $.ajax({
            url: '/admin/products',
            type: 'POST',
            data: formData,
            success: function(data) {
                if (data.status) {
                    Swal.fire({
                        icon: 'success',
                        title: '<span style="color: var(--bg-primary-color)">Add product successfully</span>',
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: 'var(--text-primary-color)',
                        timer: 2000
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '<span style="color: var(--bg-primary-color)">Add product failed</span>',
                        text: data.message,
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: 'var(--text-primary-color)',
                        timer: 2000
                    });
                }
            },
            error: function(data) {
                Swal.fire({
                    icon: 'error',
                    title: '<span style="color: var(--bg-primary-color)">Add product failed</span>',
                    text: data.responseJSON.message,
                    showConfirmButton: false,
                    showCloseButton: true,
                    background: 'var(--text-primary-color)',
                    timer: 2000
                });
            },
            cache: false,
            contentType: false,
            processData: false
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

    // Update product
    $(".updatePrd").click(async function() {
        var prdID = $(this).closest("td").data("id");
        var response = await fetch("/admin/products/update/e", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({prdID}),
        });
        var data = await response.json();
        var $editModal = $("#editModal");
        $editModal.find("#product-barcode-e").val(data.data.barcode);
        $editModal.find("#product-name-e").val(data.data.name);
        $editModal.find("#product-price1-e").val(data.data.imp);
        $editModal.find("#product-price2-e").val(data.data.ret);
        $editModal.find("#product-category-e").val(data.data.cat);
        $editModal.modal("show");
    });
    $("#submitEdit").click(e => {
        e.preventDefault();
        $("#submitEdit").closest(".modal-content").find("input[type='submit']").trigger("click");
    });
    $("#editPdForm").submit(function(e) {
        e.preventDefault();
        let formData = new FormData(this);
        var category;
        if ($("#enter-category-e").is(":checked")) {
            category = $("#new-category-name-e").val();
        } else {
            category = $("#product-category-e").val();
        }
        formData.append("category", category);
        $.ajax({
            url: '/admin/products/update',
            type: 'POST',
            data: formData,
            success: function(data) {
                let timer = 2000;
                console.log(data);
                if (data.status) {
                    Swal.fire({
                        icon: 'success',
                        title: '<span style="color: var(--bg-primary-color)">Edit product successfully</span>',
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: 'var(--text-primary-color)',
                        timer: timer
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, timer);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '<span style="color: var(--bg-primary-color)">Edit product failed</span>',
                        text: data.message,
                        showConfirmButton: false,
                        showCloseButton: true,
                        background: 'var(--text-primary-color)',
                        timer: timer
                    });
                }
            },
            error: function(data) {
                Swal.fire({
                    icon: 'error',
                    title: '<span style="color: var(--bg-primary-color)">Edit product failed</span>',
                    text: data.responseJSON.message,
                    showConfirmButton: false,
                    showCloseButton: true,
                    background: 'var(--text-primary-color)',
                    timer: 2000
                });
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
    $(".deletePrd").click(async function() {
        let prdID = $(this).closest("td").data("id"),
            prdName = $(this).closest("tr").find("td:nth-child(4)").text();
        let isAccept = await confirmDialog("Confirm", `Are you sure to delete product '${prdName}'?`, "Delete");
        if (!isAccept) {
            return;
        }
        hideCustomDialog();
        let timer = 2000;
        const response = await fetch(`/admin/products/del/${prdID}`, {
            method: "delete",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({prdID}),
        });
        const data = await response.json();
        if (data.status) {
            Swal.fire({
                icon: 'success',
                title: '<span style="color: var(--bg-primary-color)">Delete product successfully</span>',
                showConfirmButton: false,
                showCloseButton: true,
                background: 'var(--text-primary-color)',
                timer: timer
            });
            setTimeout(() => {
                window.location.reload();
            }, timer);
        } else {
            Swal.fire({
                icon: 'error',
                title: '<span style="color: var(--danger-color)">Delete product failed</span>',
                text: data.message,
                showConfirmButton: false,
                showCloseButton: true,
                background: 'var(--text-primary-color)',
                timer: 2000
            });
        }
    });
});

$(window).on('load', function() {
    $(".search-spec input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});