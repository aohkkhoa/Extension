chrome.storage.local.get({ items: [] }, function(result) {
    const productList = document.getElementById('productList');
    const products = result.items;

    if (products && products.length > 0) {
        const productTable = document.createElement('table');
        productTable.classList.add('product-table');

        productTable.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Sizes</th>
                    <th>Colors</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            ${products.map(product => `
                <tr class="product-item">
                    <td class="product-name">${product.name}</td>
                    <td class="product-price">${product.price}</td>
                    <td class="product-id">${product.id}</td>
                    <td class="product-img">${product.image.map(img => `<img src="${img}" alt="${product.name}" class="product-img">`).join('')}</td>
                    <td class="product-sizes">${product.sizes}</td>
                    <td class="product-colors">${product.colors}</td>
                    <td class="product-action"><button class="delete-btn">Delete</button></td>
                </tr>
            `).join('')}
            </tbody>
        `;

        productList.appendChild(productTable);

        // Handle click event for delete button
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const productItem = button.closest('.product-item');
                const productId = productItem.querySelector('.product-id').textContent;
                // Remove the product from the user interface
                productItem.remove();
                // Remove the product from local storage
                const updatedProducts = products.filter(p => p.id !== productId);
                chrome.storage.local.set({ items: updatedProducts });
            });
        });
    } else {
        productList.innerHTML = "<em>No product added yet.</em>";
    }
});

// Lắng nghe sự kiện click vào nút "Clear Data"
document.getElementById('clearButton').addEventListener('click', function() {
    // Xóa dữ liệu trong local storage
    chrome.storage.local.remove('items', function() {
        console.log('Local storage cleared.');
        // Tải lại trang
        location.reload();
    });
});

document.getElementById('exportButton').addEventListener('click', function() {
    // Lấy danh sách sản phẩm từ local storage
    chrome.storage.local.get({ items: [] }, function(result) {
        const products = result.items;

        // Tạo một workbook mới
        const wb = XLSX.utils.book_new();

        // Tạo một worksheet mới
        const ws = XLSX.utils.aoa_to_sheet([
            ['Name', 'Price', 'Image1', 'Image2', 'Image3'] // Tiêu đề cột
        ]);

       // Thêm dữ liệu sản phẩm vào worksheet
        products.forEach((product) => {
            // Tạo một mảng dữ liệu chứa thông tin sản phẩm
            const rowData = [product.name, product.price];

            // Thêm mỗi ảnh trong product.image là một trường riêng trong mảng dữ liệu
            product.image.forEach((image) => {
                rowData.push(image);
            });

            // Thêm dữ liệu sản phẩm vào worksheet
            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
        });

        // Thêm worksheet vào workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Product List');

        // Xuất workbook thành tệp Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'product_list.xlsx');
    });
});

function saveAsExcelFile(buffer, fileName) {
    // Chuyển đổi ArrayBuffer thành Blob
    const data = new Blob([buffer], { type: 'application/octet-stream' });

    // Tạo một đường dẫn tệp URL để tải xuống
    const url = window.URL.createObjectURL(data);

    // Tạo một phần tử a để tạo sự kiện nhấp chuột giả
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Kích hoạt sự kiện nhấp chuột giả
    link.click();

    // Giải phóng đường dẫn tệp URL
    window.URL.revokeObjectURL(url);
}


document.getElementById('api-test').addEventListener('click', function() {
    // Make a GET request
    fetch('https://localhost:44334/api/Excel')
    .then(response => response.json())
    .then(data => {
    // Process the response data
    console.log(data);
    })
    .catch(error => {
    // Handle any errors
    console.error(error);
    });
});

document.getElementById('api-test-export-csv').addEventListener('click', function() {
    chrome.storage.local.get({ items: [] }, function(result) {
        const data = ["item1", "item2", "item3"];
        const payload = JSON.stringify(data);
    
        fetch('https://localhost:44334/api/Excel/ExportExcel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: payload
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Export failed.');
            }
            return response.blob();
        })
        .then(blob => {
            // Tạo một URL tải xuống tệp Excel
            const url = URL.createObjectURL(blob);
            
            // Tạo một phần tử a để tải xuống tệp Excel
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'updated_data.xlsx';
            
            // Kích hoạt sự kiện nhấp vào phần tử a
            downloadLink.click();
            
            // Giải phóng URL tải xuống
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            // Xử lý lỗi (nếu có) ở đây
            console.error(error);
        });
    });
});