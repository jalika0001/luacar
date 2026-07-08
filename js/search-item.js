// 搜索结果页逻辑
// 从 header 的搜索框跳转过来的URL格式： search-item.html?search=斯塔瑞斯
(function () {
    'use strict';

    const ITEMS_PER_PAGE = 20; // 与静态设计稿中 "1 / 66" 的分页节奏保持一致

    let allMatchedCars = [];   // 当前搜索关键词命中的全部车辆（已排序，未分页）
    let currentPage = 1;

    /* ─────────────── 工具函数 ─────────────── */

    function getSearchQuery() {
        const params = new URLSearchParams(window.location.search);
        return (params.get('search') || '').trim();
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // 与 header 搜索框相同的字段拼接逻辑，方便结果保持一致
    function buildSearchIndex(car) {
        return [car.modelName, car.brand, car.year, car.licensePlate, car.fuelType, car.type]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
    }

    /* ─────────────── 数据获取 ─────────────── */

    async function fetchAndFilterCars(query) {
        if (!window.API || typeof window.API.fetchCars !== 'function') {
            console.error('未找到 window.API，请确认 API.js 已正确加载');
            return [];
        }

        const raw = await window.API.fetchCars();
        const cars = window.API.processMultipleCars(raw || []);

        const q = query.toLowerCase();
        if (!q) return cars; // 没有关键词时按理不会进入这个页面，兜底返回全部

        // 支持多个关键词之间用空格分隔，要求全部关键词都命中（AND），
        // 比 header 弹窗里的即时预览更严格一些，适合完整结果页
        const tokens = q.split(/\s+/).filter(Boolean);

        return cars.filter(function (car) {
            const index = car._searchIndex || (car._searchIndex = buildSearchIndex(car));
            return tokens.every(function (token) { return index.indexOf(token) !== -1; });
        });
    }

    /* ─────────────── 渲染：结果信息条 ─────────────── */

    function updateSearchInfoBar(query, count, isLoading) {
        const queryEl = document.getElementById('siQuery');
        const countEl = document.getElementById('siCount');
        const loadingEl = document.getElementById('siLoadingDot');

        if (queryEl) queryEl.textContent = query;
        if (loadingEl) loadingEl.style.display = isLoading ? 'inline-block' : 'none';
        if (countEl) {
            countEl.style.display = isLoading ? 'none' : 'inline-block';
            countEl.textContent = `${count} 套`;
        }
    }

    /* ─────────────── 渲染：车辆卡片 ─────────────── */

    function carCardHTML(car) {
        const title = [car.year, car.modelName].filter(Boolean).join(' ');
        const brandDisplay = car.brand || '';

        return `
        <div class="car-card" data-car-id="${car.id}" data-field-id="${escapeHtml(car.fieldId)}">
            <div class="car-image-container">
                <img class="car-image" src="${car.imageUrl}" alt="${escapeHtml(title)}"
                    onerror="this.classList.add('error')" style="cursor: pointer; object-fit: contain;">
            </div>
            <div class="car-info">
                <h3 class="car-name">${escapeHtml(title)}</h3>
                <div class="car-specs">
                    <div class="spec-item">
                        <div class="spec-label">汽车类型</div>
                        <div class="spec-value">${escapeHtml(car.type || '-')}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">品牌</div>
                        <div class="spec-value">${escapeHtml(brandDisplay || '-')}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">编码</div>
                        <div class="spec-value">${escapeHtml(car.fieldId || '-')}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">具体价格：</div>
                        <div class="spec-value">详询客服</div>
                    </div>
                </div>
                <div class="car-price">
                    <div class="price-text">${escapeHtml(car.priceDisplay)}</div>
                    <div class="price-label">月租范围</div>
                </div>
                <button class="reserve-btn" onclick="event.stopPropagation(); goToDetail(${car.id}, '${escapeHtml(car.fieldId)}')">查看更多信息</button>
            </div>
        </div>`;
    }

    function renderCarGrid(carsForPage) {
        const grid = document.getElementById('carGrid');
        if (!grid) return;

        if (!carsForPage.length) {
            grid.innerHTML = `
                <div class="si-empty" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                    暂无匹配车辆，换个关键词试试
                </div>`;
            return;
        }

        grid.innerHTML = carsForPage.map(carCardHTML).join('');
    }

    /* ─────────────── 渲染：分页 ─────────────── */

    function getTotalPages() {
        return Math.max(1, Math.ceil(allMatchedCars.length / ITEMS_PER_PAGE));
    }

    function renderPagination() {
        const container = document.getElementById('paginationContainer');
        const numbersEl = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const infoEl = document.getElementById('pageInfo');
        if (!container || !numbersEl) return;

        const totalPages = getTotalPages();

        // 没有结果时直接隐藏整个分页条
        if (!allMatchedCars.length) {
            container.style.display = 'none';
            return;
        }
        container.style.display = '';

        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
        if (infoEl) infoEl.textContent = `${currentPage} / ${totalPages}`;

        numbersEl.innerHTML = buildPageNumbersHTML(currentPage, totalPages);

        // 页码按钮点击事件（用委托，避免每次重新渲染都要重新绑定）
        numbersEl.querySelectorAll('.page-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const page = parseInt(btn.dataset.page, 10);
                if (page && page !== currentPage) goToPage(page);
            });
        });
    }

    // 生成页码按钮HTML，超过一定数量用省略号折叠，样式与设计稿保持一致
    function buildPageNumbersHTML(current, total) {
        const pages = [];
        const delta = 1; // 当前页左右各显示1个

        pages.push(1);
        for (let i = current - delta; i <= current + delta; i++) {
            if (i > 1 && i < total) pages.push(i);
        }
        if (total > 1) pages.push(total);

        const unique = Array.from(new Set(pages)).sort(function (a, b) { return a - b; });

        let html = '';
        let prev = null;
        unique.forEach(function (page) {
            if (prev !== null && page - prev > 1) {
                html += `<span style="padding: 8px 4px;">...</span>`;
            }
            const activeClass = page === current ? ' active' : '';
            html += `<button class="page-btn${activeClass}" data-page="${page}">${page}</button>`;
            prev = page;
        });

        return html;
    }

    /* ─────────────── 分页导航（与HTML里已有的 onclick 对应） ─────────────── */

    function goToPage(page) {
        const totalPages = getTotalPages();
        if (page < 1 || page > totalPages || page === currentPage) return;

        currentPage = page;
        renderCurrentPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function nextPage() {
        goToPage(currentPage + 1);
    }

    function previousPage() {
        goToPage(currentPage - 1);
    }

    function renderCurrentPage() {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const pageItems = allMatchedCars.slice(start, start + ITEMS_PER_PAGE);
        renderCarGrid(pageItems);
        renderPagination();
    }

    /* ─────────────── 车辆详情跳转 ─────────────── */
    // ⚠️ 目前不确定实际的详情页文件名/参数格式，先按常见约定实现，
    // 如果实际详情页地址不同，改这里这一处就够了。
    function goToDetail(id, fieldId) {
        const params = new URLSearchParams();
        if (id) params.set('luacarId', id);
        if (fieldId) params.set('luacarFieldId', fieldId);
        window.location.href = '/car/detail?' + params.toString();
    }

    /* ─────────────── 返回按钮 ─────────────── */

    function bindBackButton() {
        const backBtn = document.querySelector('.main-siBar .btn');
        if (!backBtn) return;

        backBtn.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        });
    }

    /* ─────────────── 整卡片点击也能进详情（按钮已做 stopPropagation，不会重复触发） ─────────────── */

    function bindCardClickDelegation() {
        const grid = document.getElementById('carGrid');
        if (!grid) return;

        grid.addEventListener('click', function (e) {
            const card = e.target.closest('.car-card');
            if (!card) return;
            goToDetail(card.dataset.carId, card.dataset.fieldId);
        });
    }

    /* ─────────────── 初始化 ─────────────── */

    async function init() {
        const query = getSearchQuery();

        bindBackButton();
        bindCardClickDelegation();

        updateSearchInfoBar(query, 0, true);

        try {
            allMatchedCars = await fetchAndFilterCars(query);
        } catch (err) {
            console.error('搜索结果加载失败:', err);
            allMatchedCars = [];
        }

        currentPage = 1;
        updateSearchInfoBar(query, allMatchedCars.length, false);
        renderCurrentPage();
    }

    document.addEventListener('DOMContentLoaded', init);

    // 暴露给HTML里已有的 onclick="previousPage()" / "nextPage()" / goToDetail(...)
    window.goToPage = goToPage;
    window.nextPage = nextPage;
    window.previousPage = previousPage;
    window.goToDetail = goToDetail;
})();