// Hàm để lấy thông tin sản phẩm và chuyển hướng sang trang quản lý
function getProductInfoAndRedirect() {
    console.log("hahahaahahhihihihihuhuhuhuh trong if")
    const productInfo = {
        name: document.querySelector('.ItemHeader--mainTitle--3CIjqW5').innerText.trim(),
        price: document.querySelector('.Price--priceText--2nLbVda').innerText.trim(),
        image: document.querySelector('.PicGallery--mainPic--1eAqOie').src,
        // xin Diệu Hiền hãy đọc : đây là id của sản phẩm.
        id: document.querySelector('#aliww-click-trigger').getAttribute('data-item')
    };
    console.log(productInfo);

    // Lấy tất cả các phần tử có class là 'skuCate'
    const skuCateElements = document.querySelectorAll('.skuCate');
    skuCateElements.forEach(skuCateElement => {
        const skuCateText = skuCateElement.querySelector('.skuCateText').textContent.trim();
        // Kiểm tra nếu chứa từ khóa '颜色'
        if (skuCateText.includes('颜色') || skuCateText.includes('màu sắc')) {
            const colors = []; 
            const colorItem = skuCateElement.querySelectorAll('.skuItem .skuValueName');
            colorItem.forEach(colorItem => {
                colors.push(colorItem.textContent.trim());
            });
            productInfo.color = colors;
            
        }
        // Kiểm tra nếu chứa từ khóa '尺码'
        if (skuCateText.includes('尺码') || skuCateText.includes('kích cỡ')) {
            const sizes = [];
            const sizeItems = skuCateElement.querySelectorAll('.skuItem .skuValueName');
            sizeItems.forEach(sizeItem => {
                sizes.push(sizeItem.textContent.trim());
            });
            // Thêm thông tin kích cỡ vào productInfo
            productInfo.sizes = sizes;
        }
        productInfo.urlItem  = window.location.href;
    });

// Lấy danh sách các mục đã lưu trữ từ chrome.storage
chrome.storage.local.get({ carts: [] }, function(result) {
        const existingProduct = result.carts.find(item => item.id === productInfo.id);

        if (existingProduct) {
            // Thêm productInfo.image vào mảng existingProduct.image
            existingProduct.image.push(productInfo.image);
            // Khởi tạo mảng colors nếu chưa tồn tại
            if (!existingProduct.colors) {
                existingProduct.colors = [];
            }
            // Thêm productInfo.color vào mảng existingProduct.colors nếu tồn tại
            if (productInfo.color) {
                existingProduct.colors.push(productInfo.color);
            }
            // Khởi tạo mảng sizes nếu chưa tồn tại
            if (!existingProduct.sizes) {
                existingProduct.sizes = [];
            }
            // Thêm productInfo.sizes vào mảng existingProduct.sizes nếu tồn tại
            if (productInfo.sizes) {
                existingProduct.sizes.push(...productInfo.sizes);
            }

        } else {
            productInfo.image = [productInfo.image];
            // Thêm sản phẩm mới vào danh sách
            result.carts.push(productInfo);
        }
        console.log(productInfo);
        // Lưu trữ danh sách đã cập nhật vào chrome.storage
        chrome.storage.local.set({ carts: result.carts }, function() {
        });
    });
}
// Lắng nghe sự kiện click vào sản phẩm và gọi hàm getProductInfoAndRedirect
document.addEventListener('click', function(event) {
    console.log("hahahaahahhihihihihuhuhuhuh ngoai if");
    console.log(event.target.classList);
    if (event.target.classList.contains('js-image-zoom__zoomed-area')) {
        getProductInfoAndRedirect();
    }
});