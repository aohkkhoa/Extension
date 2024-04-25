// Lấy danh sách sản phẩm từ storage và hiển thị trên trang quản lý
chrome.storage.local.get({ carts: [] }, function(result) {
  const productList = document.getElementById('productList');
  const products = result.carts;

  if (products && products.length > 0) {
      products.forEach(function(product) {
          const productContainer = document.createElement('div');
          productContainer.classList.add('product-container');

          const productItem = document.createElement('div');
          productItem.classList.add('product');

          // Tạo các phần tử <img> cho mỗi hình ảnh trong mảng existingProduct.image
          product.image.forEach(function(imageUrl, index) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');
        
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = product.name;
        
            const deleteImgBtn = document.createElement('button');
            deleteImgBtn.innerHTML = '&#10006;'; // Sử dụng biểu tượng X Unicode
            deleteImgBtn.classList.add('delete-img-btn');
        
            deleteImgBtn.addEventListener('click', function() {
                imgContainer.remove();
                product.image.splice(index, 1);
                const updatedProducts = products.map(p => {
                    if (p.id === product.id) {
                        return product;
                    }
                    return p;
                });
                chrome.storage.local.set({ carts: updatedProducts });
            });
        
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(deleteImgBtn);
            productItem.appendChild(imgContainer);
        });

          productContainer.appendChild(productItem);

          const productInfo = document.createElement('div');
          productInfo.classList.add('product-info');
          productInfo.innerHTML = `
              <div class="product-name">${product.name}</div>
              <div class="product-price">${product.price}</div>
              <button class="delete-btn">Xóa</button>
          `;

          productContainer.appendChild(productInfo);
          productList.appendChild(productContainer);

          // Xử lý sự kiện click cho nút xóa
          const deleteBtn = productInfo.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', function() {
              // Xóa sản phẩm khỏi giao diện người dùng
              productContainer.remove();
              // Xóa sản phẩm khỏi local storage
              const updatedProducts = products.filter(p => p.id !== product.id);
              chrome.storage.local.set({ carts: updatedProducts });
          });
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
