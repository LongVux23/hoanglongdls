(function(){
    // Khởi tạo EmailJS
    emailjs.init("lKdSYzQb7LoXCmxCd");
})();

// Thước đo chuẩn Email và Số điện thoại
const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
const phonePattern = /^(03|05|07|08|09|02)[0-9]{8}$/;

let allProducts = JSON.parse(localStorage.getItem('dls_products')) || [
    { name: "Nike Mercurial Vapor 16 Elite Xanh Coban", price: 790000, img: "xanhcobanelite.jpg" },
    { name: "Nike Mercurial Vapor 16 Academy Cam Vạch Xanh Biển", price: 530000, img: "camvachxanhaca.jpg" },
    { name: "Nike Tiempo 10 Pro Bạc Vạch Đen", price: 680000, img: "tiempo10bac.jpg" },
    { name: "Nike Phantom GX 2 Elite Trắng Vạch Xanh Hồng", price: 750000, img: "phantomgx2.jpg" },
    { name: "Adidas F50 Elite Lamine Yamal Hồng Nhạt", price: 700000, img: "f50yamal.jpg" },
    { name: "Vapor 16 Elite VN Trắng Vạch Dior", price: 390000, img: "vndior.jpg" },
    { name: "Adidas X 19.1 Hồng Neon", price: 560000, img: "x19.1.jpg" },
    { name: "Mizuno Neo 4 Bạc", price: 450000, img: "mizunoneo4.jpg" },
    { name: "Nike Mercurial Vapor 16 Academy V2 ViniJR Hồng", price: 430000, img: "viniacav2.jpg" },
    { name: "Winbro F50 Pro Cam Xanh", price: 290000, img: "winbrof50cam.jpg" },
    { name: "Vapor 16 Elite VN Đỏ Vạch Trắng Đen", price: 390000, img: "vndovp.jpg" },
    { name: "Nike Mercurial Vapor 16 Elite Dior", price: 790000, img: "vp16dior.jpg" },
    { name: "Nike Mercurial Vapor 16 Academy V2 Tím khoai môn", price: 430000, img: "acatimv2.jpg" },
    { name: "Nike Mercurial Vic 6 Đỏ Vạch Đen", price: 430000, img: "vic6do.jpg" },
    { name: "Nike Phantom 6 Pro Đỏ Xám", price: 660000, img: "phantom6do.jpg" },
    { name: "Adidas F50 Elite BAPE Xanh Hồng", price: 850000, img: "bape.jpg" },
    { name: "Adidas F50 Elite Trắng Vạch Đỏ Xanh", price: 720000, img: "f50trang.jpg" },
    { name: "Adidas F50 Elite Laceless Trắng Đỏ", price: 680000, img: "f50leaguetrangdo.jpg" },
    { name: "Mizuno Neo 4 Pro Đỏ Vạch Hồng", price: 740000, img: "mizunoneo4dovachhong.jpg" },
    { name: "Nike Mercurial Vapor 14 Pro Euro Xanh Ngọc", price: 650000, img: "vapor14proxanheuro.jpg" },
    { name: "Winbro Mercurial Vapor 16 Pro Xanh Lá", price: 290000, img: "winbrovp16xanh.jpg" },
    { name: "Vapor 16 Elite VN Xanh Ngọc Đế Xanh Ngọc", price: 280000, img: "vp16vnxanhngoc.jpg" },
    { name: "Nike Mercurial Vapor 15 Academy Trắng", price: 430000, img: "aca15trang.jpg" },
    { name: "Adidas Predator Edge.3", price: 590000, img: "predator.jpg" },
    { name: "Mizuno Morelia Neo 3", price: 420000, img: "mizuno3.jpg" },
    { name: "Nike Mercurial Vapor 16 Elite Gray", price: 790000, img: "gray.jpg" }
];

// Tự động lưu bản đầu tiên vào máy nếu chưa có
if(!localStorage.getItem('dls_products')) {
    localStorage.setItem('dls_products', JSON.stringify(allProducts));
}

let cart = [];
let tempItem = null;
let currentPage = 1;
const itemsPerPage = 25;
let filteredProducts = [...allProducts];
let isHomePage = true;

function hideBanner() { document.getElementById('homeBanner').style.display = 'none'; }
function showBanner() { document.getElementById('homeBanner').style.display = 'flex'; }

