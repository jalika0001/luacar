
// 分页全局变量
let allCarsData = [];           // 存储所有车辆数据
let filteredCarsData = [];      // 存储筛选后的车辆数据（搜索结果）
let currentPage = 1;             // 当前页码
const CARS_PER_PAGE = 20;        // 每页显示20个车（5行，每行4个）
let totalPages = 1;              // 总页数
let searchKeyword = '';          // 当前搜索关键词

/**
 * 创建车辆卡片HTML
 * @param {Object} car - 处理后的车辆数据
 * @returns {String} HTML字符串
 */
function createCarCard(car) {
    const specsHTML = `
        <div class="spec-item">
            <div class="spec-label">汽车类型</div>
            <div class="spec-value">${car.type}</div>
        </div>

        <div class="spec-item">
            <div class="spec-label">品牌</div>
            <div class="spec-value">${car.brand || car.modelId}</div>
        </div>

        <div class="spec-item">
            <div class="spec-label">编码</div>
            <div class="spec-value">${car.fieldId}</div>
        </div>
        
        <div class="spec-item">
            <div class="spec-label">具体价格：</div>
            <div class="spec-value">详询客服</div>
        </div>
    `;

    return `
        <div class="car-card" data-car-id="${car.id}" data-field-id="${car.fieldId}">
            <div class="car-image-container">
                <img class="car-image" src="${car.imageUrl}" alt="${car.modelName}" onerror="this.classList.add('error')" style="cursor: pointer; object-fit: contain;">
            </div>
            <div class="car-info">
                <h3 class="car-name">${car.year} ${car.modelName}</h3>
                <div class="car-specs">
                    ${specsHTML}
                </div>
                <div class="car-price">
                    <div class="price-text">${car.priceDisplay}</div>
                    <div class="price-label">月租范围</div>
                </div>
                <button class="reserve-btn" onclick="event.stopPropagation(); goToDetail(${car.id}, '${car.fieldId}')">查看更多信息</button>
            </div>
        </div>
    `;
}

/**
 * 跳转到详细页面
 * @param {Number} carId - 车辆ID
 * @param {String} fieldId - 车辆字段ID
 */
function goToDetail(carId, fieldId) {
    // 使用URL参数传递数据给详细页面
    // window.location.href = `1/index-detail.html?carId=${carId}&fieldId=${fieldId}`;
    window.location.href = `/car/detail?luacarId=${carId}&luacarFieldId=${fieldId}`;
}

/**
 * 加载并渲染车辆卡片
 */
