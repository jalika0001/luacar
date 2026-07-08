// 长租自驾页面JavaScript逻辑

/**
 * 字段映射说明（每页显示30个车辆卡）：
 * - 汽车类型 -> car.type
 * - 品牌 -> car.brand_id
 * - 月租范围 -> car.priceDisplay
 * - 燃料类型 -> car.fuelType (从Odoo API获取后已由api.js中的formatFuelType转换为中文)
 * - 发动机排气量 -> car.power (x_engine_size, 小数格式如1.5、2.0)
 * - 发动机汽缸数量 -> car.powerUnit (x_cylinder)
 * - 座位数 -> car.seats
 */

// 全局状态
let allCars = [];
let filteredCars = [];
let currentPage = 1;
const itemsPerPage = 30;
let currentSort = { field: null, direction: null };
let searchKeyword = ''; // 搜索关键词
let originalPageTitle = '长租自驾'; // 保存原始页面标题

// 筛选条件存储
const filters = {
    carType: [],
    brand: [],
    fuelType: [],
    priceRangeMin: null,
    priceRangeMax: null,
    powerValues: [],      // 发动机排气量具体值数组
    powerUnits: [],       // 发动机汽缸数量数组
    seatsList: []         // 座位数数组
};

/**
 * URL的 type 参数 -> 车辆类型中文标签，与 applyAutoFilters() 和
 * 顶部分类导航（.webf-bar ul）共用同一份数据源。
 * 例如 ?type=business&title=商务车 会命中 carType.business
 */
const carTypeMap = {
    'offroad': '越野车',
    'business': '商务车',
    'sedan': '轿车',
    'pickup': '皮卡车',
    'business-charter': '商务车'
};

// 初始化页面
document.addEventListener('DOMContentLoaded', async () => {
    console.log('长租自驾页面加载中...');
    
    // 更新页面标题（根据URL参数）
    updatePageTitle();
    
    // 渲染顶部分类导航（数据来自 carTypeMap）
    renderNavTabs();
    
    // 设置导航和菜单功能
    setupEventListeners();
    
    // 加载车辆数据
    await loadCars();
    
    // 从API数据动态生成各个筛选选项
    initializeBrandFilters();
    initializeEngineDisplacementFilters();
    initializeCylinderFilters();
    initializeSeatsFilters();
    
    // 根据URL参数应用自动过滤
    applyAutoFilters();
    
    // 初始化显示
    applyFiltersAndDisplay();
});


// 1. 侧边栏开关
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


/**
 * 从API数据动态生成品牌筛选选项（按车数量排序，从多到少）
 */
function initializeBrandFilters() {
    console.log('===== 开始初始化品牌筛选 =====');
    console.log('allCars 数据:', allCars);
    
    // 统计每个品牌的车数量
    const brandCount = {};
    allCars.forEach((car, index) => {
        if (car.brand_id && car.brand_id.trim()) {
            const brand = car.brand_id.trim();
            brandCount[brand] = (brandCount[brand] || 0) + 1;
        }
    });

    console.log('品牌统计:', brandCount);

    // 转换为数组，按车数量排序（从多到少）
    const brandArray = Object.entries(brandCount)
        .sort((a, b) => b[1] - a[1]) // 按数量降序排序
        .map(([brand, count]) => ({ brand, count }));

    console.log('===== 提取到的品牌列表（按数量排序） =====');
    console.log('品牌数量:', brandArray.length);
    console.log('品牌列表:', brandArray);

    // 查找品牌section
    const filterGroups = document.querySelectorAll('.filter-group');
    console.log('找到的filter-group数量:', filterGroups.length);
    
    let brandSection = null;
    for (let i = 0; i < filterGroups.length; i++) {
        const title = filterGroups[i].querySelector('.filter-group-title span');
        console.log(`filter-group ${i}:`, title?.textContent);
        if (title && title.textContent === '品牌') {
            brandSection = filterGroups[i].querySelector('.filter-group-items');
            console.log('找到品牌section在index:', i);
            break;
        }
    }

    if (!brandSection) {
        console.error('❌ 未找到品牌筛选section');
        return;
    }

    // 清空原有的品牌选项
    brandSection.innerHTML = '';
    console.log('已清空原有的选项');

    // 添加动态生成的品牌选项
    brandArray.forEach(({ brand, count }, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'brand';
        checkbox.value = brand;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${brand}`));
        brandSection.appendChild(label);
        console.log(`添加品牌 ${i}:`, brand, `数量: ${count}`);
    });

    console.log('✅ 品牌筛选选项已生成,共', brandArray.length, '个品牌');
    console.log('===== 品牌筛选初始化完成 =====');
}

/**
 * 从API数据动态生成发动机排气量筛选选项
 * 从实际数据提取所有可用的排气量值，按值排序显示
 */
function initializeEngineDisplacementFilters() {
    console.log('===== 开始初始化发动机排气量筛选 =====');
    
    // 从allCars中提取唯一的发动机排气量值，并跟踪车数
    const powerMap = new Map(); // key: 排气量值(数字), value: 车数
    
    allCars.forEach(car => {
        if (car.power !== null && car.power !== undefined && car.power !== 0) {
            // car.power可能是字符串或数字，确保转换为数字
            const powerValue = typeof car.power === 'string' ? parseFloat(car.power) : car.power;
            if (!isNaN(powerValue)) {
                powerMap.set(powerValue, (powerMap.get(powerValue) || 0) + 1);
            }
        }
    });

    // 转换为排序的数组（按排气量从小到大)
    const powerArray = Array.from(powerMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value - b.value);
    
    console.log('提取到的排气量值:', powerArray);
    
    // 查找发动机排气量section
    const filterGroups = document.querySelectorAll('.filter-group');
    let powerSection = null;
    
    for (let i = 0; i < filterGroups.length; i++) {
        const title = filterGroups[i].querySelector('.filter-group-title span');
        if (title && title.textContent === '发动机排气量 (L)') {
            powerSection = filterGroups[i].querySelector('.filter-group-items');
            console.log('找到发动机排气量section在index:', i);
            break;
        }
    }

    if (!powerSection) {
        console.error('未找到发动机排气量筛选section');
        return;
    }

    // 清空原有的选项
    powerSection.innerHTML = '';
    console.log('已清空原有的选项');

    // 如果没有排气量数据，显示提示
    if (powerArray.length === 0) {
        powerSection.innerHTML = '<p style="color: #999; padding: 10px;">无排气量数据</p>';
        return;
    }

    // 添加排气量选项
    powerArray.forEach(({ value, count }, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'powerValue';
        // 确保value总是数字，以防万一
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        checkbox.value = numValue.toString();
        checkbox.dataset.value = numValue;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${numValue.toFixed(1)}L`));
        powerSection.appendChild(label);
        console.log(`添加排气量 ${i}:`, numValue, `车数: ${count}`);
    });

    console.log('成功生成发动机排气量筛选选项，共', powerArray.length, '个');
    console.log('===== 发动机排气量筛选初始化完成 =====');
}