function goHome() {
    isHomePage = true;
    showBanner();
    document.getElementById('searchInput').value = '';
    filteredProducts = [...allProducts];
    document.getElementById('result-title').innerText = "Sản phẩm nổi bật";
    renderProducts(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleUserMenu(e) {
    e.stopPropagation();
    const menu = document.getElementById('userDropdown');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

window.addEventListener('click', function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.style.display = 'none';
});

function handleLogout() {
    if(confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
        localStorage.removeItem('dls_session');
        location.reload();
    }
}

function showAccountMgmt() {
    const session = JSON.parse(localStorage.getItem('dls_session'));
    if(!session) return;
    document.getElementById('displayAccName').innerText = session.name;
    document.getElementById('displayAccEmail').innerText = session.email;
    document.getElementById('accountMgmtModal').style.display = 'flex';
}

function showOrderTracking() {
    const session = JSON.parse(localStorage.getItem('dls_session'));
    if(!session) return;

    const allOrders = JSON.parse(localStorage.getItem('dls_orders') || "[]");
    const userOrders = allOrders.filter(o => o.userEmail === session.email);
    
    const area = document.getElementById('orderListArea');
    if(userOrders.length === 0) {
        area.innerHTML = "<p style='text-align:center; padding:20px; color:#999;'>Bạn chưa có đơn hàng nào.</p>";
    } else {
        area.innerHTML = userOrders.reverse().map(o => `
            <div class="order-card" style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <small style="color:#888;">${o.date}</small>
                    <b style="color:var(--pink-main); font-size:12px;">${o.status}</b>
                </div>
                <div style="white-space: pre-line; font-size:13px; margin-bottom:5px;">${o.details}</div>
                <div style="text-align:right; border-top:1px dashed #eee; pt:5px; font-weight:bold;">
                    Tổng: ${o.total}
                </div>
            </div>
        `).join('');
    }
    document.getElementById('orderTrackingModal').style.display = 'flex';
}

function updateAccount() {
    const oldPassInput = document.getElementById('oldPass').value;
    const newPassInput = document.getElementById('newPass').value;
    
    let session = JSON.parse(localStorage.getItem('dls_session'));
    if (!session) return;

    if (oldPassInput !== session.pass) {
        alert("Mật khẩu cũ không chính xác!");
        return;
    }

    if (!newPassInput.trim()) {
        alert("Vui lòng nhập mật khẩu mới!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('dls_users') || "[]");
    let userIndex = users.findIndex(u => u.email === session.email);
    
    if (userIndex !== -1) {
        users[userIndex].pass = newPassInput;
        localStorage.setItem('dls_users', JSON.stringify(users));
        session.pass = newPassInput;
        localStorage.setItem('dls_session', JSON.stringify(session));
        alert("Cập nhật mật khẩu thành công!");
        document.getElementById('oldPass').value = "";
        document.getElementById('newPass').value = "";
        closeModal('accountMgmtModal');
    }
}

function renderProducts(page = 1) {
    currentPage = page;
    const grid = document.getElementById('productGrid');
    const paginationDiv = document.getElementById('pagination');
    const seeAllDiv = document.getElementById('seeAllContainer');
    let pageItems = [];

    if (isHomePage) {
        pageItems = filteredProducts.slice(0, itemsPerPage);
        paginationDiv.style.display = 'none';
        if (filteredProducts.length >= itemsPerPage) {
            seeAllDiv.style.display = 'flex';
        } else {
            seeAllDiv.style.display = 'none';
        }
    } else {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        pageItems = filteredProducts.slice(start, end);
        seeAllDiv.style.display = 'none';
        renderPagination();
    }

    grid.innerHTML = pageItems.map(p => `
        <div class="product-card" onclick="openProductDetail('${p.name.replace(/'/g, "\\'")}')" style="cursor: pointer;">
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <p class="price">${p.price.toLocaleString()}đ</p>
            <button class="btn-buy" onclick="event.stopPropagation(); openSizePopup('${p.name.replace(/'/g, "\\'")}', ${p.price})">THÊM VÀO GIỎ</button>
        </div>
    `).join('');
}

function renderPagination() {
    const paginationDiv = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) {
        paginationDiv.style.display = 'none';
        return;
    }
    paginationDiv.style.display = 'flex';
    let html = `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Trước</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Sau</button>`;
    paginationDiv.innerHTML = html;
}

function changePage(page) {
    renderProducts(page);
    document.getElementById('result-title').scrollIntoView({ behavior: 'smooth' });
}

function showAllShoes() {
    isHomePage = false;
    hideBanner(); 
    document.getElementById('searchInput').value = '';
    filteredProducts = [...allProducts];
    document.getElementById('result-title').innerText = "Tất cả Giày Bóng Đá";
    renderProducts(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if(query.length > 0) {
        isHomePage = false;
        hideBanner(); 
    }
    filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(1);
    document.getElementById('result-title').innerText = query ? `Kết quả cho: "${query}"` : "Sản phẩm nổi bật";
}

function filterByMenu(keyword) {
    isHomePage = false;
    hideBanner(); 
    document.getElementById('searchInput').value = keyword;
    filterProducts();
}

function showSizeGuide() { document.getElementById('sizeGuideModal').style.display = 'flex'; }
function showInfo() { document.getElementById('infoModal').style.display = 'flex'; }
function openSizePopup(name, price) {
    tempItem = { name, price };
    document.getElementById('sizeProductName').innerText = name;
    
    // Inject size nodes
    const container = document.getElementById('sizeSelectionContainer');
    let nodesHtml = '';
    for(let i=38; i<=44; i++) {
        nodesHtml += `<div class="size-node" onclick="confirmAddToCart(${i})">${i}</div>`;
    }
    container.innerHTML = nodesHtml;
    
    document.getElementById('sizeModal').style.display = 'flex';
}

function confirmAddToCart(size) {
    const existingItem = cart.find(item => item.name === tempItem.name && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...tempItem, size, quantity: 1, id: Date.now() });
    }
    updateCartUI();
    closeModal('sizeModal');
    alert(`Đã thêm ${tempItem.name} (Size ${size}) vào giỏ!`);
}

function updateCartUI() {
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cartNum').innerText = totalQty;
    const list = document.getElementById('cartItems');
    const totalText = document.getElementById('cartTotal');
    let sum = 0;

    list.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        sum += itemTotal;
        return `
            <div class="cart-item">
                <div style="text-align:left; flex: 1;">
                    <b style="font-size: 14px;">${item.name}</b><br>
                    <small>Size: ${item.size} | ${item.price.toLocaleString()}đ</small>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="changeQty(${item.id}, -1)" style="width:25px; cursor:pointer;">-</button>
                    <span style="font-weight:bold; min-width:20px; text-align:center;">${item.quantity}</span>
                    <button onclick="changeQty(${item.id}, 1)" style="width:25px; cursor:pointer;">+</button>
                    <button class="btn-delete" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    }).join('');
    totalText.innerText = "Tổng cộng: " + sum.toLocaleString() + "đ";
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) {
            removeItem(id);
        } else {
            updateCartUI();
        }
    }
}

function removeItem(id) { cart = cart.filter(item => item.id !== id); updateCartUI(); }

function sendOrder() {
    const name = document.getElementById('cusName').value.trim();
    const phone = document.getElementById('cusPhone').value.trim();
    const email = document.getElementById('cusEmail').value.trim();
    const address = document.getElementById('cusAddress').value.trim();
    
    const session = JSON.parse(localStorage.getItem('dls_session'));
    if (!session) {
        alert("Vui lòng đăng nhập để đặt hàng và theo dõi đơn!");
        return;
    }

    const payMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    // --- ĐOẠN MỚI THÊM VÀO ĐỂ KIỂM TRA THANH TOÁN ---
    if (payMethod === "QR") {
        const isConfirmed = document.getElementById('confirmTransfer').checked;
        if (!isConfirmed) {
            alert("Vui lòng thực hiện chuyển khoản và tích xác nhận 'Tôi đã chuyển khoản thành công' trước khi đặt hàng!");
            return; // Chặn lại không cho chạy code bên dưới
        }
    }

    const payText = payMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản QR";

    if (!name || !phone || !email || !address) {
        alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
        return;
    }

    if (!phonePattern.test(phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Địa chỉ email không hợp lệ!");
        return;
    }

    let orderDetails = "";
    let total = 0;
    cart.forEach(item => {
        orderDetails += `${item.name} (Size: ${item.size}) x${item.quantity}\n`;
        total += item.price * item.quantity;
    });

    const templateParams = {
        cus_name: name,
        cus_phone: phone,
        cus_email: email,
        cus_address: address,
        order_details: orderDetails,
        total_price: total.toLocaleString() + "đ"
    };

    let allOrders = JSON.parse(localStorage.getItem('dls_orders') || "[]");
    const newOrder = {
        userEmail: session.email,
        date: new Date().toLocaleString('vi-VN'),
        details: orderDetails,
        total: total.toLocaleString() + "đ",
        status: "Đang chờ xác nhận"
    };
    allOrders.push(newOrder);
    localStorage.setItem('dls_orders', JSON.stringify(allOrders));

    emailjs.send("service_mhj8uh9", "template_va8nehf", templateParams)
        .then(function() {
            alert("Đặt hàng thành công! Thông tin đơn hàng đã được gửi về email của bạn. Phương thức: " + payText);
            cart = [];
            updateCartUI();
            closeModal('checkoutModal');
        }, function(error) {
            alert("Gửi đơn thất bại, vui lòng thử lại.");
        });
}

function showCart() { document.getElementById('cartModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function openAuthModal() { document.getElementById('authModal').style.display = 'flex'; }

function switchAuth(type) {
    const isLogin = type === 'login';
    document.getElementById('loginForm').style.display = isLogin ? 'block' : 'none';
    document.getElementById('registerForm').style.display = isLogin ? 'none' : 'block';
    document.getElementById('tabLogin').classList.toggle('active', isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
}

let systemOTP = null;
let pendingUser = null;

function registerAction() {
    const user = document.getElementById('regUser').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;

    if(!user || !email || !pass) return alert("Vui lòng điền đủ thông tin đăng ký!");
    
    if (!emailPattern.test(email)) {
        alert("Email phải đúng định dạng và có đuôi .com (Ví dụ: example@gmail.com)!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('dls_users') || "[]");
    if(users.find(u => u.name === user)) return alert("Tên đăng nhập đã tồn tại!");
    if(users.find(u => u.email === email)) return alert("Email này đã được sử dụng!");

    systemOTP = Math.floor(100000 + Math.random() * 900000).toString();
    pendingUser = { name: user, email: email, pass: pass };

    const otpParams = {
        cus_name: user,
        to_email: email, 
        otp_code: systemOTP
    };

    alert("Đang gửi mã OTP đến email của bạn. Vui lòng chờ trong giây lát...");

    emailjs.send("service_mhj8uh9", "template_t8j1w64", otpParams)
        .then(function() {
            document.getElementById('otpMessage').innerText = "Mã OTP đã được gửi đến " + email;
            document.getElementById('otpModal').style.display = 'flex';
        }, function(error) {
            console.log('Gửi OTP thất bại...', error);
            alert("Không thể gửi email xác thực lúc này.");
        });
}

function loginAction() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;

    let users = JSON.parse(localStorage.getItem('dls_users') || "[]");
    const found = users.find(u => (u.name === user || u.email === user) && u.pass === pass);

    if(found) {
        localStorage.setItem('dls_session', JSON.stringify(found));
        checkLoginStatus();
        closeModal('authModal');
        alert("Chào mừng " + found.name + " đã quay trở lại!");
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
}

function checkLoginStatus() {
    const session = JSON.parse(localStorage.getItem('dls_session'));
    if(session) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfoDisplay').style.display = 'flex';
        document.getElementById('currentUserName').innerText = session.name;
    } else {
        document.getElementById('authButtons').style.display = 'block';
        document.getElementById('userInfoDisplay').style.display = 'none';
    }
}

window.alert = function(message) {
    const oldAlert = document.getElementById('custom-alert-overlay');
    if (oldAlert) oldAlert.remove();

    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 200000;
        display: flex; justify-content: center; align-items: center;
        backdrop-filter: blur(2px);
    `;

    const box = document.createElement('div');
    box.style = `
        background: white; padding: 25px; border-radius: 15px;
        width: 350px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-top: 5px solid #ed4d8d; animation: popUp 0.3s ease-out;
    `;

    box.innerHTML = `
        <div style="font-size: 40px; color: #ed4d8d; margin-bottom: 10px;">⚽</div>
        <h3 style="margin: 0 0 15px; color: #333; font-family: Arial;">Thông báo</h3>
        <p style="color: #666; line-height: 1.5; margin-bottom: 20px;">${message}</p>
        <button id="btn-close-alert-now" style="
            background: #ed4d8d; color: white; border: none;
            padding: 10px 30px; border-radius: 25px; font-weight: bold;
            cursor: pointer; width: 100%; transition: 0.3s;
        ">OK</button>
    `;

    const style = document.createElement('style');
    if (!document.getElementById('alert-animation')) {
        style.id = 'alert-animation';
        style.innerHTML = ` @keyframes popUp { from {transform: scale(0.8); opacity: 0;} to {transform: scale(1); opacity: 1;} } `;
        document.head.appendChild(style);
    }

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('btn-close-alert-now').onclick = function() {
        overlay.remove();
    };
    
    overlay.onclick = function(e) {
        if(e.target === overlay) overlay.remove();
    };
};

function openCheckout() {
    const session = JSON.parse(localStorage.getItem('dls_session'));
    if (!session) {
        alert("Vui lòng đăng nhập để hệ thống xác nhận đơn hàng của bạn!");
        closeModal('cartModal');
        openAuthModal();
        return;
    }
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    closeModal('cartModal');
    if (document.getElementById('cusName')) document.getElementById('cusName').value = session.name;
    if (document.getElementById('cusEmail')) document.getElementById('cusEmail').value = session.email;

    let summaryHtml = "<b>Chi tiết đơn hàng:</b><br>";
    let total = 0;
    cart.forEach(item => {
        const subTotal = item.price * item.quantity;
        summaryHtml += `- ${item.name} (Size ${item.size}) x${item.quantity}: ${subTotal.toLocaleString()}đ<br>`;
        total += subTotal;
    });
    summaryHtml += `<br><b>Tổng thanh toán: ${total.toLocaleString()}đ</b>`;
    document.getElementById('orderSummary').innerHTML = summaryHtml;
    
    // Thêm 2 dòng này để reset trạng thái thanh toán
    if(document.querySelector('input[name="paymentMethod"][value="COD"]')) {
        document.querySelector('input[name="paymentMethod"][value="COD"]').checked = true;
        toggleQR(false);
    }
    
    document.getElementById('checkoutModal').style.display = 'flex';
}

function injectForgotPassword() {
    const passwordInput = document.getElementById('loginPass');
    if (passwordInput && !document.getElementById('forgot-link-box')) {
        const forgotBox = document.createElement('div');
        forgotBox.id = 'forgot-link-box';
        forgotBox.style = "text-align: right; margin: 10px 0; width: 100%;";
        forgotBox.innerHTML = `
            <a href="javascript:void(0)" onclick="handleForgotPassword()" 
               style="color: #ed4d8d; font-size: 13px; text-decoration: none; font-weight: bold; cursor: pointer;">
               Quên mật khẩu?
            </a>
        `;
        passwordInput.parentNode.insertBefore(forgotBox, passwordInput.nextSibling);
    }
}

window.addEventListener('load', function() {
    injectForgotPassword();
    checkLoginStatus();
    goHome();
});

document.addEventListener('click', function(e) {
    if(e.target.closest('.auth-btn') || e.target.closest('#authButtons')) {
        setTimeout(injectForgotPassword, 200);
    }
});

function handleForgotPassword() {
    const overlay = document.createElement('div');
    overlay.id = "forgotPasswordModal";
    overlay.style = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); z-index: 100000;
        display: flex; justify-content: center; align-items: center;
        backdrop-filter: blur(3px);
    `;

    const box = document.createElement('div');
    box.style = `
        background: white; padding: 30px; border-radius: 15px;
        width: 380px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border-top: 5px solid #ed4d8d; animation: popUp 0.3s ease-out;
    `;

    box.innerHTML = `
        <h3 style="margin: 0 0 15px; color: #333;">KHÔI PHỤC MẬT KHẨU</h3>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Nhập Email bạn đã đăng ký để nhận lại mật khẩu</p>
        <input type="email" id="forgotEmailInput" placeholder="Địa chỉ Email của bạn" 
               style="width: 90%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; outline: none;">
        <div style="display: flex; gap: 10px;">
            <button id="cancelForgot" style="flex: 1; padding: 10px; border: none; border-radius: 5px; cursor: pointer; background: #eee;">Hủy</button>
            <button id="submitForgot" style="flex: 2; padding: 10px; border: none; border-radius: 5px; cursor: pointer; background: #ed4d8d; color: white; font-weight: bold;">GỬI MẬT KHẨU</button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('cancelForgot').onclick = () => document.body.removeChild(overlay);

    document.getElementById('submitForgot').onclick = function() {
        const email = document.getElementById('forgotEmailInput').value.trim();
        
        if (!email) {
            alert("Vui lòng nhập Email!");
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Định dạng Email không chính xác (phải có đuôi .com)!");
            return;
        }

        let users = JSON.parse(localStorage.getItem('dls_users') || "[]");
        const foundUser = users.find(u => u.email === email);

        if (foundUser) {
            document.body.removeChild(overlay); 
            alert("Đang xử lý yêu cầu của bạn...");

            emailjs.send("service_v3cgq5v", "template_ej5bs3g", {
                to_name: foundUser.name,
                to_email: foundUser.email,
                message: `Mật khẩu của bạn là: ${foundUser.pass}`,
                reply_to: "support@hoanglongdls.com"
            }, "MEwA1KlfQoKl_wxq_")
            .then(
                function() {
                    alert("Mật khẩu đã được gửi về Email của bạn. Hãy kiểm tra hộp thư nhé! 📧");
                },
                function(error) {
                    alert("Gửi email thất bại. Mật khẩu của bạn là: " + foundUser.pass);
                }
            );
        } else {
            alert("Email này chưa được đăng ký trong hệ thống!");
        }
    };
}

function confirmOTPAction() {
    const input = document.getElementById('otpUserInput').value.trim();
    if(input === systemOTP) {
        let users = JSON.parse(localStorage.getItem('dls_users') || "[]");
        users.push(pendingUser);
        localStorage.setItem('dls_users', JSON.stringify(users));
        localStorage.setItem('dls_session', JSON.stringify(pendingUser));
        
        alert("Xác thực thành công! Chào mừng bạn đến với Hoàng Long DLS.");
        closeModal('otpModal');
        closeModal('authModal');
        checkLoginStatus();
    } else {
        alert("Mã OTP không chính xác, vui lòng kiểm tra lại!");
    }
}

// --- HỆ THỐNG QUẢN TRỊ TOÀN DIỆN ---

// 1. Kiểm tra quyền Admin khi mở Menu
function checkAdminAccess() {
    const session = JSON.parse(localStorage.getItem('dls_session'));
    const dropdown = document.getElementById('userDropdown');
    if(session && session.email === "longdragonn005@gmail.com") {
        if(!document.getElementById('adminMenuLink')) {
            const adminDiv = document.createElement('div');
            adminDiv.id = "adminMenuLink";
            adminDiv.innerHTML = `<i class="fas fa-user-shield"></i> Quản lý hệ thống`;
            adminDiv.style.color = "var(--pink-main)";
            adminDiv.onclick = () => { 
                document.getElementById('adminModal').style.display = 'flex'; 
                switchAdminTab('products'); 
            };
            dropdown.prepend(adminDiv);
        }
    }
}
window.addEventListener('load', checkAdminAccess);

// 2. Chuyển đổi Tab trong Admin
function switchAdminTab(tab) {
    const areas = ['adminProductArea', 'adminOrderArea', 'adminUserArea'];
    const tabs = ['tabAdminPro', 'tabAdminOrder', 'tabAdminUser'];
    
    areas.forEach(a => document.getElementById(a).style.display = 'none');
    tabs.forEach(t => document.getElementById(t).classList.remove('active'));

    if(tab === 'products') {
        document.getElementById('adminProductArea').style.display = 'block';
        document.getElementById('tabAdminPro').classList.add('active');
        renderAdminProducts();
    } else if(tab === 'orders') {
        document.getElementById('adminOrderArea').style.display = 'block';
        document.getElementById('tabAdminOrder').classList.add('active');
        renderAdminOrders();
    } else if(tab === 'users') {
        document.getElementById('adminUserArea').style.display = 'block';
        document.getElementById('tabAdminUser').classList.add('active');
        renderAdminUsers();
    }
}

// 3. QUẢN LÝ SẢN PHẨM (Thêm/Sửa/Xóa)
function renderAdminProducts() {
    const body = document.getElementById('adminProductTableBody');
    body.innerHTML = allProducts.map((p, index) => `
        <tr>
            <td><img src="${p.img}" style="width:40px;"></td>
            <td>${p.name}</td>
            <td>${p.price.toLocaleString()}đ</td>
            <td>
                <button class="btn-edit" onclick="openEditProduct(${index})">Sửa</button>
                <button class="btn-del" onclick="deleteProduct(${index})">Xóa</button>
            </td>
        </tr>
    `).join('');
}

function openAddProduct() {
    document.getElementById('editProductTitle').innerText = "THÊM SẢN PHẨM MỚI";
    document.getElementById('editProductIndex').value = "-1";
    document.getElementById('editProductName').value = "";
    document.getElementById('editProductPrice').value = "";
    document.getElementById('editProductImg').value = "";
    document.getElementById('editProductModal').style.display = 'flex';
}

function openEditProduct(index) {
    const p = allProducts[index];
    document.getElementById('editProductTitle').innerText = "SỬA SẢN PHẨM";
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editProductName').value = p.name;
    document.getElementById('editProductPrice').value = p.price;
    document.getElementById('editProductImg').value = p.img;
    document.getElementById('editProductModal').style.display = 'flex';
}

function saveProduct() {
    const index = parseInt(document.getElementById('editProductIndex').value);
    const name = document.getElementById('editProductName').value;
    const price = parseInt(document.getElementById('editProductPrice').value);
    const img = document.getElementById('editProductImg').value;
    if(!name || !price || !img) return alert("Vui lòng điền đủ!");

    if(index === -1) allProducts.push({name, price, img});
    else allProducts[index] = {name, price, img};

    localStorage.setItem('dls_products', JSON.stringify(allProducts));
    alert("Thành công!");
    closeModal('editProductModal');
    renderAdminProducts();
    renderProducts(1); 
}

function deleteProduct(index) {
    if(confirm("Xóa sản phẩm này?")) {
        allProducts.splice(index, 1);
        localStorage.setItem('dls_products', JSON.stringify(allProducts));
        renderAdminProducts();
        renderProducts(1);
    }
}

// 4. QUẢN LÝ ĐƠN HÀNG & XÁC NHẬN
function renderAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('dls_orders') || "[]");
    const body = document.getElementById('adminOrderTableBody');
    
    // --- LOGIC TÍNH DOANH THU MỚI ---
    let totalRevenue = 0;
    orders.forEach(o => {
        // Chỉ cộng tiền nếu trạng thái là "Đã xác nhận"
        if (o.status === "Đã xác nhận") {
            // Loại bỏ chữ "đ" và dấu "." để chuyển thành số
            const price = parseInt(o.total.replace(/\D/g, '')) || 0;
            totalRevenue += price;
        }
    });

    // Cập nhật con số lên giao diện
    const revenueEl = document.getElementById('adminTotalRevenue');
    if (revenueEl) {
        revenueEl.innerText = totalRevenue.toLocaleString('vi-VN') + "đ";
    }
    // --------------------------------

    if(orders.length === 0) return body.innerHTML = '<tr><td colspan="5">Chưa có đơn nào</td></tr>';

    body.innerHTML = orders.slice().reverse().map((o, idx) => {
        const originalIdx = orders.length - 1 - idx;
        const isConfirmed = o.status === "Đã xác nhận";
        return `
        <tr>
            <td>${o.userEmail}</td>
            <td>${o.date}</td>
            <td style="font-size:11px;">${o.details}</td>
            <td>${o.total}</td>
            <td>
                <span style="color:${isConfirmed?'green':'orange'}">${o.status}</span><br>
                <button class="btn-confirm" ${isConfirmed?'disabled':''} onclick="confirmOrder(${originalIdx})">
                    ${isConfirmed?'Xong':'Xác nhận'}
                </button>
            </td>
        </tr>`;
    }).join('');
}