async function loadAndRenderCars() {
    const carGrid = document.getElementById('carGrid');
    
    if (!carGrid) return;
    
    // 显示加载状态
    carGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">正在加载车辆信息...</div>';
    
    try {
        // 从API获取数据
        console.log('开始获取车辆数据...');
        const carsData = await API.fetchCars();
        
        console.log('获取的原始数据:', carsData);
        console.log('数据类型:', typeof carsData);
        console.log('是否为数组:', Array.isArray(carsData));
        
        if (!carsData || carsData.length === 0) {
            console.warn('没有获取到车辆数据，显示提示信息');
            carGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无车辆信息</div>';
            return;
        }
        
        console.log('数据长度:', carsData.length);
        console.log('第一条数据:', carsData[0]);
        
        // 处理所有车辆数据并存储
        const allProcessedCars = API.processMultipleCars(carsData);
        // 过滤：只显示 webStatus 为 true 的车辆
        allCarsData = allProcessedCars.filter(car => car.webStatus === true);
        
        console.log('处理后的总数据(已过滤):', allCarsData);
        console.log('原始车辆总数:', allProcessedCars.length);
        console.log('发布的车辆数:', allCarsData.length);
        console.log('未发布的车辆数:', allProcessedCars.length - allCarsData.length);
        
        // 计算总页数
        totalPages = Math.ceil(allCarsData.length / CARS_PER_PAGE);
        console.log('总页数:', totalPages);
        
        // 初始化筛选数据为所有车辆
        filteredCarsData = allCarsData;
        
        // 重置到第一页
        currentPage = 1;
        
        // 渲染第一页数据
        renderCurrentPage();
        
        // 生成分页按钮
        generatePaginationButtons();
        
        console.log('车辆卡片和分页渲染完成');
        
    } catch (error) {
        console.error('Error loading cars:', error);
        console.error('错误堆栈:', error.stack);
        carGrid.innerHTML = `<div style="text-align: center; padding: 40px; color: red;">
            加载失败: ${error.message}<br>
            <small>请在开发者工具中查看控制台获取详细错误信息</small>
        </div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 简单的图片加载淡入效果
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.8s ease-in-out';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
        // 兼容已经加载完成的图片
        if (img.complete) img.style.opacity = '1';
    });

    // 返回顶部按钮功能
    const topBtn = document.querySelector('.float-top');
    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

/**
 * 执行搜索和过滤车辆数据
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchKeyword = searchInput.value.trim().toLowerCase();
    console.log('🔍 开始搜索:', searchKeyword);
    
    // 如果搜索框为空，显示所有车辆
    if (searchKeyword === '') {
        filteredCarsData = [...allCarsData];
        console.log('搜索框为空，显示所有车辆');
    } else {
        // 根据搜索关键词过滤车辆
        // 搜索范围：汽车类型、品牌、型号、燃料类型、编号、牌照
        filteredCarsData = allCarsData.filter(car => {
            const keyword = searchKeyword;
            return (
                (car.type && car.type.toLowerCase().includes(keyword)) ||
                (car.brand && car.brand.toLowerCase().includes(keyword)) ||
                (car.modelId && car.modelId.toLowerCase().includes(keyword)) ||
                (car.modelName && car.modelName.toLowerCase().includes(keyword)) ||
                (car.fuelType && car.fuelType.toLowerCase().includes(keyword)) ||
                (car.licensePlate && car.licensePlate.toLowerCase().includes(keyword)) ||
                (car.fieldId && car.fieldId.toLowerCase().includes(keyword)) ||
                (car.id && car.id.toString().includes(keyword))
            );
        });
        
        console.log(`✅ 搜索完成，找到 ${filteredCarsData.length} 条结果`);
    }
    
    // 重新计算总页数
    totalPages = Math.ceil(filteredCarsData.length / CARS_PER_PAGE);
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新渲染
    renderCurrentPage();
    generatePaginationButtons();
}

/**
 * 渲染当前页的车辆卡片
 */
function renderCurrentPage() {
    const carGrid = document.getElementById('carGrid');
    
    if (!carGrid) return;
    
    // 计算当前页的起始和结束索引
    const startIndex = (currentPage - 1) * CARS_PER_PAGE;
    const endIndex = startIndex + CARS_PER_PAGE;
    
    // 获取当前页的车辆数据（使用筛选后的数据）
    const pageData = filteredCarsData.slice(startIndex, endIndex);
    
    console.log(`显示第 ${currentPage} 页，车辆数: ${pageData.length}`);
    
    if (pageData.length === 0) {
        carGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">未找到匹配的车辆</div>';
        return;
    }
    
    // 渲染卡片
    carGrid.innerHTML = pageData.map(car => createCarCard(car)).join('');
    
    // 更新分页信息
    updatePaginationInfo();
    
    // 重新绑定卡片事件
    document.querySelectorAll('.car-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.reserve-btn')) return;

            const carId = this.getAttribute('data-car-id');
            const fieldId = this.getAttribute('data-field-id');

            if (carId && fieldId) {
                goToDetail(carId, fieldId);
            }
        });
    });
}

/**
 * 生成分页按钮
 */
function generatePaginationButtons() {
    const pageNumbers = document.getElementById('pageNumbers');
    
    if (!pageNumbers) return;
    
    pageNumbers.innerHTML = '';
    
    // 显示分页按钮逻辑
    let buttons = [];
    
    if (totalPages <= 5) {
        // 如果总页数 <= 5，显示所有页码
        buttons = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
        // 否则显示第一页、当前页周围的页码、最后一页
        buttons.push(1);
        
        // 显示当前页前后各1页
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        if (start > 2) buttons.push('...');
        
        for (let i = start; i <= end; i++) {
            buttons.push(i);
        }
        
        if (end < totalPages - 1) buttons.push('...');
        buttons.push(totalPages);
    }
    
    // 创建按钮
    buttons.forEach(btn => {
        if (btn === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '8px 4px';
            pageNumbers.appendChild(span);
        } else {
            const button = document.createElement('button');
            button.textContent = btn;
            button.className = 'page-btn';
            if (btn === currentPage) {
                button.classList.add('active');
            }
            button.onclick = () => goToPage(btn);
            pageNumbers.appendChild(button);
        }
    });
}

/**
 * 更新分页信息文本
 */
function updatePaginationInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
    }
    
    // 更新上一页/下一页按钮状态
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

/**
 * 下一页
 */
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        generatePaginationButtons();
    }
}

/**
 * 上一页
 */
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        generatePaginationButtons();
    }
}

/**
 * 跳转到指定页
 */
function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        renderCurrentPage();
        generatePaginationButtons();
    }
}

/**
 * 平滑滚动到顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 页面加载完成后加载车辆数据
document.addEventListener('DOMContentLoaded', function() {
    // 初始化圆形分页指示器
    initBannerDots();
    
    // 加载和渲染汽车数据
    loadAndRenderCars();
    
    // 设置搜索框事件监听
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Enter键搜索
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        // 实时搜索（可选：每次输入时自动搜索）
        // 取消注释下面这行可以实现实时搜索
        // searchInput.addEventListener('input', performSearch);
    }
});