/**
 * 从API数据动态生成汽缸数量筛选选项
 */
function initializeCylinderFilters() {
    console.log('===== 开始初始化汽缸数量筛选 =====');
    
    // 从allCars中提取唯一的汽缸数量，并跟踪车数
    const cylinderMap = new Map(); // key: 汽缸数(数字), value: 车数
    
    allCars.forEach(car => {
        if (car.powerUnit !== null && car.powerUnit !== undefined && car.powerUnit !== 0) {
            // car.powerUnit可能是字符串或数字，确保转换为数字
            const cylinderValue = typeof car.powerUnit === 'string' ? parseInt(car.powerUnit) : car.powerUnit;
            if (!isNaN(cylinderValue)) {
                cylinderMap.set(cylinderValue, (cylinderMap.get(cylinderValue) || 0) + 1);
            }
        }
    });

    // 转换为排序的数组（按汽缸数从小到大)
    const cylinderArray = Array.from(cylinderMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value - b.value);
    
    console.log('提取到的汽缸数量:', cylinderArray);

    // 查找汽缸数量section
    const filterGroups = document.querySelectorAll('.filter-group');
    let cylinderSection = null;
    
    for (let i = 0; i < filterGroups.length; i++) {
        const title = filterGroups[i].querySelector('.filter-group-title span');
        if (title && title.textContent === '发动机汽缸数量') {
            cylinderSection = filterGroups[i].querySelector('.filter-group-items');
            console.log('找到汽缸数量section在index:', i);
            break;
        }
    }

    if (!cylinderSection) {
        console.error('未找到汽缸数量筛选section');
        return;
    }

    // 清空原有的选项
    cylinderSection.innerHTML = '';
    console.log('已清空原有的选项');

    // 如果没有汽缸数据，显示提示
    if (cylinderArray.length === 0) {
        cylinderSection.innerHTML = '<p style="color: #999; padding: 10px;">无汽缸数据</p>';
        return;
    }

    // 添加汽缸数量选项
    cylinderArray.forEach(({ value, count }, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'powerUnit';
        // 确保value总是数字
        const numValue = typeof value === 'string' ? parseInt(value) : value;
        checkbox.value = numValue.toString();
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${numValue}缸`));
        cylinderSection.appendChild(label);
        console.log(`添加汽缸数量 ${i}:`, numValue, `车数: ${count}`);
    });

    console.log('成功生成汽缸数量筛选选项，共', cylinderArray.length, '个');
    console.log('===== 汽缸数量筛选初始化完成 =====');
}

/**
 * 从API数据动态生成座位数筛选选项
 */
function initializeSeatsFilters() {
    console.log('===== 开始初始化座位数筛选 =====');
    
    // 从allCars中提取唯一的座位数，并跟踪车数
    const seatsMap = new Map(); // key: 座位数(数字), value: 车数
    
    allCars.forEach(car => {
        if (car.seats !== null && car.seats !== undefined && car.seats !== 0) {
            // car.seats可能是字符串或数字，确保转换为数字
            const seatsValue = typeof car.seats === 'string' ? parseInt(car.seats) : car.seats;
            if (!isNaN(seatsValue)) {
                seatsMap.set(seatsValue, (seatsMap.get(seatsValue) || 0) + 1);
            }
        }
    });

    // 转换为排序的数组（按座位数从小到大)
    const seatsArray = Array.from(seatsMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value - b.value);
    
    console.log('提取到的座位数:', seatsArray);

    // 查找座位数section
    const filterGroups = document.querySelectorAll('.filter-group');
    let seatsSection = null;
    
    for (let i = 0; i < filterGroups.length; i++) {
        const title = filterGroups[i].querySelector('.filter-group-title span');
        if (title && title.textContent === '座位数') {
            seatsSection = filterGroups[i].querySelector('.filter-group-items');
            console.log('找到座位数section在index:', i);
            break;
        }
    }

    if (!seatsSection) {
        console.error('未找到座位数筛选section');
        return;
    }

    // 清空原有的选项
    seatsSection.innerHTML = '';
    console.log('已清空原有的选项');

    // 如果没有座位数数据，显示提示
    if (seatsArray.length === 0) {
        seatsSection.innerHTML = '<p style="color: #999; padding: 10px;">无座位数数据</p>';
        return;
    }

    // 添加座位数选项
    seatsArray.forEach(({ value, count }, i) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'seats';
        // 确保value总是数字
        const numValue = typeof value === 'string' ? parseInt(value) : value;
        checkbox.value = numValue.toString();
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${numValue}座`));
        seatsSection.appendChild(label);
        console.log(`添加座位数 ${i}:`, numValue, `车数: ${count}`);
    });

    console.log('成功生成座位数筛选选项，共', seatsArray.length, '个');
    console.log('===== 座位数筛选初始化完成 =====');
}

/**
 * 更新页面标题（根据URL参数中的title）
 */