function confirmOrder(index) {
    let orders = JSON.parse(localStorage.getItem('dls_orders') || "[]");
    orders[index].status = "Đã xác nhận";
    localStorage.setItem('dls_orders', JSON.stringify(orders));
    renderAdminOrders();
}

// 5. QUẢN LÝ KHÁCH HÀNG
function renderAdminUsers() {
    const users = JSON.parse(localStorage.getItem('dls_users') || "[]");
    const body = document.getElementById('adminUserTableBody');
    
    body.innerHTML = users.map(u => {
        // Logic xác định vai trò: 
        // Nếu email là admin@gmail.com thì ghi là Admin, ngược lại là Khách hàng
        const roleText = u.email === 'longdragonn005@gmail.com' 
            ? '<span style="color: var(--pink-main); font-weight: bold;">Admin</span>' 
            : 'Khách hàng';

        return `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${roleText}</td>
            </tr>
        `;
    }).join('');
}

function toggleQR(show) {
    const qrArea = document.getElementById('qrArea');
    if (show) {
        const phone = document.getElementById('cusPhone').value.trim() || "KH";
        const name = document.getElementById('cusName').value.trim() || "DLS";
        let total = 0;
        cart.forEach(item => total += (item.price * item.quantity));

        const MY_BANK_ID = "MB"; 
        const MY_ACCOUNT_NO = "02311005231120"; // Số tài khoản của bạn
        const MY_ACCOUNT_NAME = "VU HOANG LONGLONG"; // Tên của bạn (không dấu)
        const description = encodeURIComponent(`DH ${name} ${phone}`);
        
        const qrUrl = `https://img.vietqr.io/image/MB-02311005231120-compact.png${MY_BANK_ID}-${MY_ACCOUNT_NO}-compact.jpg?amount=${total}&addInfo=${description}&accountName=${encodeURIComponent(MY_ACCOUNT_NAME)}`;
        
        document.getElementById('mbQrImg').src = qrUrl;
        document.getElementById('qrNote').innerText = `DH ${name} ${phone}`;
        qrArea.style.display = 'block';
    } else {
        qrArea.style.display = 'none';
    }
}

