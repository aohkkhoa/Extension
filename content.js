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
// Lấy danh sách các mục đã lưu trữ từ chrome.storage
chrome.storage.local.get({ carts: [] }, function(result) {
        const existingProduct = result.carts.find(item => item.id === productInfo.id);

        if (existingProduct) {
            // Kiểm tra nếu existingProduct.image không phải là mảng
            if (!Array.isArray(existingProduct.image)) {
                // Tạo một mảng mới và gán existingProduct.image vào mảng
                existingProduct.image = [existingProduct.image];
            }
            // Thêm productInfo.image vào mảng existingProduct.image
            existingProduct.image.push(productInfo.image);
        } else {
            // Thêm sản phẩm mới vào danh sách
            result.carts.push(productInfo);
        }

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