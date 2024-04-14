// Hàm để lấy thông tin sản phẩm và chuyển hướng sang trang quản lý
function getProductInfoAndRedirect() {
    console.log("hahahaahahhihihihihuhuhuhuh trong if")
    const productInfo = {
        name: document.querySelector('.ItemHeader--mainTitle--3CIjqW5').innerText.trim(),
        price: document.querySelector('.Price--priceText--2nLbVda').innerText.trim(),
        image: document.querySelector('.PicGallery--mainPic--1eAqOie').src
    };
    console.log(productInfo);
    //Lưu thông tin sản phẩm vào local storage để chuyển sang trang quản lý
    // Lấy danh sách các mục đã lưu trữ từ chrome.storage
    chrome.storage.local.get({ items: [] }, function(result) {
        // Thêm thông tin sản phẩm mới vào danh sách
        result.items.push(productInfo);
    
        // Lưu trữ danh sách đã cập nhật vào chrome.storage
        chrome.storage.local.set({ items: result.items }, function() {
        // Gửi thông điệp đến content script để chuyển sang trang quản lý
        chrome.runtime.sendMessage({ action: "openManagePage" });
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