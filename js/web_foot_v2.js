(function () {
    'use strict';

    const FOOTER_STYLE_ID = 'zuacar-footer-v1-style';

    // Standalone footer-specific styles if needed. Leaving open for additions.
    const FOOTER_STYLE = `
        .sg-foot {
            background: #000000;
            color: white;
            padding: 40px 30px;
            margin-top: 40px;
            border-top: 6px solid var(--gold);
            position: relative;
            z-index: 11;
        }

        .sg-foot-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
            margin-bottom: 30px;
            text-align: left;
            max-width: 1150px;
            margin-left: auto;
            margin-right: auto;
        }
        @media screen and (max-width: 900px) {
            .sg-foot-grid { grid-template-columns: 1fr; gap: 32px; }
        }

        .sg-foot-heading-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sg-foot-heading-row img {
            width: 25px;
            height: 20px;
        }

        .sg-foot-heading {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: var(--gold);
            font-weight: 700;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--gold);
            padding-bottom: 10px;
        }

        .sg-foot-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .sg-foot-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            font-size: 13px;
            color: #ccc;
            line-height: 1.6;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .sg-foot-item img {
            width: 25px;
            height: 25px;
            flex-shrink: 0;
        }

        .sg-foot-item:hover {
            color: var(--gold);
            padding-left: 10px;
        }
        .sg-foot-item:focus-visible {
            outline: 2px solid var(--sg-color-brand);
            outline-offset: 2px;
        }

        .sg-foot-contact-list {
            list-style: none;
            padding: 0;
            margin: 0 0 15px 0;
        }
        .sg-foot-contact-list li {
            padding: 8px 0;
            font-size: 13px;
            color: #ccc;
            line-height: 1.6;
        }
        .sg-foot-contact-list a {
            color: inherit;
            text-decoration: none;
        }
        .sg-foot-contact-list a:hover {
            color: var(--gold);
        }

        .sg-foot-qr {
            display: flex;
            justify-content: center;
            margin: 15px 0;
        }
        .sg-foot-qr img {
            width: 120px;
            height: 120px;
            border: 2px solid var(--gold);
            padding: 4px;
            background: white;
        }
        .sg-foot-qr:empty {
            margin: 0;
        }

        .sg-foot-btn {
            background: var(--gold);
            color: #1a1a1a;
            border: none;
            padding: 8px 24px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .sg-foot-btn:hover {
            background: var(--sg-color-brand);
            transform: scale(1.05);
        }
        .sg-foot-btn:focus-visible {
            outline: 2px solid var(--sg-color-brand);
            outline-offset: 2px;
        }

        .sg-foot-note {
            font-size: 12px;
            color: var(--sg-color-brand);
            margin-top: 15px;
        }
        .sg-foot-note p {
            text-align: center;
            margin: 0;
        }

        /* 语言下拉框 */
        #lang-dropdown {
            position: absolute;
            display: none;
            list-style: none;
            background: white;
            color: var(--text-dark);
            border-radius: 10px;
            padding: 12px 0;
            margin-top: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            min-width: 140px;
            z-index: 102;
        }

        #lang-dropdown li {
            padding: 12px 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 13px;
            font-weight: 500;
        }

        #lang-dropdown li:hover {
            background: var(--light-gray);
            color: var(--gold);
            padding-left: 24px;
        }
        
    `;

    const FOOTER_TEMPLATE = `
    <footer class="sg-foot" data-sv="main-footer">
        <div class="sg-foot-grid">
            <div class="sg-foot-col">
                <div class="sg-foot-heading-row">
                    <img src="https://www.zuacar.com/web/content/233617/图层 1.png" alt=""/>
                    <h4 class="sg-foot-heading">盈信服务平台</h4>
                </div>
                <ul class="sg-foot-list">
                    <li class="sg-foot-item" data-url="https://m.fi855.com/" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/233619/图层 3.png" alt=""/>
                        <span>盈信商业服务 Fi855.com —— 一站式商业服务平台</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.zuacar.com/" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/233621/图层 5.png" alt=""/>
                        <span>租辆车 ZuAcar.com —— 专业.服务.强保障</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.luacar.com/" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/233620/图层 4.png" alt=""/>
                        <span>撸辆车 LuAcar.com —— 二手车0差价直购</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.fi855.com/col.jsp?id=117" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/235055/图标-50x50-财税.png" alt=""/>
                        <span>盈信财税 —— 让您专注于经营</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.fi855.com/col.jsp?id=121" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/235056/7盈信证照.png" alt=""/>
                        <span>盈信证照 —— 所有的证照一站办理</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.fi855.com/col.jsp?id=113" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/235057/图标-50x50-金融.png" alt=""/>
                        <span>盈信汽车金融 —— 合法特牌.外国人分期购车</span>
                    </li>
                    <li class="sg-foot-item" data-url="https://m.fi855.com/" tabindex="0">
                        <img src="https://www.zuacar.com/web/content/235058/图标-50x50-盈信企程.png" alt=""/>
                        <span>盈信企程 —— 升级您的赚钱系统</span>
                    </li>
                </ul>
            </div>

            <div class="sg-foot-col">
                <div class="sg-foot-heading-row">
                    <img src="https://www.zuacar.com/web/content/233618/图层 2.png" alt=""/>
                    <h4 class="sg-foot-heading">联系我们</h4>
                </div>
                <ul class="sg-foot-contact-list">
                    <li>联系电话：<a href="tel:078859888">078-859-888</a></li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:0969859888">096-985-9888</a></li>
                    <li>联系地址 : 柬埔寨 金边市 桑园区 钻石岛大道 牛顿街85号</li>
                </ul>
                <div class="sg-foot-qr" id="footQrContainer"></div>
                <button type="button" class="sg-foot-btn" data-url="https://t.me/fient888_bot?start=w51458001">在线客服</button>
            </div>
        </div>
        <div class="sg-foot-note">
            <p>租辆车-柬埔寨最专业租车网</p>
        </div>
    </footer>
    `;
    /* ─────────────── helpers ─────────────── */

    function getFooter() {
        return document.querySelector('[data-sv="main-footer"]');
    }

    /* ─────────────── styles ─────────────── */

    function ensureFooterStyles() {
        if (document.getElementById(FOOTER_STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = FOOTER_STYLE_ID;
        style.setAttribute('data-purpose', 'zuacar-footer-v1-style');
        style.textContent = FOOTER_STYLE;
        document.head.appendChild(style);
    }

    /* ─────────────── mount ─────────────── */

    function mountFooterTemplate(targetSelector) {
        if (getFooter()) return getFooter();

        const target = targetSelector
            ? document.querySelector(targetSelector)
            : document.body;

        if (!target) return null;

        // Footers are inserted at the end of the container component
        target.insertAdjacentHTML('beforeend', FOOTER_TEMPLATE);
        return getFooter();
    }

    /* ─────────────── events ─────────────── */

    function bindFooterEvents(root) {
        root.addEventListener('click', function (event) {
            
            // Clean abstraction: handle any item mapped with a target data-url attribute
            const clickableElement = event.target.closest('[data-url]');
            if (clickableElement) {
                const url = clickableElement.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            }
        });

        // Keyboard support: Enter/Space activates focusable [data-url] items (e.g. sg-foot-item)
        root.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const clickableElement = event.target.closest('[data-url]');
            if (!clickableElement || !clickableElement.hasAttribute('tabindex')) return;
            event.preventDefault();
            const url = clickableElement.getAttribute('data-url');
            if (url) window.open(url, '_blank');
        });
    }

    /* ─────────────── init ─────────────── */

    function initFooter(options) {
        const settings = options || {};
        ensureFooterStyles();
        mountFooterTemplate(settings.mountTo);
        bindFooterEvents(document);
    }

    /* ─────────────── public API ─────────────── */

    if (typeof window !== 'undefined') {
        window.FOOTER_TEMPLATE     = FOOTER_TEMPLATE;
        window.mountFooterTemplate = mountFooterTemplate;
        window.initFooter          = initFooter;
    }

    document.addEventListener('DOMContentLoaded', function () {
        initFooter();
    });
})();