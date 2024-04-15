// Lấy danh sách sản phẩm từ storage và hiển thị trên trang quản lý
chrome.storage.local.get({ carts: [] }, function(result) {
    const productList = document.getElementById('productList');
    const products = result.carts;

    if (products && products.length > 0) {
        products.forEach(function(product) {
            const productItem = document.createElement('div');
            productItem.classList.add('product');

            // Tạo các phần tử <img> cho mỗi hình ảnh trong mảng existingProduct.image
            product.image.forEach(function(image) {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                imgElement.alt = product.name;
                productItem.appendChild(imgElement);
            });

            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info');
            productInfo.innerHTML = `
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
            `;

            productItem.appendChild(productInfo);
            productList.appendChild(productItem);
        });
    } else {
        productList.innerHTML = "<em>No product added yet.</em>";
    }
});

document.getElementById("import-btn").addEventListener("click", function() {
    // Lấy dữ liệu hiện tại từ 'items' trong chrome.storage.local
    chrome.storage.local.get({ items: [] }, function(result) {
      var currentItems = result.items;
  
      // Lấy dữ liệu từ 'carts' trong chrome.storage.local
      chrome.storage.local.get({ carts: [] }, function(result) {
        var cartItems = result.carts;
  
        // Hợp nhất dữ liệu mới và cũ
        var mergedItems = currentItems.concat(cartItems);
  
        // Lưu dữ liệu từ 'carts' và dữ liệu hiện tại vào 'items' trong chrome.storage.local
        chrome.storage.local.set({ items: mergedItems }, function() {
          console.log("Dữ liệu đã được chuyển từ 'carts' sang 'items'");
  
          // Xóa dữ liệu của 'carts' trong chrome.storage.local
          chrome.storage.local.remove("carts", function() {
            console.log("Dữ liệu của 'carts' đã được xóa");
          });
        });
      });
    });
  });
  
document.getElementById("clearButton").addEventListener("click", function() {
    // Xóa dữ liệu của 'carts' trong chrome.storage.local
    chrome.storage.local.remove("carts", function() {
        console.log("Dữ liệu của 'carts' đã được xóa");
      });
});