// --- LOGIC HIỂN THỊ CHI TIẾT SẢN PHẨM ---
let detailSelectedSize = null;
let detailQuantity = 1;
let currentDetailProduct = null;

// Hàm mở Modal Chi tiết sản phẩm
function openProductDetail(name) {
    const p = allProducts.find(item => item.name === name);
    if (!p) return;
    
    currentDetailProduct = p;
    detailSelectedSize = null;
    detailQuantity = 1;
    
    document.getElementById('detailProductName').innerText = p.name;
    document.getElementById('detailProductPrice').innerText = p.price.toLocaleString() + "đ";
    document.getElementById('detailProductImg').src = p.img;
    document.getElementById('detailQty').innerText = detailQuantity;
    
    // Đổ danh sách size (Tự động từ size 38 đến 44)
    const sizeContainer = document.getElementById('detailSizeSelection');
    let sizeHtml = '';
    for(let i = 38; i <= 44; i++) {
        sizeHtml += `<div class="size-node" id="detailSize-${i}" onclick="selectDetailSize(${i})" style="width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; font-weight: bold; background: #f9f9f9; color: #333; transition: 0.2s;">${i}</div>`;
    }
    sizeContainer.innerHTML = sizeHtml;
    
    document.getElementById('productDetailModal').style.display = 'flex';
}

