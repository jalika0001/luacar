(function () {
    'use strict';

    const FOOTER_STYLE_ID = 'zuacar-footer-v1-style';

    // Standalone footer-specific styles if needed. Leaving open for additions.
    const FOOTER_STYLE = `
        footer {
            background: #000000;
            color: white;
            padding: 40px 30px;
            margin-top: 40px;
            border-top: 6px solid var(--gold);
            position: relative;
            z-index: 11;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
            margin-bottom: 30px;
            text-align: left;
            max-width: 1150px;
            margin-left: auto;
            margin-right: auto;
        }

        .footer-grid h4 {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: var(--gold);
            font-weight: 700;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--gold);
            padding-bottom: 10px;
        }

        .footer-grid ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-grid li {
            padding: 8px 0;
            font-size: 13px;
            color: #ccc;
            transition: all 0.3s ease;
            line-height: 1.6;
        }

        .footer-grid li:hover {
            color: var(--gold);
            padding-left: 10px;
        }

        .qrcode-section {
            /* display: flex; */
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }

        .qrcode-container {
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
            margin-top:15px;
        }

        .qrcode-image {
            width: 120px;
            height: 120px;
            border: 2px solid var(--gold);
            padding: 4px;
            background: white;
        }

        .telegram-text {
            font-size: 12px;
            color: #999;
            margin: 10px 0 15px 0;
            text-align: center;
        }

        .live-button {
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

        .live-button:hover {
            background: var(--sg-color-brand);
            transform: scale(1.05);
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
        
        .web-foot .webf-txt-note{
            font-size: 12px;
            color: var(--sg-color-brand);
            margin-top: 15px;
        }
        .web-foot .webf-txt-note p{
                text-align: center;
        }
    `;

    const FOOTER_TEMPLATE = `
    <footer class="web-foot" data-sv="main-footer">
        <div class="footer-grid">
            <ul>
                <div class="bussiness-list" style="display: flex; gap: 10px;">
                    <img src="https://www.zuacar.com/web/content/233617/图层 1.png" alt="" style="width: 25px; height: 20px;"/>
                    <h4>盈信服务平台</h4>
                </div>
                <div class="bussiness-list" data-url="https://m.fi855.com/" style="display: flex; gap: 10px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/233619/图层 3.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>盈信商业服务 Fi855.com —— 一站式商业服务平台</li>
                </div>
                <div class="bussiness-list" data-url="https://m.zuacar.com/" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/233621/图层 5.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>租辆车 ZuAcar.com —— 专业.服务.强保障</li>
                </div>
                <div class="bussiness-list" data-url="https://m.luacar.com/" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/233620/图层 4.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>撸辆车 LuAcar.com —— 二手车0差价直购</li>
                </div>
                <div class="bussiness-list" data-url="https://m.fi855.com/col.jsp?id=117" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/235055/图标-50x50-财税.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>盈信财税 —— 让您专注于经营</li>
                </div>
                <div class="bussiness-list" data-url="https://m.fi855.com/col.jsp?id=121" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/235056/7盈信证照.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>盈信证照 —— 所有的证照一站办理</li>
                </div>
                <div class="bussiness-list" data-url="https://m.fi855.com/col.jsp?id=113" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/235057/图标-50x50-金融.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>盈信汽车金融 —— 合法特牌.外国人分期购车</li>
                </div>
                <div class="bussiness-list" data-url="https://m.fi855.com/" style="display: flex; gap: 5px; cursor: pointer;">
                    <img src="https://www.zuacar.com/web/content/235058/图标-50x50-盈信企程.png" alt="" style="width: 25px; height: 25px;"/>
                    <li>盈信企程 —— 升级您的賺钱系统</li>
                </div>
            </ul>  

            <div class="qrcode-section">
                <div class="bussiness-list" style="display: flex; gap: 10px;">
                    <img src="https://www.zuacar.com/web/content/233618/图层 2.png" alt="" style="width: 25px; height: 20px;"/>
                    <h4>联系我们</h4>
                </div>
                <ul>
                    <li>联系电话：078-859-888 </li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;096-985-9888</li>
                    <li>联系地址 : 柬埔寨 金边市 桑园区 钻石岛大道 牛顿街85号</li>
                </ul>
                <div class="qrcode-container"></div>
                <button class="live-button" data-url="https://t.me/fient888_bot?start=w51458001">在线客服</button>
            </div>
        </div>
        <div class="webf-txt-note">
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