function updatePageTitle() {
    const params = new URLSearchParams(window.location.search);
    const titleParam = params.get('title');
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && titleParam) {
        // 使用URL参数中的title替换默认标题
        const decodedTitle = decodeURIComponent(titleParam);
        originalPageTitle = decodedTitle; // 保存原始标题
        pageTitle.textContent = decodedTitle;
        document.title = decodedTitle + ''; // 同时更新浏览器标签页标题
        console.log('✅ 页面标题已更新为:', decodedTitle);
    } else if (pageTitle) {
        // 保持默认标题
        originalPageTitle = '长租自驾'; // 保存原始标题
        pageTitle.textContent = '长租自驾';
        document.title = '长租自驾 ';
        console.log('✅ 使用默认页面标题');
    }
}

/**
 * 根据搜索关键词更新页面标题
 */
function updateTitleBySearch(keyword) {
    const pageTitle = document.getElementById('pageTitle');
    if (!pageTitle) return;
    
    if (keyword && keyword.trim() !== '') {
        // 搜索框有内容时，更新标题显示搜索结果
        const displayText = `搜索: ${keyword}`;
        pageTitle.textContent = displayText;
        document.title = displayText + ' - 盈信租车';
        console.log('✅ 页面标题已更新为搜索结果:', displayText);
    } else {
        // 搜索框为空时，恢复原始标题
        pageTitle.textContent = originalPageTitle;
        document.title = originalPageTitle + ' - 盈信租车';
        console.log('✅ 页面标题已恢复为原始标题:', originalPageTitle);
    }
}

/**
 * 根据URL参数自动应用筛选条件
 */
function applyAutoFilters() {
    // 获取URL参数中的type值
    const urlParams = new URLSearchParams(window.location.search);
    const filterType = urlParams.get('type');
    
    // 检查是否有自定义的筛选参数（从URL中解码）
    const hasCustomFilters = urlParams.has('carType') || urlParams.has('brand') || 
                            urlParams.has('fuelType') || urlParams.has('priceMin') || 
                            urlParams.has('priceMax') || urlParams.has('power') || 
                            urlParams.has('cylinder') || urlParams.has('seats');
    
    console.log('是否有自定义筛选:', hasCustomFilters);
    
    // 先清空所有checkbox和filters
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // 清空所有范围输入框
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // 重置所有过滤条件
    filters.carType = [];
    filters.brand = [];
    filters.fuelType = [];
    filters.priceRangeMin = null;
    filters.priceRangeMax = null;
    filters.powerValues = [];
    filters.powerUnits = [];
    filters.seatsList = [];
    
    // 如果有自定义筛选参数，从URL中解码并应用
    if (hasCustomFilters) {
        console.log('检测到自定义筛选参数，从URL中解码...');
        decodeURLFilters();
        applyURLFiltersToUI();
        return;
    }
    
    // 否则，根据type值应用默认过滤
    if (!filterType) {
        console.log('没有URL参数，不应用自动过滤');
        return;
    }
    
    console.log('根据URL参数应用自动过滤，type:', filterType);
    
    // 根据不同的type清空之前的过滤条件，并只保留相关的过滤
    const carTypeCheckboxes = document.querySelectorAll('input[name="carType"]');
    
    // 根据type值自动选择对应的车型过滤条件
    if (carTypeMap[filterType]) {
        carTypeCheckboxes.forEach(cb => {
            if (cb.value === carTypeMap[filterType]) {
                cb.checked = true;
            }
        });
        // 同时更新filters.carType
        filters.carType = [carTypeMap[filterType]];
        console.log('已选择车型过滤:', carTypeMap[filterType]);
    }
    
    // long-term、daily和filter都表示显示所有车辆，无需额外过滤
    if (filterType === 'long-term' || filterType === 'daily' || filterType === 'filter') {
        console.log('显示全部车辆，无特殊过滤');
        // 这些情况下filters保持空的，会显示所有车辆
    }
    
    console.log('autoFilters完成后，filters对象:', filters);
}

/**
 * 顶部分类导航（.webf-bar ul）：直接从 carTypeMap 生成列表项，
 * 前面加一个"全部"用来显示所有车辆（不带 type 参数）。
 * carTypeMap 里如果有多个 key 对应同一个中文标签（如 business / business-charter
 * 都是"商务车"），只生成一个按钮，用第一个出现的 key 作为 type 值。
 */
function buildNavTabsFromCarTypeMap() {
    const tabs = [{ type: '', label: '全部' }];
    const seenLabels = new Set();

    Object.keys(carTypeMap).forEach(function (key) {
        const label = carTypeMap[key];
        if (seenLabels.has(label)) return; // 去重，避免重复按钮
        seenLabels.add(label);
        tabs.push({ type: key, label: label });
    });

    return tabs;
}

/**
 * 渲染顶部分类导航
 */
function renderNavTabs() {
    const container = document.querySelector('.webf-bar .wbfb-box ul');
    if (!container) {
        console.warn('未找到 .webf-bar .wbfb-box ul，跳过导航渲染');
        return;
    }

    const tabs = buildNavTabsFromCarTypeMap();

    container.innerHTML = tabs.map(function (tab) {
        return `<li class="btn" data-type="${tab.type}" data-title="${tab.label}"><span>${tab.label}</span></li>`;
    }).join('');

    syncActiveNavTab();
}

/**
 * 根据当前URL的 type 参数，给对应的导航项加上 active（"全部"对应空type）
 */
function syncActiveNavTab() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentType = urlParams.get('type') || '';

    document.querySelectorAll('.webf-bar .wbfb-box ul li.btn').forEach(function (li) {
        const liType = li.getAttribute('data-type') || '';
        li.classList.toggle('active', liType === currentType);
    });
}

/**
 * 点击顶部分类导航项：更新URL（?type=xxx&title=xxx），
 * 不刷新页面，直接复用现有的筛选/渲染逻辑。
 */