// Hàm chọn Size trong Modal chi tiết
function selectDetailSize(size) {
    detailSelectedSize = size;
    for (let i = 38; i <= 44; i++) {
        const node = document.getElementById(`detailSize-${i}`);
        if (node) {
            node.style.background = '#f9f9f9';
            node.style.color = '#333';
            node.style.borderColor = '#ddd';
        }
    }
    const selectedNode = document.getElementById(`detailSize-${size}`);
    if (selectedNode) {
        selectedNode.style.background = 'var(--pink-main)';
        selectedNode.style.color = 'white';
        selectedNode.style.borderColor = 'var(--pink-main)';
    }
}

// Hàm điều chỉnh số lượng
function changeDetailQty(delta) {
    if (detailQuantity + delta >= 1) {
        detailQuantity += delta;
        document.getElementById('detailQty').innerText = detailQuantity;
    }
}

// Hàm xử lý nút "MUA NGAY"
function buyNowAction() {
    if (!detailSelectedSize) {
        alert("Vui lòng chọn size trước khi mua!");
        return;
    }
    
    if (!currentDetailProduct) return;
    
    // Thêm sản phẩm vào Giỏ hàng
    const existingItem = cart.find(item => item.name === currentDetailProduct.name && item.size === detailSelectedSize);
    if (existingItem) {
        existingItem.quantity += detailQuantity;
    } else {
        cart.push({ 
            name: currentDetailProduct.name, 
            price: currentDetailProduct.price, 
            size: detailSelectedSize, 
            quantity: detailQuantity, 
            id: Date.now() 
        });
    }
    
    updateCartUI(); // Cập nhật số lượng giỏ hàng
    closeModal('productDetailModal'); // Đóng modal chi tiết
    
    // Tự động mở Modal thanh toán giống như trải nghiệm "Mua ngay"
    if (typeof openCheckout === 'function') {
        openCheckout();
    } else if (document.getElementById('checkoutModal')) {
        document.getElementById('checkoutModal').style.display = 'flex';
    }
}

