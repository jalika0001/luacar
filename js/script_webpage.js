function toggleMenu() {
    const menu = document.getElementById('side-menu');
    menu.classList.toggle('active');
    // 点击外部关闭菜单
    document.addEventListener('click', function(event) {
        const navbar = document.querySelector('.navbar');
        if (!menu.contains(event.target) && !navbar.contains(event.target)) {
            menu.classList.remove('active');
        }
    });
}

// 2. 语言下拉框
function toggleLang() {
    let dd = document.getElementById('lang-dropdown');
    dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
}

// 3. 业务选项卡切换
function switchTab(type) {
    const rentContent = document.getElementById('rent-content');
    const moreContent = document.getElementById('more-content');
    const buttons = document.querySelectorAll('.tab-header button');
    
    // 移除所有活跃状态
    rentContent.classList.remove('active');
    moreContent.classList.remove('active');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 添加新的活跃状态
    if (type === 'rent') {
        rentContent.classList.add('active');
        buttons[0].classList.add('active');
    } else {
        moreContent.classList.add('active');
        buttons[1].classList.add('active');
    }
}

// 4. Banner 自动滚动和分页
let bannerIndex = 0;
const bannerSlider = document.getElementById('slider');
const bannerImages = bannerSlider ? bannerSlider.querySelectorAll('.banner-slider img') : [];
const totalImages = bannerImages.length;
const bannerPaginationButtons = document.querySelectorAll('.banner-pagination button');
const pageInput = document.querySelector('.page-input');
const bannerDotsContainer = document.getElementById('bannerDotsContainer');

function initBannerDots() {
    if (!bannerDotsContainer || totalImages === 0) return;
    bannerDotsContainer.innerHTML = '';
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.className = 'banner-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function() {
            bannerIndex = i;
            updateBannerDisplay();
        });
        bannerDotsContainer.appendChild(dot);
    }
}

function rotateBanner() {
    if (totalImages === 0) return;
    bannerIndex = (bannerIndex + 1) % totalImages;
    updateBannerDisplay();
}

function updateBannerDisplay() {
    if (!bannerSlider || totalImages === 0) return;
    bannerSlider.style.transform = `translateX(-${bannerIndex * 100}%)`;

    bannerPaginationButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === bannerIndex) {
            btn.classList.add('active');
        }
    });

    const bannerDots = document.querySelectorAll('.banner-dot');
    bannerDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === bannerIndex) {
            dot.classList.add('active');
        }
    });
}

function prevBanner() {
    if (totalImages === 0) return;
    bannerIndex = (bannerIndex - 1 + totalImages) % totalImages;
    updateBannerDisplay();
}

function nextBanner() {
    if (totalImages === 0) return;
    bannerIndex = (bannerIndex + 1) % totalImages;
    updateBannerDisplay();
}

if (bannerSlider && totalImages > 0) {
    initBannerDots();
    updateBannerDisplay();
}

// 分页按钮点击事件
// bannerPaginationButtons.forEach((btn, index) => {
//     btn.addEventListener('click', function() {
//         bannerIndex = index;
//         updateBannerDisplay();
//     });
// });

// 页码输入框回车事件
// if (pageInput) {
//     pageInput.addEventListener('keypress', function(event) {
//         if (event.key === 'Enter') {
//             let inputValue = parseInt(this.value);
//             if (inputValue > 0 && inputValue <= 31) {
//                 bannerIndex = inputValue - 1;
//                 updateBannerDisplay();
//                 this.value = '';
//             } else {
//                 alert('请输入1-31之间的页码');
//                 this.value = '';
//             }
//         }
//     });
// }

// 每2秒自动轮播一次
setInterval(rotateBanner, 2000);

// 5. FAQ 点击展开效果
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.background = '#f5f5f5';
        setTimeout(() => {
            this.style.background = '';
        }, 200);
    });
});

// 6. 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