function handleNavTabClick(li) {
    const type = li.getAttribute('data-type') || '';
    const title = li.getAttribute('data-title') || '';

    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (type && title) params.set('title', title);

    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.pushState({ type: type }, '', newURL);

    updatePageTitle();
    applyAutoFilters();
    applyFiltersAndDisplay();
    syncActiveNavTab();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 顶部分类导航点击
    document.addEventListener('click', (e) => {
        const navTab = e.target.closest('.webf-bar .wbfb-box ul li.btn');
        if (navTab) {
            handleNavTabClick(navTab);
        }
    });

    // 排序按钮（名称/时间/价格）
    initSortButtons();

    // 搜索输入框 - Enter键搜索
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Enter键搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        // 实时监听搜索框输入，动态更新页面标题
        searchInput.addEventListener('input', (e) => {
            const currentKeyword = e.target.value.trim();
            updateTitleBySearch(currentKeyword);
            console.log('搜索框内容改变，当前关键词:', currentKeyword);
        });
    }

    // 点击筛选菜单外部关闭菜单
    document.addEventListener('click', (e) => {
        const filterMenu = document.getElementById('filterMenu');
        const filterBtn = document.querySelector('.filter-btn');
        const sideMenu = document.getElementById('side-menu');
        const navLeft = document.querySelector('.nav-left');
        
        // 点击侧菜单时关闭筛选菜单
        if (sideMenu && sideMenu.contains(e.target)) {
            if (filterMenu && filterMenu.classList.contains('active')) {
                filterMenu.classList.remove('active');
            }
        }
        
        // 点击筛选菜单外部关闭菜单
        if (filterMenu && filterBtn && !filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
            if (filterMenu.classList.contains('active')) {
                filterMenu.classList.remove('active');
            }
        }
    });

    // 防止筛选菜单内部点击触发外部关闭
    const filterMenu = document.getElementById('filterMenu');
    if (filterMenu) {
        filterMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

/**
 * 加载车辆数据
 */
async function loadCars() {
    try {
        console.log('开始加载车辆数据...');
        console.log('window.API 存在?', !!window.API);
        console.log('window.API.fetchCars 存在?', !!window.API?.fetchCars);
        
        const cars = await window.API.fetchCars();
        console.log('从API获取的原始数据:', cars);
        
        if (!Array.isArray(cars) || cars.length === 0) {
            console.warn('未获取到车辆数据，使用模拟数据');
            allCars = generateMockCars(30); // 生成模拟数据
        } else {
            // 处理并排序车辆数据
            console.log('正在处理', cars.length, '条车辆数据...');
            const allProcessedCars = window.API.processMultipleCars(cars);
            // 过滤：只显示 webStatus 为 true 的车辆
            allCars = allProcessedCars.filter(car => car.webStatus === true);
            console.log('原始车辆数:', allProcessedCars.length, '已发布车辆数:', allCars.length);
        }
        
        console.log('✅ 车辆数据加载完成，总数:', allCars.length);
        filteredCars = JSON.parse(JSON.stringify(allCars));
        console.log('filteredCars 已初始化，总数:', filteredCars.length);
    } catch (error) {
        console.error('❌ 加载车辆数据失败:', error);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
        allCars = generateMockCars(30);
        console.log('使用模拟数据，总数:', allCars.length);
    }
}

/**
 * 生成模拟车辆数据（用于测试）
 */
function generateMockCars(count) {
    const carTypes = ['越野车/SUV', '轿车', '商务车', '跑车/豪车', '皮卡'];
    const brands = ['丰田', '路虎', '宝马', '奔驰', '保时捷', '福特', '大众', '奥迪'];
    const fuelTypes = ['汽油', '柴油', '全混合', '插电式混合动力汽车 汽油', '电子启动'];
    const priceRanges = ['0-500', '501-800', '801-1000', '1001-1300', '1301-1600', '1601-2000', '2001-2500', '2501以上'];
    const modelNames = [
        'Alphard',
        'Land Cruiser',
        '7 Series',
        'C-Class',
        'Panamera',
        'Ranger',
        'Passat',
        'A6'
    ];
    const cylinderOptions = [4, 6, 8, 12]; // 汽缸数选项

    const cars = [];
    for (let i = 1; i <= count; i++) {
        cars.push({
            id: i,
            licensePlate: `粤A${String(i).padStart(5, '0')}`,
            year: 2020 + Math.floor(i / 10),
            modelId: brands[i % brands.length],
            brand_id: brands[i % brands.length],  // 添加 brand_id 字段
            modelName: modelNames[i % modelNames.length],
            type: carTypes[i % carTypes.length],
            fuelType: fuelTypes[i % fuelTypes.length],
            seats: [5, 6, 7, 8][i % 4],
            fieldId: `field${i}`,
            monthlyFee: 800 + (i % 20) * 100,
            power: 1.5 + (i % 10) * 0.5,
            powerUnit: cylinderOptions[i % cylinderOptions.length],  // 更多样的汽缸数
            imageUrl: `https://via.placeholder.com/400x300?text=Car+${i}`,
            allImages: [`https://via.placeholder.com/400x300?text=Car+${i}`],
            priceDisplay: priceRanges[i % priceRanges.length]
        });
    }
    return cars;
}

/**
 * 切换筛选菜单
 */
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filterMenu');
    if (filterMenu) {
        filterMenu.classList.toggle('active');
        
        // 当菜单打开时禁止背景滚动，关闭时恢复
        if (filterMenu.classList.contains('active')) {
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // 创建或显示遮罩层
            let overlay = document.querySelector('.filter-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'filter-overlay';
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'block';
            
            // 点击遮罩层关闭菜单
            overlay.onclick = toggleFilterMenu;
        } else {
            // 恢复背景滚动
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            // 隐藏遮罩层
            let overlay = document.querySelector('.filter-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
    }
}

/**
 * 执行搜索
 */
/**
 * 执行搜索
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchKeyword = searchInput.value;
        console.log('🔍 开始搜索:', searchKeyword);
        
        // 根据搜索关键词更新页面标题
        updateTitleBySearch(searchKeyword);
        
        applyFiltersAndDisplay();
    }
}

/**
 * 切换筛选组的展开/收起
 */
function toggleFilterGroup(titleElement) {
    const parent = titleElement.parentElement;
    const items = parent.querySelector('.filter-group-items');
    
    if (items) {
        items.classList.toggle('active');
        titleElement.classList.toggle('active');
    }
}

/**
 * 将筛选条件编码为URL查询参数
 */
function encodeFiltersToURL() {
    const params = new URLSearchParams();
    
    // 添加现有的type和title参数
    const currentParams = new URLSearchParams(window.location.search);
    const type = currentParams.get('type');
    const title = currentParams.get('title');
    if (type) params.set('type', type);
    if (title) params.set('title', title);
    
    // 编码筛选条件
    if (filters.carType.length > 0) {
        params.set('carType', filters.carType.join('|'));
    }
    if (filters.brand.length > 0) {
        params.set('brand', filters.brand.join('|'));
    }
    if (filters.fuelType.length > 0) {
        params.set('fuelType', filters.fuelType.join('|'));
    }
    if (filters.priceRangeMin !== null) {
        params.set('priceMin', filters.priceRangeMin);
    }
    if (filters.priceRangeMax !== null) {
        params.set('priceMax', filters.priceRangeMax);
    }
    if (filters.powerValues.length > 0) {
        params.set('power', filters.powerValues.join('|'));
    }
    if (filters.powerUnits.length > 0) {
        params.set('cylinder', filters.powerUnits.join('|'));
    }
    if (filters.seatsList.length > 0) {
        params.set('seats', filters.seatsList.join('|'));
    }
    
    return params.toString();
}

/**
 * 从URL查询参数解码筛选条件
 */
function decodeURLFilters() {
    const params = new URLSearchParams(window.location.search);
    
    // 解码各个筛选条件
    const carTypeParam = params.get('carType');
    if (carTypeParam) {
        filters.carType = carTypeParam.split('|').filter(v => v);
    }
    
    const brandParam = params.get('brand');
    if (brandParam) {
        filters.brand = brandParam.split('|').filter(v => v);
    }
    
    const fuelTypeParam = params.get('fuelType');
    if (fuelTypeParam) {
        filters.fuelType = fuelTypeParam.split('|').filter(v => v);
    }
    
    const priceMinParam = params.get('priceMin');
    if (priceMinParam) {
        filters.priceRangeMin = parseFloat(priceMinParam);
    }
    
    const priceMaxParam = params.get('priceMax');
    if (priceMaxParam) {
        filters.priceRangeMax = parseFloat(priceMaxParam);
    }
    
    const powerParam = params.get('power');
    if (powerParam) {
        filters.powerValues = powerParam.split('|').map(v => parseFloat(v)).filter(v => !isNaN(v));
    }
    
    const cylinderParam = params.get('cylinder');
    if (cylinderParam) {
        filters.powerUnits = cylinderParam.split('|').map(v => parseInt(v)).filter(v => !isNaN(v));
    }
    
    const seatsParam = params.get('seats');
    if (seatsParam) {
        filters.seatsList = seatsParam.split('|').map(v => parseInt(v)).filter(v => !isNaN(v));
    }
    
    console.log('✅ 从URL解码的筛选条件:', filters);
}

/**
 * 根据URL参数自动检查对应的筛选项
 */
function applyURLFiltersToUI() {
    // 检查carType
    if (filters.carType.length > 0) {
        document.querySelectorAll('input[name="carType"]').forEach(cb => {
            cb.checked = filters.carType.includes(cb.value);
        });
    }
    
    // 检查brand
    if (filters.brand.length > 0) {
        document.querySelectorAll('input[name="brand"]').forEach(cb => {
            cb.checked = filters.brand.includes(cb.value);
        });
    }
    
    // 检查fuelType
    if (filters.fuelType.length > 0) {
        document.querySelectorAll('input[name="fuelType"]').forEach(cb => {
            cb.checked = filters.fuelType.includes(cb.value);
        });
    }
    
    // 检查powerValue（引擎排气量）
    if (filters.powerValues.length > 0) {
        document.querySelectorAll('input[name="powerValue"]').forEach(cb => {
            cb.checked = filters.powerValues.includes(parseFloat(cb.value));
        });
    }
    
    // 检查powerUnit（汽缸数）
    if (filters.powerUnits.length > 0) {
        document.querySelectorAll('input[name="powerUnit"]').forEach(cb => {
            cb.checked = filters.powerUnits.includes(parseInt(cb.value));
        });
    }
    
    // 检查seats（座位数）
    if (filters.seatsList.length > 0) {
        document.querySelectorAll('input[name="seats"]').forEach(cb => {
            cb.checked = filters.seatsList.includes(parseInt(cb.value));
        });
    }
    
    // 设置价格范围
    const priceMinInput = document.querySelector('input[name="priceRangeMin"]');
    const priceMaxInput = document.querySelector('input[name="priceRangeMax"]');
    if (priceMinInput && filters.priceRangeMin !== null) {
        priceMinInput.value = filters.priceRangeMin;
    }
    if (priceMaxInput && filters.priceRangeMax !== null) {
        priceMaxInput.value = filters.priceRangeMax;
    }
    
    console.log('✅ UI已同步URL中的筛选条件');
}

/**
 * 应用筛选条件
 */
function applyFilters() {
    // 收集所有已选择的筛选条件
    filters.carType = Array.from(document.querySelectorAll('input[name="carType"]:checked')).map(el => el.value);
    filters.brand = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value);
    filters.fuelType = Array.from(document.querySelectorAll('input[name="fuelType"]:checked')).map(el => el.value);
    
    // 处理月租范围 (从...到...)
    const priceRangeMin = document.querySelector('input[name="priceRangeMin"]');
    const priceRangeMax = document.querySelector('input[name="priceRangeMax"]');
    filters.priceRangeMin = priceRangeMin ? parseFloat(priceRangeMin.value) || null : null;
    filters.priceRangeMax = priceRangeMax ? parseFloat(priceRangeMax.value) || null : null;
    
    // 处理发动机排气量 - 从checkboxes中获取选中的具体值（不再是范围）
    const powerValueCheckboxes = Array.from(document.querySelectorAll('input[name="powerValue"]:checked'));
    filters.powerValues = powerValueCheckboxes.map(el => parseFloat(el.value));
    
    // 处理发动机汽缸数量 - 从checkboxes中获取选中的值
    filters.powerUnits = Array.from(document.querySelectorAll('input[name="powerUnit"]:checked')).map(el => parseInt(el.value));
    
    // 处理座位数 - 从checkboxes中获取选中的值
    filters.seatsList = Array.from(document.querySelectorAll('input[name="seats"]:checked')).map(el => parseInt(el.value));

    console.log('应用筛选条件:', filters);

    // 将筛选条件编码到URL并更新
    const filterURL = encodeFiltersToURL();
    const newURL = window.location.pathname + '?' + filterURL;
    window.history.pushState({ filters: filters }, '', newURL);
    console.log('✅ 筛选链接已更新:', newURL);

    // 关闭筛选菜单
    toggleFilterMenu();

    // 重新渲染数据
    applyFiltersAndDisplay();
}

/**
 * 重置所有筛选条件
 */
function resetFilters() {
    // 清空搜索框
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchKeyword = '';
        // 清空搜索框时恢复原始页面标题
        updateTitleBySearch('');
    }
    
    // 清空所有checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // 清空所有范围输入框
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // 重置filters对象
    filters.carType = [];
    filters.brand = [];
    filters.fuelType = [];
    filters.priceRangeMin = null;
    filters.priceRangeMax = null;
    filters.powerValues = [];
    filters.powerUnits = [];
    filters.seatsList = [];

    console.log('已重置所有筛选条件和搜索:', filters, '搜索关键词:', searchKeyword);
    
    // 关闭筛选菜单
    toggleFilterMenu();
    
    // 重新渲染数据
    applyFiltersAndDisplay();
}

/**
 * 应用筛选并显示结果
 */
function applyFiltersAndDisplay() {
    console.log('🔄 applyFiltersAndDisplay 被调用...');
    console.log('allCars 数量:', allCars.length);
    console.log('当前筛选条件:', filters);
    console.log('搜索关键词:', searchKeyword);
    
    // 过滤车辆
    filteredCars = allCars.filter(car => {
        // 搜索关键词过滤（搜索范围：汽车类型、品牌、型号、燃料类型、编号）
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase().trim();
            const matchSearch = 
                (car.type && car.type.toLowerCase().includes(keyword)) ||
                (car.brand_id && car.brand_id.toLowerCase().includes(keyword)) ||
                (car.modelName && car.modelName.toLowerCase().includes(keyword)) ||
                (car.fuelType && car.fuelType.toLowerCase().includes(keyword)) ||
                (car.licensePlate && car.licensePlate.toLowerCase().includes(keyword)) ||
                (car.id && car.id.toString().includes(keyword));
            
            if (!matchSearch) {
                return false;
            }
        }

        // 汽车类型筛选
        if (filters.carType.length > 0 && !filters.carType.includes(car.type)) {
            return false;
        }

        // 品牌筛选 (映射到 brand_id)
        if (filters.brand.length > 0 && !filters.brand.includes(car.brand_id)) {
            return false;
        }

        // 月租范围筛选 (映射到 monthlyFee，范围筛选)
        if (filters.priceRangeMin !== null || filters.priceRangeMax !== null) {
            const carPrice = parseFloat(car.monthlyFee);
            if (filters.priceRangeMin !== null && carPrice < filters.priceRangeMin) {
                return false;
            }
            if (filters.priceRangeMax !== null && carPrice > filters.priceRangeMax) {
                return false;
            }
        }

        // 燃料类型筛选
        if (filters.fuelType.length > 0 && !filters.fuelType.includes(car.fuelType)) {
            return false;
        }

        // 发动机排气量筛选 (映射到 power，支持多个具体值)
        if (filters.powerValues && filters.powerValues.length > 0) {
            // 确保car.power是数字进行比较
            const carPower = typeof car.power === 'string' ? parseFloat(car.power) : car.power;
            // 确保filters中的值也是数字
            const normalizedPowerValues = filters.powerValues.map(v => typeof v === 'string' ? parseFloat(v) : v);
            if (!normalizedPowerValues.includes(carPower)) {
                return false;
            }
        }

        // 发动机汽缸数量筛选 (映射到 powerUnit，支持多个特定值)
        if (filters.powerUnits.length > 0) {
            // 确保car.powerUnit是数字进行比较
            const carPowerUnit = typeof car.powerUnit === 'string' ? parseInt(car.powerUnit) : car.powerUnit;
            // 确保filters中的值也是数字
            const normalizedPowerUnits = filters.powerUnits.map(v => typeof v === 'string' ? parseInt(v) : v);
            if (!normalizedPowerUnits.includes(carPowerUnit)) {
                return false;
            }
        }

        // 座位数筛选 (支持多个特定值)
        if (filters.seatsList.length > 0) {
            // 确保car.seats是数字进行比较
            const carSeats = typeof car.seats === 'string' ? parseInt(car.seats) : car.seats;
            // 确保filters中的值也是数字
            const normalizedSeats = filters.seatsList.map(v => typeof v === 'string' ? parseInt(v) : v);
            if (!normalizedSeats.includes(carSeats)) {
                return false;
            }
        }

        return true;
    });

    console.log('✅ 筛选完成，结果:', filteredCars.length, '条');

    // 重置到第一页
    currentPage = 1;

    // 默认排序：名称→时间→价格，三个都是升序
    applyDefaultSort();
    
    console.log('📺 开始渲染UI...');

    // 渲染车辆卡片和分页
    try {
        renderCars();
        renderPagination();
        console.log('✅ UI 渲染完成');
    } catch (err) {
        console.error('❌ UI 渲染失败:', err);
        console.error('错误堆栈:', err.stack);
    }
}

