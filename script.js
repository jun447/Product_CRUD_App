$(document).ready(function() {
    const apiBaseUrl = "https://usman-fake-api.herokuapp.com/api/products";
    const productList = $("#productList");

    // Function to fetch and display all products
    function fetchProducts() {
        $.get(apiBaseUrl, function(data) {
            productList.empty();
            data.forEach(function(product) {
                const productItem = $("<li>");
                productItem.append(`<strong>Name:</strong> ${product.name}`);
                productItem.append(`<strong>Price:</strong> $${product.price}`);
                productItem.append(`<strong>Color:</strong> ${product.color} <br> `);
                productItem.append(`<strong>Department:</strong> ${product.department}`);
                productItem.append(`<br><button class="edit" data-id="${product._id}">Edit</button>`);
                productItem.append(`<button class="delete" data-id="${product._id}">Delete</button>`);
                productList.append(productItem);
            });
        });
    }

    // Initial load of products
    fetchProducts();

    // Function to populate form fields for editing
    function populateFormForEdit(product) {
        $("#newName").val(product.name);
        $("#newPrice").val(product.price);
        $("#newColor").val(product.color);
        $("#newDepartment").val(product.department);
        $("#newDescription").val(product.description);

        // Update Product button functionality
        $("#addProduct").text("Update Product").off("click").on("click", function() {
            // Send a PUT request to update the product
            $.ajax({
                url: `${apiBaseUrl}/${product._id}`,
                type: "PUT",
                data: {
                    name: $("#newName").val(),
                    price: $("#newPrice").val(),
                    color: $("#newColor").val(),
                    department: $("#newDepartment").val(),
                    description: $("#newDescription").val()
                },
                success: function() {
                    fetchProducts(); // Reload products after updating
                    resetForm(); // Reset the form after updating
                }
            });
        });
    }

    // Edit functionality
    productList.on("click", ".edit", function() {
        const productId = $(this).data("id");
        const editUrl = `${apiBaseUrl}/${productId}`;

        // Fetch the product details for editing
        $.get(editUrl, function(product) {
            populateFormForEdit(product);
        });
    });

    // Add a new product
    $("#addProduct").on("click", function() {
        const newName = $("#newName").val();
        const newPrice = $("#newPrice").val();
        const newColor = $("#newColor").val();
        const newDepartment = $("#newDepartment").val();
        const newDescription = $("#newDescription").val();

        $.post(apiBaseUrl, {
            name: newName,
            price: newPrice,
            color: newColor,
            department: newDepartment,
            description: newDescription
        }, function() {
            fetchProducts();
            resetForm();
        });
    });

    // Delete a product
    productList.on("click", ".delete", function() {
        const productId = $(this).data("id");
        const deleteUrl = `${apiBaseUrl}/${productId}`;

        $.ajax({
            url: deleteUrl,
            type: "DELETE",
            success: function() {
                fetchProducts();
            }
        });
    });

});
