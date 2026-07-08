(function () {
    'use strict';

    const ASIDE_STYLE_ID = 'zuahouse-aside-v2-style';

    const ASIDE_STYLE = `
        .zua-aside-v2-root,
        .zua-aside-v2-root * {
            box-sizing: border-box;
        }

        #zua-aside-v2-panel {
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        .zua-aside-v2-root {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            display: flex;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }

        .zua-aside-v2-root.aside-active {
            pointer-events: auto;
        }

        .zua-aside-v2-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgb(0 0 0 / 5%);
            -webkit-backdrop-filter: blur(4px);
            // backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            -webkit-transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), visibility 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 100;
        }

        .zua-aside-v2-root.aside-active .zua-aside-v2-overlay {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        #zua-aside-v2-panel {
            position: fixed;
            width: 100%;
            max-width: 320px;
            height: 100%;
            background-color: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            display: -webkit-flex;
            display: flex;
            -webkit-flex-direction: column;
            flex-direction: column;
            overflow: hidden;
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
            -webkit-transition: -webkit-transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
            -webkit-overflow-scrolling: touch;
            will-change: transform;
            z-index: 110;
        }

        .zua-aside-v2-root.aside-active #zua-aside-v2-panel {
            -webkit-transform: translateX(0);
            transform: translateX(0);
        }

        #zua-aside-v2-head {
            padding-top: 1rem;
            padding-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            border-bottom: 1px solid #f9fafb;
        }

        @media (min-width: 1024px) {
            #zua-aside-v2-head {
                padding-top: 1rem;
                padding-bottom: 1rem;
            }
        }

        #zua-aside-v2-head > div:first-child {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        #zua-aside-v2-head .zua-aside-v2-logo-box {
            font-size: 1.1rem;
            width: 2.5rem;
            height: 2.5rem;
            background-color: var(--sg-color-brand);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            // box-shadow: 0 10px 15px -3px var(--sg-brand-shadow-color), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            color: white;
        }

        #zua-aside-v2-head h1 {
            font-size: 1.25rem;
            font-weight: bold;
            color: #111827;
            letter-spacing: -0.01em;
        }

        #zua-aside-v2-head p {
            font-size: 0.75rem;
            color: #9ca3af;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        #zua-aside-v2-head button {
            width: 2.8rem;
            height: 2.8rem;
            border-radius: 50%;
            border: none;
            background-color: transparent;
            cursor: pointer;
            color: #9ca3af;
            -webkit-transition: background-color 0.2s, color 0.2s;
            transition: background-color 0.2s, color 0.2s;
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            -webkit-justify-content: center;
            justify-content: center;
            font-size: 0;
        }

        #zua-aside-v2-head button:hover {
            background-color: #f3f4f6;
        }

        #zua-aside-v2-head button i {
            font-size: 1.1rem;
            display: block;
        }

        #zua-aside-v2-content {
            flex: 1;
            overflow-y: auto;
            padding-top: 1rem;
            padding-bottom: 1rem;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            scrollbar-width: thin;
        }

        #zua-aside-v2-content > div {
            margin-bottom: 1.5rem;
        }

        #zua-aside-v2-content ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        #zua-aside-v2-content li a {
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            padding: 0.5rem;
            color: #374151;
            border-radius: 0.8rem;
            -webkit-transition: all 0.3s ease;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        #zua-aside-v2-content li a:hover {
            background-color: var(--sg--color-brand-30);
            color: var(--sg-color-brand);
        }

        #zua-aside-v2-content li a.zua-aside-v2-nav-active {
            background-color: var(--sg--color-brand-30);
            color: var(--sg-color-brand);
            font-weight: 600;
        }

        #zua-aside-v2-content li a.zua-aside-v2-nav-active .zua-aside-v2-icon-box {
            background-color: white;
        }

        #zua-aside-v2-content li a.zua-aside-v2-nav-active .zua-aside-v2-icon-box i {
            color: var(--sg-color-brand);
        }

        #zua-aside-v2-content li a .zua-aside-v2-icon-box {
            padding: 0.4rem;
            border-radius: 0.5rem;
            background-color: #f9fafb;
            -webkit-transition: background-color 0.2s;
            transition: background-color 0.2s;
            margin-right: 0.75rem;
        }

        #zua-aside-v2-content li a:hover .zua-aside-v2-icon-box {
            background-color: white;
        }

        #zua-aside-v2-content li a .zua-aside-v2-icon-box i {
            color: var(--sg-color-brand);
            font-size: 1.1rem;
        }

        #zua-aside-v2-content li a span {
            font-weight: 500;
            font-size: 15px;
        }

        #zua-aside-v2-foot {
            display: blocl;
            padding: 1.5rem;
            background-color: #f9fafb;
            margin-top: auto;
        }

        @media (min-width: 768px) {
            // #zua-aside-v2-foot {
            //     display: block;
            // }
        }

        #zua-aside-v2-foot button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: none;
            background-color: transparent;
            cursor: pointer;
            width: 100%;
            gap: 0.5rem;
        }

        #zua-aside-v2-foot button > div {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        #zua-aside-v2-foot svg {
            width: 1rem;
            height: 1rem;
            color: #6b7280;
        }

        #zua-aside-v2-foot span {
            font-size: 0.75rem;
            font-weight: 500;
            color: #6b7280;
            transition: color 0.2s;
        }

        #zua-aside-v2-foot button:hover span {
            color: var(--sg-color-brand);
        }

        @-webkit-keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @media (max-width: 767px) {
            // #web-aside {
            //     max-width: 100%;
            // }
        }
    `;

    const ASIDE_TEMPLATE = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<div class="zua-aside-v2-root" data-sv="main-aside" data-purpose="navigation-overlay" aria-hidden="true">
    <div class="zua-aside-v2-overlay" data-sv="aside-overlay" aria-hidden="true"></div>
    <aside id="zua-aside-v2-panel" data-purpose="sidebar-panel" role="dialog" aria-modal="true" aria-label="Main menu">
        <section id="zua-aside-v2-head" data-purpose="sidebar-header">
            <div onclick="window.location.href='https://www.zuahouse.com/en/'" class="zua-aside-v2-logo" style="cursor: pointer;">
                <div class="zua-aside-v2-logo-box">
                    <i class="fa-regular fa-house"></i>
                </div>
                <div>
                    <h1>租个房-首页</h1>
                    <p></p>
                </div>
            </div>
            <button type="button" aria-label="Close menu" data-action="close-aside">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </section>

        <div id="zua-aside-v2-content" data-purpose="navigation-menu">
            <div>
                <ul>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-house"></i>
                            </div>
                            <span>租辆车-首页</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick="document.querySelector('.midlogo').scrollIntoView({behavior: 'smooth'})">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-car-side"></i>
                            </div>
                            <span>车库出租现车</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/long-term-rental-new?type=filter&amp;title=%E7%AD%9B%E9%80%89%E8%BD%A6%E8%BE%86">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-layer-group"></i>
                            </div>
                            <span>车库筛选</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar-question-page1">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-question"></i>
                            </div>
                            <span>为什么是租辆车？</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar-question-page3">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-sitemap"></i>
                            </div>
                            <span>租车流程</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar-question-page2">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-user-injured"></i>
                            </div>
                            <span>车主租赁信托</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar-reservation-form-home">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-calendar-check"></i>
                            </div>
                            <span>留言找车</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://t.me/fient888_bot?start=w51458001">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-headset"></i>
                            </div>
                            <span>在线客服</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/about-me">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-code-fork"></i>
                            </div>
                            <span>联系我们</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://m.luacar.com/...">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fas fa-car"></i>
                            </div>
                            <span>撸辆车-买二手车</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.zuacar.com/en/zuacar-question-page4">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                            <span>以租代购</span>
                        </a>
                    </li>
                    <li>
                        <a href="https://m.fi855.com/...">
                            <div class="zua-aside-v2-icon-box">
                                <i class="fa-solid fa-circle-right"></i>
                            </div>
                            <span>盈信官网</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <section id="zua-aside-v2-foot" data-purpose="sidebar-footer">
            <button type="button">
                <div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>中文 (简体)</span>
                </div>
            </button>
        </section>
    </aside>
</div>`;

    function getMainAside() {
        return document.querySelector('[data-sv="main-aside"]');
    }

    // function lockScroll(isLocked) {
    //     document.body.style.overflow = isLocked ? 'hidden' : '';
    // }

    function setAsideState(isOpen) {
        const mainAside = getMainAside();
        if (!mainAside) {
            return false;
        }

        mainAside.classList.toggle('aside-active', isOpen);
        mainAside.setAttribute('aria-hidden', String(!isOpen));
        // lockScroll(isOpen);
        return true;
    }

    function toggleAsite() {
        const mainAside = getMainAside();
        if (!mainAside) {
            return false;
        }

        const isOpen = mainAside.classList.contains('aside-active');
        return setAsideState(!isOpen);
    }

    function openAside() {
        return setAsideState(true);
    }

    function closeAside() {
        return setAsideState(false);
    }

    function ensureAsideStyles() {
        const existingStyle = document.getElementById(ASIDE_STYLE_ID);
        if (existingStyle) {
            return existingStyle;
        }

        const style = document.createElement('style');
        style.id = ASIDE_STYLE_ID;
        style.setAttribute('data-purpose', 'zuahouse-aside-v2-style');
        style.textContent = ASIDE_STYLE;
        document.head.appendChild(style);
        return style;
    }

    function mountAsideTemplate(targetSelector) {
        if (getMainAside()) {
            return getMainAside();
        }

        const target = targetSelector
            ? document.querySelector(targetSelector)
            : document.body;

        if (!target) {
            return null;
        }

        target.insertAdjacentHTML('beforeend', ASIDE_TEMPLATE);
        return getMainAside();
    }

    function bindAsideEvents(root) {
        root.addEventListener('click', function (event) {
            const trigger = event.target.closest('[data-action="toggle-aside"]');
            if (trigger) {
                toggleAsite();
                return;
            }

            const closeButton = event.target.closest('[data-action="close-aside"]');
            const overlay = event.target.closest('[data-sv="aside-overlay"]');

            if (closeButton || overlay) {
                closeAside();
            }
        });

        root.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeAside();
            }
        });
    }

    function setActiveNavItem() {
        const currentLocation = window.location;
        const links = document.querySelectorAll('#zua-aside-v2-content li a');

        links.forEach(function (link) {
            link.classList.remove('zua-aside-v2-nav-active');

            try {
                const linkUrl = new URL(link.href);
                const samePath = linkUrl.pathname === currentLocation.pathname;

                if (!samePath) return;

                // If link has search params, all of them must be present in current URL
                if (linkUrl.search) {
                    const linkParams = new URLSearchParams(linkUrl.search);
                    const currentParams = new URLSearchParams(currentLocation.search);
                    const allMatch = Array.from(linkParams.entries()).every(function (entry) {
                        return currentParams.get(entry[0]) === entry[1];
                    });
                    if (allMatch) link.classList.add('zua-aside-v2-nav-active');
                } else {
                    link.classList.add('zua-aside-v2-nav-active');
                }
            } catch (e) {
                // relative or invalid href — skip
            }
        });
    }

    function initAside(options) {
        const settings = options || {};
        ensureAsideStyles();
        mountAsideTemplate(settings.mountTo);
        bindAsideEvents(document);
        setActiveNavItem();
        closeAside();
    }

    if (typeof window !== 'undefined') {
        window.ASIDE_TEMPLATE = ASIDE_TEMPLATE;
        window.mountAsideTemplate = mountAsideTemplate;
        window.initAside = initAside;
        window.toggleAsite = toggleAsite;
        window.openAside = openAside;
        window.closeAside = closeAside;
        window.toggleMenu  = toggleAsite;
        window.toggleAside = toggleAsite;  // shim: fixes "toggleAside is not defined"
    }

    document.addEventListener('DOMContentLoaded', function () {
        initAside();
    });
})();