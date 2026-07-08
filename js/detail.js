// 车辆详情页逻辑
// URL格式： /car/detail?luacarId=2165&luacarFieldId=CVAN1689
(function () {
    'use strict';

    let currentCar = null;
    let allCars = [];
    let currentSlide = 0;

    const TELEGRAM_URL = 'https://t.me/fient888_bot?start=w51458001';

    /* ─────────────── URL参数 ─────────────── */

    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            carId: params.get('luacarId'),
            fieldId: params.get('luacarFieldId')
        };
    }

    /* ─────────────── 数据获取（参考 detail_da.js 里的旧逻辑） ─────────────── */

    async function loadCarDetail() {
        const { carId, fieldId } = getUrlParams();

        if (!carId) {
            showNoData('缺少车辆参数');
            return;
        }

        if (!window.API || typeof window.API.fetchCars !== 'function') {
            showNoData('API未加载');
            return;
        }

        try {
            const rawCars = await window.API.fetchCars();

            if (!rawCars || !rawCars.length) {
                showNoData('暂无车辆数据');
                return;
            }

            const rawMatch = rawCars.find(function (c) { return String(c.id) === String(carId); });

            if (!rawMatch) {
                showNoData('未找到该车辆');
                return;
            }

            currentCar = window.API.processCarData(rawMatch);
            allCars = window.API.processMultipleCars(rawCars);

            renderCarInfo();
            renderSlider();
            renderSuggestions();
            renderShareModal();

        } catch (err) {
            console.error('加载车辆详情失败:', err);
            showNoData('加载失败，请刷新重试');
        }
    }

    function showNoData(message) {
        const box = document.querySelector('.dtc-box');
        if (box) {
            box.innerHTML = `<div style="text-align:center; padding:60px 20px; color:#999;">${message}，<a href="/luacar">返回列表</a></div>`;
        }
        console.warn('detail.js:', message);
    }

    /* ─────────────── 基本信息渲染（标题/价格/规格表） ─────────────── */

    function renderCarInfo() {
        const car = currentCar;
        document.title = `${car.year} ${car.modelName} - 车辆详情`;

        const titleEl = document.querySelector('.rs-des blockquote h1');
        if (titleEl) titleEl.textContent = `${car.year} ${car.modelName}`;

        const priceEl = document.querySelector('.rs-des .price h2');
        if (priceEl) priceEl.textContent = `$${car.priceDisplay}`;

        const idEl = document.querySelector('.rs-des .data-id h2');
        if (idEl) idEl.textContent = car.fieldId;

        // 规格表：按文档顺序取所有 .tbl-value，位置固定对应下面这12项
        const values = document.querySelectorAll('.rs-info .tbl-value');
        const engineDisplay = car.power > 0 ? car.power.toFixed(1) : '-';
        const specValues = [
            car.type || '-',                 // 汽车类型
            car.brand || '-',                // 品牌
            car.modelName || '-',            // 型号
            car.year || '-',                 // 年份
            car.priceDisplay || '-',         // 月租范围
            car.fuelType || '-',             // 燃料类型
            engineDisplay,                   // 发动机排气量（L）
            car.powerUnitDisplay || '-',     // 发动机汽缸数量
            car.seats || '-',                // 座位数
            '高配',                          // 配置（暂无对应字段，沿用旧脚本的占位值）
            car.fieldId || '-',              // 编号
            '详询客服'                        // 具体价格
        ];
        values.forEach(function (el, i) {
            if (specValues[i] !== undefined) el.textContent = specValues[i];
        });

        const csBtn = document.querySelector('.btn-cs');
        const bfBtn = document.querySelector('.btn-bf');
        [csBtn, bfBtn].forEach(function (btn) {
            if (!btn) return;
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function () {
                window.open(TELEGRAM_URL, '_blank');
            });
        });
    }

    /* ─────────────── 图片轮播 / 切换 / 计数 / 缩略图列表 ─────────────── */

    function renderSlider() {
        const images = (currentCar.allImages && currentCar.allImages.length)
            ? currentCar.allImages
            : [currentCar.imageUrl];

        currentSlide = 0;

        buildSlideTrack(images);
        buildDots(images.length);
        buildThumbnails(images);
        updateSlidePosition(images);
        bindSliderControls(images);
    }

    // 主图轨道：一个 <li> 一张图，横向排成一条，通过整体位移(translateX)切换
    function buildSlideTrack(images) {
        const track = document.querySelector('.rs-main .row-box > ul.df-c');
        const imgFullShowModel = document.querySelector('.sg-msi ul');
        if (!track) return;

        if (imgFullShowModel) {
            imgFullShowModel.innerHTML = images.map(function (src, i) {
                return `<li><img class="img-c" src="${src}" alt="${escapeHtml(currentCar.modelName)} ${i + 1}"/></li>`;
            }).join('');
        }
        track.style.transition = 'transform 0.4s ease';
        track.innerHTML = images.map(function (src, i) {
            return `<li onclick="document.querySelector('.sg-msi').classList.toggle('active')"><img class="img-c" src="${src}" alt="${escapeHtml(currentCar.modelName)} ${i + 1}"/></li>`;
        }).join('');
    }

    // 底部小圆点指示器
    function buildDots(count) {
        const dotsBox = document.querySelector('.rs-main .list-dada');
        if (!dotsBox) return;

        dotsBox.innerHTML = Array.from({ length: count }).map(function (_, i) {
            return `<span class="${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
        }).join('');
    }

    // 右侧/下方缩略图列表
    function buildThumbnails(images) {
        const list = document.querySelector('.rs-aside .rsa-box ul.df-l');
        if (!list) return;

        list.innerHTML = images.map(function (src, i) {
            return `<li class="${i === 0 ? 'active' : ''}" data-index="${i}"><img class="img-c" src="${src}" alt="缩略图${i + 1}"/></li>`;
        }).join('');
    }

    function updateSlidePosition(images) {
        const track = document.querySelector('.rs-main .row-box > ul.df-c');
        if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

        const countEl = document.querySelector('.tsc span');
        if (countEl) countEl.textContent = `${currentSlide + 1} / ${images.length}`;

        document.querySelectorAll('.rs-main .list-dada span').forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });

        document.querySelectorAll('.rs-aside .rsa-box ul.df-l li').forEach(function (li, i) {
            li.classList.toggle('active', i === currentSlide);
        });

        const prevBtn = document.querySelector('.rs-main .btn-prev');
        const nextBtn = document.querySelector('.rs-main .btn-next');
        if (prevBtn) prevBtn.classList.toggle('unactive', currentSlide === 0);
        if (nextBtn) nextBtn.classList.toggle('unactive', currentSlide === images.length - 1);
    }

    function goToSlide(index, images) {
        const max = images.length - 1;
        currentSlide = Math.max(0, Math.min(index, max));
        updateSlidePosition(images);
    }

    function bindSliderControls(images) {
        const prevBtn = document.querySelector('.rs-main .btn-prev');
        const nextBtn = document.querySelector('.rs-main .btn-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentSlide > 0) goToSlide(currentSlide - 1, images);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                if (currentSlide < images.length - 1) goToSlide(currentSlide + 1, images);
            });
        }

        const dotsBox = document.querySelector('.rs-main .list-dada');
        if (dotsBox) {
            dotsBox.addEventListener('click', function (e) {
                const dot = e.target.closest('span[data-index]');
                if (!dot) return;
                goToSlide(parseInt(dot.dataset.index, 10), images);
            });
        }

        const thumbList = document.querySelector('.rs-aside .rsa-box ul.df-l');
        if (thumbList) {
            thumbList.addEventListener('click', function (e) {
                const li = e.target.closest('li[data-index]');
                if (!li) return;
                goToSlide(parseInt(li.dataset.index, 10), images);
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft' && currentSlide > 0) goToSlide(currentSlide - 1, images);
            if (e.key === 'ArrowRight' && currentSlide < images.length - 1) goToSlide(currentSlide + 1, images);
        });
    }

    /* ─────────────── 更多车型推荐 ─────────────── */

    function renderSuggestions() {
        const grid = document.getElementById('carGrid');
        if (!grid) return;

        const others = allCars.filter(function (c) { return c.id !== currentCar.id; });
        const sameType = others.filter(function (c) { return c.type === currentCar.type; });
        const rest = others.filter(function (c) { return c.type !== currentCar.type; });
        const suggestions = sameType.concat(rest).slice(0, 8);

        if (!suggestions.length) {
            grid.innerHTML = '<div style="padding:20px; color:#999;">暂无推荐车辆</div>';
            return;
        }

        grid.innerHTML = suggestions.map(suggestionCardHTML).join('');
    }

    function suggestionCardHTML(car) {
        const title = `${car.year} ${car.modelName}`;
        return `
        <div class="car-card" data-car-id="${car.id}" data-field-id="${escapeHtml(car.fieldId)}">
            <div class="car-image-container">
                <img class="car-image" src="${car.imageUrl}" alt="${escapeHtml(title)}" onerror="this.classList.add('error')" style="cursor: pointer; object-fit: contain;"/>
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
                        <div class="spec-value">${escapeHtml(car.brand || '-')}</div>
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
                    <div class="price-text">$${escapeHtml(car.priceDisplay)}</div>
                    <div class="price-label">月租范围</div>
                </div>
                <button class="reserve-btn" onclick="event.stopPropagation(); goToDetail(${car.id}, '${escapeHtml(car.fieldId)}')">查看更多信息</button>
            </div>
        </div>`;
    }

    function bindSuggestionCardClicks() {
        const grid = document.getElementById('carGrid');
        if (!grid) return;
        grid.addEventListener('click', function (e) {
            const card = e.target.closest('.car-card');
            if (!card) return;
            goToDetail(card.dataset.carId, card.dataset.fieldId);
        });
    }

    function bindSuggestionToggle() {
        const toggleIcon = document.querySelector('.dsgh-box .icon');
        const grid = document.getElementById('carGrid');
        if (!toggleIcon || !grid) return;

        toggleIcon.style.cursor = 'pointer';
        toggleIcon.addEventListener('click', function () {
            grid.style.display = (grid.style.display === 'none') ? '' : 'none';
        });
    }

    function goToDetail(carId, fieldId) {
        const params = new URLSearchParams();
        if (carId) params.set('luacarId', carId);
        if (fieldId) params.set('luacarFieldId', fieldId);
        window.location.href = '/car/detail?' + params.toString();
    }

    /* ─────────────── 分享弹窗 ─────────────── */

    function renderShareModal() {
        const car = currentCar;

        const imgEl = document.querySelector('.sg-msh .ms-head .img img');
        if (imgEl) imgEl.src = car.imageUrl;

        const nameEl = document.querySelector('.sg-msh .ms-head blockquote h2');
        if (nameEl) nameEl.textContent = `${car.year} ${car.modelName}`;

        const priceEl = document.querySelector('.sg-msh .ms-head blockquote .price h3');
        if (priceEl) priceEl.textContent = car.priceDisplay;

        const linkInput = document.querySelector('.sg-ms-link-input');
        if (linkInput) linkInput.value = window.location.href;

        bindShareModalActions();
    }

    function bindShareModalActions() {
        const linkInput = document.querySelector('.sg-ms-link-input');
        const copyBtn = document.querySelector('.sg-ms-copy-btn');

        if (copyBtn && linkInput) {
            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(linkInput.value)
                    .then(function () {
                        const original = copyBtn.textContent;
                        copyBtn.textContent = '已复制';
                        setTimeout(function () { copyBtn.textContent = original; }, 1500);
                    })
                    .catch(function () {
                        linkInput.select();
                        document.execCommand('copy');
                    });
            });
        }

        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(`${currentCar.year} ${currentCar.modelName} - ${currentCar.priceDisplay}`);

        const telegramItem = document.querySelector('.sg-ms-bg-telegram');
        if (telegramItem) {
            telegramItem.addEventListener('click', function () {
                window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank');
            });
        }

        const facebookItem = document.querySelector('.sg-ms-bg-facebook');
        if (facebookItem) {
            facebookItem.addEventListener('click', function () {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
            });
        }

        const whatsappItem = document.querySelector('.sg-ms-bg-whatsapp');
        if (whatsappItem) {
            whatsappItem.addEventListener('click', function () {
                window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank');
            });
        }
    }

    /* ─────────────── 工具函数 ─────────────── */

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ─────────────── 初始化 ─────────────── */

    document.addEventListener('DOMContentLoaded', function () {
        loadCarDetail().then(function () {
            bindSuggestionCardClicks();
            bindSuggestionToggle();
        });
    });

    window.goToDetail = goToDetail;
})();