/**
 * 默认排序：名称升序为第一优先级，名称相同时按时间升序，再相同按价格升序。
 * 页面打开时（以及每次筛选/分类变化重新渲染时）都会用这个作为起始排序，
 * 直到用户手动点击某个排序按钮为止。
 */
function applyDefaultSort() {
    filteredCars.sort((a, b) => {
        const nameA = (a.modelName || '').toLowerCase();
        const nameB = (b.modelName || '').toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        const dateA = new Date(a.create_date);
        const dateB = new Date(b.create_date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        const priceA = parseFloat(a.monthlyFee) || 0;
        const priceB = parseFloat(b.monthlyFee) || 0;
        return priceA - priceB;
    });
    console.log('已应用默认排序：名称→时间→价格（均为升序）');
}

/**
 * 按create_date排序（降序，最新的在前）——保留此函数以防其他地方仍在调用
 */
function sortCarsByCreateDate() {
    filteredCars.sort((a, b) => {
        const dateA = new Date(a.create_date);
        const dateB = new Date(b.create_date);
        // 降序：最新的在前
        return dateB - dateA;
    });
    console.log('已按create_date降序排序（最新的在前）');
}

/**
 * 顶部排序按钮字段映射（.wbn-action .row.df-r .btn 里的 <span> 文本 -> 排序字段）
 * "筛选"按钮不在这里，它走自己的 onclick="toggleFilterMenu()"
 */
const SORT_BUTTON_FIELD_MAP = {
    '名称': 'name',
    '时间': 'create_date',
    '价格': 'price'
};

/**
 * 初始化排序按钮点击事件。
 * 点第一次：降序（desc） + 加 active + span文字变成"字段名 ↓"
 * 再点一次：升序（asc） + 去掉 active + span文字变回默认
 * 点别的字段按钮时，其余按钮会先恢复默认状态（同一时间只有一个字段在排序）
 */
function initSortButtons() {
    const buttons = document.querySelectorAll('.wbn-action .row.df-r .btn');

    buttons.forEach((btn) => {
        const span = btn.querySelector('span');
        if (!span) return;

        const defaultLabel = span.textContent.trim();
        const field = SORT_BUTTON_FIELD_MAP[defaultLabel];
        if (!field) return; // 例如"筛选"按钮，跳过

        btn.dataset.sortField = field;
        btn.dataset.defaultLabel = defaultLabel;

        btn.addEventListener('click', () => handleSortButtonClick(btn));
    });
}

/**
 * 点击某个排序按钮
 */
function handleSortButtonClick(btn) {
    const field = btn.dataset.sortField;
    const span = btn.querySelector('span');
    const isActive = btn.classList.contains('active');

    if (!isActive) {
        // 第一次点击：降序，加active，文字提示降序
        sortCars('desc', field);
        btn.classList.add('active');
        if (span) span.textContent = `${btn.dataset.defaultLabel} ↓`;
    } else {
        // 再点一次：升序，去掉active，文字恢复默认
        sortCars('asc', field);
        btn.classList.remove('active');
        if (span) span.textContent = btn.dataset.defaultLabel;
    }
}

/**
 * 对车辆进行排序
 */
function sortCars(direction, field) {
    // 更新排序状态
    currentSort.field = field;
    currentSort.direction = direction;

    // 执行排序
    filteredCars.sort((a, b) => {
        let valueA, valueB;

        switch (field) {
            case 'name':
                valueA = a.modelName.toLowerCase();
                valueB = b.modelName.toLowerCase();
                break;
            case 'time':
                valueA = a.year;
                valueB = b.year;
                break;
            case 'price':
                valueA = a.monthlyFee;
                valueB = b.monthlyFee;
                break;
            case 'create_date':
                valueA = new Date(a.create_date);
                valueB = new Date(b.create_date);
                break;
            default:
                return 0;
        }

        if (direction === 'asc') {
            return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
            return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
    });

    // 重置到第一页
    currentPage = 1;

    // 重新渲染
    renderCars();
    renderPagination();

    console.log(`已按${field}（${direction === 'asc' ? '升序' : '降序'}）排序`);
}

/**
 * 渲染车辆卡片
 */
function renderCars() {
    const carGrid = document.getElementById('carGrid');
    console.log('renderCars 被调用...');
    console.log('carGrid 元素存在?', !!carGrid);
    console.log('filteredCars 数据:', filteredCars.length, '条');
    console.log('currentPage:', currentPage, ', itemsPerPage:', itemsPerPage);
    
    if (!carGrid) {
        console.error('❌ 错误：找不到 id="carGrid" 的元素！');
        return;
    }

    carGrid.innerHTML = '';

    // 计算分页范围
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const carsToDisplay = filteredCars.slice(startIndex, endIndex);
    
    console.log('本页显示范围:', startIndex, '-', endIndex, '，本页车数:', carsToDisplay.length);

    if (carsToDisplay.length === 0) {
        console.warn('本页没有车辆列表');
        carGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">
                    <i class="fas fa-car"></i>
                </div>
                <p>未找到匹配的车辆</p>
            </div>
        `;
        return;
    }

    // 创建卡片
    console.log('开始创建', carsToDisplay.length, '个车辆卡片...');
    carsToDisplay.forEach((car, index) => {
        try {
            const carCard = createCarCard(car);
            carGrid.appendChild(carCard);
        } catch (err) {
            console.error('创建第', index, '个车辆卡片失败:', err, '车辆数据:', car);
        }
    });
    console.log('✅ 车辆卡片渲染完成');
}

/**
 * 创建单个车辆卡片
 */
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.style.cursor = 'pointer';
    
    // 点击卡片进入详情页
    card.addEventListener('click', (e) => {
        if (e.target.closest('.reserve-btn')) {
            e.stopPropagation();
            reserveCar(car.id);
        } else {
            goToDetail(car.id, car.fieldId);
        }
    });
    
    // 构建规格信息
    // const specsHTML = `
    //     <div class="spec-item">
    //         <div class="spec-label">年份</div>
    //         <div class="spec-value">${car.year}</div>
    //     </div>
    //     <div class="spec-item">
    //         <div class="spec-label">座位</div>
    //         <div class="spec-value">${car.seats}座</div>
    //     </div>
    //     <div class="spec-item">
    //         <div class="spec-label">类型</div>
    //         <div class="spec-value">${car.type}</div>
    //     </div>
    //     <div class="spec-item">
    //         <div class="spec-label">排气量</div>
    //         <div class="spec-value">${formatEnginePower(car.power)}</div>
    //     </div>
    // `;

    const specsHTML = `    
        <div class="spec-item">
            <div class="spec-label">汽车类型</div>
            <div class="spec-value">${car.type}</div>
        
        </div>

        <div class="spec-item">
            <div class="spec-label">品牌</div>
            <div class="spec-value">${car.brand_id}</div>
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

    // code Zin 
    // <h3 class="car-name">${car.modelName} ${car.licensePlate}</h3>
    card.innerHTML = `
        <div class="car-image-container">
            <img class="car-image" src="${car.imageUrl}" alt="${car.modelName}" onerror="this.classList.add('error')">
        </div>
        <div class="car-info">
            
            <h3 class="car-name">${car.year} ${car.modelName} </h3>
            <div class="car-specs">
                ${specsHTML}
            </div>
            <div class="car-price">
                <div class="price-text">${car.priceDisplay}</div>
                <div class="price-label">月租范围</div>
            </div>
            <button class="reserve-btn"  onclick="goToDetail(${car.id}, '${car.fieldId}')">查看更多信息</button>

        </div>
    `;
    //code zin
    //<button class="reserve-btn" onclick="event.stopPropagation(); reserveCar(${car.id});">立即预约</button>

    return card;
}

/**
 * 格式化发动机排量
 */
function formatEnginePower(power) {
    if (!power) return '0L';
    return power.toFixed(1) + 'L';
}

/**
 * 渲染分页
 */
function renderPagination() {
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!pageNumbers || !pageInfo) return;

    // 清空页码
    pageNumbers.innerHTML = '';

    // 动态生成页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 第一页
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'page-number';
        firstPageBtn.textContent = '1';
        firstPageBtn.onclick = () => goToPage(1);
        pageNumbers.appendChild(firstPageBtn);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 5px';
            pageNumbers.appendChild(dots);
        }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }

    // 最后一页
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 5px';
            pageNumbers.appendChild(dots);
        }

        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'page-number';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.onclick = () => goToPage(totalPages);
        pageNumbers.appendChild(lastPageBtn);
    }

    // 更新页码信息
    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    // 更新上一页、下一页按钮状态
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

/**
 * 跳转到指定页
 */
function goToPage(page) {
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCars();
        renderPagination();
        // 注释：移除滚动到顶部的行为
        // window.scrollTo(0, 0);
    }
}

/**
 * 上一页
 */
function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

/**
 * 下一页
 */
function nextPage() {
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

/**
 * 跳转到Odoo车辆详情页面
 */
function goToDetail(carId, fieldId) {
    // 使用URL参数传递数据给Odoo详细页面
    window.location.href = `/car/detail?luacarId=${carId}&luacarFieldId=${fieldId}`;
}

/**
 * 进入车辆详情页面（本地版本，备用）
 */
function goToCarDetail(carId) {
    // 将车ID存储到localStorage，以便详情页读取
    localStorage.setItem('selectedCarId', carId);
    window.location.href = '1/index-detail.html';
}

/**
 * 预约车辆
 */
// function reserveCar(carId) {
//     const car = allCars.find(c => c.id === carId);
//     if (car) {
//         alert(`您选择了预约: ${car.modelName} (${car.licensePlate})\n月租价格: ${car.priceDisplay}\n\n请等待客服联系或拨打客服电话`);
//     }
// }

/**
 * 返回首页
 */
function goToHome() {
    window.location.href = '/';
}

/**
 * 进入长租自驾页面（保持在当前页面，侧边栏菜单用）
 */
function goToLongRental() {
    // 关闭侧边栏菜单
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu) {
        sideMenu.classList.remove('active');
    }
}

/**
 * 复制当前筛选链接到剪贴板
 */
function copyFilterLink() {
    const currentURL = window.location.href;
    
    // 使用异步剪贴板API
    navigator.clipboard.writeText(currentURL).then(() => {
        // 显示成功提示
        alert('✅ 筛选链接已复制到剪贴板！');
        // alert('✅ 筛选链接已复制到剪贴板！\n\n链接: ' + currentURL + '\n\n您可以分享此链接给别人，他们点击后会看到相同的筛选结果。');
        console.log('✅ 链接已复制:', currentURL);
    }).catch(err => {
        // 降级方案：使用老旧方法
        const textArea = document.createElement('textarea');
        textArea.value = currentURL;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        // try {
        //     document.execCommand('copy');
        //     alert('✅ 筛选链接已复制到剪贴板！\n\n链接: ' + currentURL + '\n\n您可以分享此链接给别人，他们点击后会看到相同的筛选结果。');
        //     console.log('✅ 链接已复制:', currentURL);
        // } catch (err) {
        //     alert('❌ 复制失败，请手动复制链接：' + currentURL);
        //     console.error('❌ 复制失败:', err);
        // }
        document.body.removeChild(textArea);
    });
}

// 暴露到全局，以便HTML中直接调用
window.toggleFilterMenu = toggleFilterMenu;
window.toggleFilterGroup = toggleFilterGroup;
window.applyFilters = applyFilters;
window.sortCars = sortCars;
window.goToDetail = goToDetail;
window.goToCarDetail = goToCarDetail;
window.previousPage = previousPage;
window.nextPage = nextPage;
window.goToPage = goToPage;
window.goToHome = goToHome;
window.goToLongRental = goToLongRental;
window.copyFilterLink = copyFilterLink;
window.renderNavTabs = renderNavTabs;
window.handleNavTabClick = handleNavTabClick;
window.initSortButtons = initSortButtons;
window.handleSortButtonClick = handleSortButtonClick;