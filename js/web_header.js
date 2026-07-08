(function () {
    'use strict';

    const HEADER_STYLE_ID = 'zuacar-header-v1-style';

    // Only styles that the existing CSS doesn't cover
    const HEADER_STYLE = `
    
    .wb-main-action{
        position: fixed;
        bottom: -100%;
        right: -100%;
        bottom: 1.5rem;
        z-index: 10;
        background: transparent;
        opacity: 0;
        transition: opacity 0.3s ease, right 0.3s ease-in-out;
    }
    .wb-main-action.wb-show {
        opacity: 1;
        right: 1.5rem;
    }
    .wb-main-action .wbma-box{
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        @media screen and (max-width: 768px) {
            gap: 0.5rem;
        }
    }
    .wb-main-action .wbma-box .icon{
        width: 3.5rem;
        height: 3.5rem;
        color: var(--sg-bglight);
        background: var(--sg-bglight);
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    }
    .wb-main-action .wbma-box .icon path{
        stroke: var(--sg-color-brand);
    }
    .wb-main-action .wbma-box .icon:last-child{
        background: var(--sg-color-brand);
    }
    .wb-main-action .wbma-box .icon:last-child path{
        stroke: var(--sg-bglight);
    }
    /* ===================this is all style for header  */
    .wbt-h{
        display: block;
        margin: 0 auto;
        background: linear-gradient(135deg, rgb(255, 115, 27) 0%, rgb(230, 74, 25) 100%);
        color: #ffffff;
        box-shadow: 0 4px 15px rgba(255, 115, 27, 0.35);
        transition: transform 0.2s ease, filter 0.2s ease;
    }
    .wbt-h .wbt-box{
        padding: 0.3rem 0rem;
        font-size: 0.8rem;
        color: var(--sg-bglight);
        max-width: 1150px;
        margin: 0 auto;
        @media screen and (max-width: 1150px) {
            width: initial;
            margin: 0rem 0.5rem;
        }
    }
    .wbt-h .wbt-box h2,
    .wbt-h .wbt-box .btn{
        font-size: 0.8rem;
    }
    .wbt-h .wbt-box .wbth-action{
        gap: 0.5rem;
    }
    .wbt-h .wbt-box .btn{
        height: 1.7rem;
        color: var(--sg-color-brand);
    }
    .web-header{
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--sg-bglight);
        box-shadow: rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 2px 2px -1px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px, rgba(42, 51, 70, 0.03) 0px 10px 10px -5px, rgba(42, 51, 70, 0.03) 0px 24px 24px -8px;
    }
    .web-header .wbh-box{
        max-width: 1150px;
        margin: 0 auto;
        height: 80px;
    }
    .web-header .row .btn-open-menu{
        width: 2.8rem;
        height: 2.8rem;
        cursor: pointer;
    }
    .web-header .row .wb-logo{
        /* margin-left: 2rem; */
        margin-right: 1rem;
    }
    .web-header .row .btn-open-menu svg{
        width: 2rem;
    }
    .web-header .row .wbl-box{
        gap: 1rem;
    }
    .web-header .row .wbl-box .img img{
        height: 60px;
    }
    .web-header .row .wbl-box h1{
        font-size: 2rem;
        color: var(--sg-color-logo);
    }
    .web-header .row:nth-child(2){
        flex: 1;
        margin: 0 1rem;
    }
    .web-header .row .wbs-box{
        height: 2.8rem;
        border: 2px solid var(--sg-border-color-input);
        border-radius: 50rem;
        background: var(--sg-bglight);
    }
    .web-header .row .wbs-box:has(input:focus){
        font-weight: 500;
        font-size: 1rem;
        box-shadow: var(--sg-boxshadow-input);
        border-color: var(--sg-color-brand);
    }
    .web-header .row .wbs-box input{
        flex: 1;
        margin-right: 0.5rem;
    }
    .web-header .row .wbs-box .icon{
        width: 2.8rem;
        height: 2.8rem;
        cursor: pointer;
    }
    .web-header .row .wbs-box .icon:active{
        box-shadow: none;
    }
    .web-header .row .btn-customer-service{
        cursor: pointer;
        gap: 0.5rem;
        height: 2.8rem;
        padding: 0.8rem;
        border-radius: 50rem;
        color: var(--sg-color-brand);
        transition: transform 0.2s ease, filter 0.2s ease;
        box-sizing: border-box;
        border: 1px solid var(--light-gray);
    }
    .web-header .row .btn-customer-service:hover{
        background: linear-gradient(135deg, rgb(255, 115, 27) 0%, rgb(230, 74, 25) 100%);
        color: #ffffff;
    }
    @media screen and (max-width: 1150px) {
        .web-header .wbh-box{
            width: initial;
            margin: 0rem 0.5rem;
        }
    }
    @media screen and (max-width: 650px) {
        .web-header .wbh-box{
            height: 60px;
        }
        .web-header .row .wbl-box{
            gap: 0.5rem;
        }
        .web-header .row .wbl-box .img img{
            height: 50px;
        }
        .web-header .row .wbl-box h1{
            font-size: 1.4rem;
        }
        .web-header .row .wbs-box input{
            display: none;
        }
        .web-header .row:nth-child(2){
            width: max-content;
            margin: 0rem 0rem;
            margin-left: auto;
            flex: none;
            border: none;
        }
        .web-header .row .wbs-box .icon{
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50rem;
        }
        .web-header .row .wbs-box{
            border: none;
        }
        .web-header .row .btn-customer-service{
            padding: 0rem;
            width: 2.5rem;
            height: 2.5rem;
            color: var(--sg-color-brand);
            border: none;
        }
        .web-header .row .btn-customer-service svg{
            width: 1.6rem;
        }
        .web-header .row .btn-customer-service path{
            stroke: var(--sg-color-brand);
        }
        .web-header .row .btn-customer-service span{
            display: none;
        }
    }
    @media screen and (max-width: 540px){
        .web-header .wbh-box{
            position: relative;
        }
        .web-header .row .wb-logo{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    /* this all style tab link  */
    .web-tablink{
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0rem;
        z-index: 999;
        background: var(--sg-bglight);
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
        display: none;
        @media screen and (max-width: 650px) {
            display: block;
        }
    }
    .wbtl-s9 .wbtl-box{
        width: 100%;
        margin: 0rem 0.3rem;
        padding-top: 0.3rem;
        padding-bottom: 0.5rem;
        max-height: 75px;
    }
    .wbtl-s9 .wbtl-box .row{
        flex: 1;
        text-align: center;
        background: transparent;
        padding: 0.3rem 0rem;
        cursor: pointer;
    }
    .wbtl-s9 .wbtl-box .row.active{
        border-radius: 50rem;
        background: var(--sg-bg-tablink);
    }
    .wbtl-s9 .wbtl-box .row .icon{
        width: 2rem;
        padding-top: 0.2rem;
        height: max-content;
        margin: 0rem auto;
    }
    .wbtl-s9 .wbtl-box .row .icon svg{
        width: 1.7rem;
    }
    .wbtl-s9 .wbtl-box .row .icon path{
        stroke: var(--sg-color-brand);
    }
    .wbtl-s9 .wbtl-box .row.active path{
        stroke: var(--gold);
    }
    .wbtl-s9 .wbtl-box .row span{
        font-size: 0.75rem;
        text-align: center;
        display: block;
        margin-top: -0rem;
    }
    .wbtl-s9 .wbtl-box .row.active span{
        color: var(--gold);
    }

    /* .wbtl-s9 .wbtl-box .row:nth-child(3){
        max-width: 4.5rem;
        position: relative;
        top: -0.8rem;
        color: var(--sg-bglight);
        border-radius: 50rem;
        background: var(--sg-color-brand);
    }
    .wbtl-s9 .wbtl-box .row:nth-child(3) .icon{
        width: max-content;
        height: max-content;
        padding-top: 0.5rem;
    }
    .wbtl-s9 .wbtl-box .row:nth-child(3) span{
        display: block;
        margin: 0 auto;
        padding-bottom: 1rem;
    }
    .wbtl-s9 .wbtl-box .row:nth-child(3) path{
        stroke: var(--sg-bglight);
    } */
    /* ================================= */
    .wbs-model{
        position: fixed;
        width: 100%;
        height: 100vh;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.281);
        z-index: 9999;
        opacity: 0;
        transform: scale(0);
        @media screen and (max-width: 550px) {
            align-items: end;
            transform: scale(1);
            bottom: -100%;
            background: transparent;
        }
    }
    .wbs-model.active{
        transform: scale(1);
        opacity: 1;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        @media screen and (max-width: 550px) {
            bottom: 0%;
        }
    }
    body:has(.wbs-model.active){
        overflow: hidden !important;
    }
    .wbs-model .wbsm-box{
        position: relative;
        max-width: 1150px;
        width: 100%;
        height: fit-content;
        max-height: calc(100% - 2rem);
        border-radius: 0.5rem;
        background: var(--light-gray);
        overflow: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        transform: scale(0);
        opacity: 0;
        transition: all 0.9s ease-in-out;
        @media screen and (max-width: 1150px) {
            width: calc(100% - 1rem);
        }
        @media screen and (max-width: 550px) {
            max-width: 100%;
            width: 100%;
            border-radius: 0.8rem 0.8rem 0rem 0rem;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        }
    }
    .wbs-model.active .wbsm-box{
        opacity: 1;
        transform: scale(1);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .wbs-model .hd{
        position: sticky;
        top: 0rem;
        background: var(--sg-bglight);
        border-radius: 0.5rem 0.5rem 0rem 0rem;
        z-index: 10;
    }
    .wbs-model .hd-box{
        height: 80px;
        padding: 0rem 0.8rem;
        @media screen and (max-width: 450px) {
            padding: 0rem 0.5rem;
        }
    }
    .wbs-model .hd-box .icon{
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50rem;
        cursor: pointer;
    }
    .wbs-model .hd-box .icon.x-smodel{
        rotate: 45deg;
    }
    .wbs-model .hd-box .icon.x-smodel svg{
        width: 2rem;
    }
    .wbs-model .hd-box .icon.x-smodel:hover{
        background: var(--sg--color-brand-30);
    }
    .wbs-model .hd-box .sh-box{
        flex: 1;
        margin: 0rem 1rem;
        margin-right: 0.5rem;
        overflow: hidden;
        border-radius: 0.5rem;
        outline: 1px solid transparent;
        background: var(--light-gray);
        @media screen and (max-width: 450px) {
            margin: 0rem 0.5rem;
        }
    }
    .wbs-model .hd-box .sh-box input{
        flex: 1;
        height: 2.5rem;
        font-size: 1rem;
        border: none;
        outline: none;
    }
    .wbs-model .hd-box .sh-box input::placeholder {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .wbs-model .hd-box .sh-box:has(input:focus){
        /* outline: 2px solid var(--sg-color-brand);
        box-shadow: var(--sg-box-shadow-input-hover); */
    }
    .wbs-model .hd-box .sh-box .icon:active{
        box-shadow: none;
        cursor: default;
    }
    .wbs-model .hd-box .sh-box .icon path{
        stroke: rgb(129, 129, 130);
    }
    .wbs-model .hd-box .btn{
        height: 2.5rem;
        padding: 0rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        color: var(--sg-color-brand);
        box-sizing: border-box;
        /* border: 1px solid var(--sg-color-brand); */
        box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
        @media screen and (max-width: 650px) {
            padding: 0rem 1rem;
        }
        @media screen  and (max-width: 400px) {
            padding: 0rem 0.5rem;       
        }
    }
    .wbs-model .hd-box .btn:hover{
        color: var(--sg-color-brand-hover);
        background: var(--sg--color-brand-30);
    }
    .wbs-model .hd-box .btn:active{
        transform: scale(0.95);
        color: var(--sg-bglight);
        background: var(--sg-color-brand);
    }

    .wbs-model .slt{
        padding: 1rem 0.8rem;
        @media screen and (max-width: 650px) {
            padding: 1rem 0.5rem;
        }
    }
    .wbs-model .slt-box{
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
    .wbs-model .slth{
        padding: 0.8rem 0rem;
    }
    .wbs-model .slth h2{
        font-size: 1.2rem;
    }
    .wbs-model .slt-box li{
        position: relative;
    }
    .wbs-model .slt-box li .l-box{
        padding: 0.8rem 0.5rem;
        display: flex;
        align-items: center;
        justify-content: left;
        gap: 0.7rem;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .wbs-model .slt-box li .l-box::before{
        content: '';
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50rem;
        background: var(--sg-color-brand);
    }
    .wbs-model .slt-box li .l-box:hover{
        background: var(--sg--color-brand-30);
    }
    .wbs-model .slt-box li .l-box:active{
        transform: scale(0.95);
    }
    .wbs-model .sg{
        margin: 1rem;
        overflow: hidden;
        border-radius: 0.8rem;
        background: var(--sg-gradient-brand);
        @media screen and (max-width: 650px) {
            margin: 1rem 0.5rem;
        }
    }
    .wbs-model .sg-box{
        padding: 1rem;
        min-height: 250px;
    }
    .wbs-model .sg-box .text{
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    .wbs-model .sg-box blockquote{
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        color: var(--sg-bglight);
        flex: 1;
        margin-right: 0.8rem;
    }
    .wbs-model .sg-box blockquote h2{
        font-size: 1.2rem;
        font-weight: 600;
        @media screen and (max-width: 450px) {
            font-size: 1rem;
        }
    }
    .wbs-model .sg-box blockquote p{
        max-width: 600px;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        overflow: hidden;
        position: relative;
        @media screen and (max-width: 450px) {
            font-size: 0.8rem;
        }
    }
    .wbs-model .sg-box .text .btn{
        color: var(--sg-color-brand);
        background: var(--sg-bglight);
        border-color: transparent;
        margin-top: 1rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .wbs-model .sg-box .text .btn:hover{
        color: var(--sg-color-brand);
        background: var(--sg-bglight);
        border-color: transparent;
    }
    .wbs-model .sg-box .logo{
        max-width: 160px;
        background: var(--sg-bglight);
        aspect-ratio: 1/1;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }
    .wbs-model .sg-box .logo img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .wbs-model .cs{
        margin: 1rem;
        @media screen and (max-width: 650px) {
            margin: 1rem 0.5rem;
        }
    }
    .wbs-model .cs-box .csh{
        padding: 0.8rem 0rem;
    }
    .wbs-model .cs-box .csh h2{
        font-size: 1.2rem;
    }
    .wbs-model .csc-box{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.3rem;
        @media screen and (max-width: 540px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media screen and (max-width: 400px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }
    .wbs-model .csc-box li:hover{
        transform: translateY(-5px);
        border-radius: 0.5rem;
        background: var(--sg-bglight);
        box-shadow: inset 0 0 0 1px var(--sg-color-brand), 0 6px 20px var(--sg-brand-shadow-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.5rem 0.5rem;
    }
    .wbs-model .csc-box li .img{
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        border-radius: 0.2rem;
        background: var(--sg--color-brand-30);
    }
    .wbs-model .csc li .img img{
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .wbs-model .csc li:hover .img img{
        transform: scale(1.05);
    }
    .wbs-model .csc-box li .text{
        padding: 1rem 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    .wbs-model .csc-box li .text h2{
        font-size: 1rem;
        font-weight: 600;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }
    .wbs-model .csc-box li .price span{
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--sg-color-brand);
    }
    .wbs-model .csc-box li .btn{
        cursor: pointer;
        color: var(--sg-color-brand);
        background: transparent;
        border: 1px solid var(--sg-border-00);
    }
    .wbs-model .csc-box li:hover .btn{
        border-color: transparent;
    }

    .wbs-model .ft{
        position: sticky;
        bottom: 0;
        width: 100%;
        padding: 1rem 0rem;
        background: var(--light-gray);
    }
    .wbs-model .ft-box{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        height: 40px;
        font-size: 0.9rem;
        color: rgb(129, 129, 130);
        @media screen and (max-width: 650px) {
            height: max-content;
        }
    }
    /* ========this is end search model======== */
    `;

    const HEADER_TEMPLATE = `
    <div class="wbt-h">
        <div class="wbt-box df-s">
            <h2>服务热线</h2>
            <div class="wbth-action df-l">
                <a href="#" class="btn">096-9859-888</a>
                <a href="#" class="btn">078-859-888</a>
            </div>
        </div>
    </div>
    <div class="web-header">
        <div class="wbh-box df-s">
            <div class="row df-l">
                <div class="icon icon-ra icon-sm btn-open-menu" onclick="toggleAside()" data-action="toggle-aside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="#ff731b" stroke-width="1.5" stroke-linecap="round"></path></svg>
                </div>
                <a href="#" class="wb-logo">
                    <div class="wbl-box df-l">
                        <div class="img">
                            <img src="https://license.fi855.com/web/content/336619/favicon.png" class="img-c" alt="">
                        </div>
                        <div class="text">
                            <h1>撸辆车</h1>
                        </div>
                    </div>
                </a>
            </div>
            <div class="row">
                <div class="wb-search" onclick="document.querySelector('#wbsModel').classList.toggle('active')" data-action="toggle-search-model">
                    <div class="wbs-box df-l">
                        <div class="icon icon-ra icon-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </div>
                        <input type="text" class="wbs-input" placeholder="品牌、型号、年份、参数，任意搜索，点我试试"/>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="box">
                    <a href="#" class="btn btn-customer-service">
                        <span>在线客服</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                            <path d="M4 20c0-3.31 2.69-6 6-6h4c3.31 0 6 2.69 6 6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6.5 9A5.5 5.5 0 0 1 12 3.5 5.5 5.5 0 0 1 17.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <rect x="5" y="7.5" width="2" height="3" rx="1" />
                            <rect x="17" y="7.5" width="2" height="3" rx="1" />
                            <path d="M18 10c0 1.5-1 2.5-2.5 2.5H13" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="wb-main-action">
        <div class="wbma-box">
            <div class="icon icon-ra icon-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path stroke="#FF8A65" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M18.07 9.57L12 3.5 5.93 9.57M12 20.5V3.67"></path></svg>
            </div>
            <div class="icon icon-ra icon-sm">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.414 28.414 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z" stroke="#FF8A65" stroke-width="1.5" stroke-miterlimit="10"></path><path d="M18.5 9c0-.6-.47-1.52-1.17-2.27-.64-.69-1.49-1.23-2.33-1.23M22 9c0-3.87-3.13-7-7-7" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </div>
        </div>
    </div>
    <div class="web-tablink wbtl-s9">
        <div class="wbtl-box df-s">
            <!-- home webpage  -->
            <div class="row active">
                <div class="icon icon-ra">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="m9.02 2.84-5.39 4.2C2.73 7.74 2 9.23 2 10.36v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21V10.5c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12ZM12 17.99v-3" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
                <span>首页</span>
            </div>
            <!-- product filtter  -->
            <div class="row">
                <div class="icon icon-ra">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="filter-circle"> <path id="vector" d="M2 17.5H7" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_2" d="M22 6.5H17" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_3" d="M13 17.5H22" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_4" d="M11 6.5H2" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_5" d="M10 20.3999C8.34315 20.3999 7 19.0568 7 17.3999C7 15.743 8.34315 14.3999 10 14.3999C11.6569 14.3999 13 15.743 13 17.3999C13 19.0568 11.6569 20.3999 10 20.3999Z" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path id="vector_6" d="M14 9.3999C15.6569 9.3999 17 8.05676 17 6.3999C17 4.74305 15.6569 3.3999 14 3.3999C12.3431 3.3999 11 4.74305 11 6.3999C11 8.05676 12.3431 9.3999 14 9.3999Z" stroke="#000000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g> </g></svg>
                </div>
                <span>筛选</span>
            </div>
            <!-- customer service  -->
            <div class="row">
                <div class="icon icon-ra">
                    <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:var(--sg-color_brand);stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><rect class="cls-1" x="6.27" y="5.32" width="11.45" height="15.27" rx="5.73"></rect><path class="cls-1" d="M17.73,9.14h1.91A2.86,2.86,0,0,1,22.5,12v1.91a2.86,2.86,0,0,1-2.86,2.86H17.73a0,0,0,0,1,0,0V9.14A0,0,0,0,1,17.73,9.14Z"></path><path class="cls-1" d="M1.5,9.14H3.41A2.86,2.86,0,0,1,6.27,12v1.91a2.86,2.86,0,0,1-2.86,2.86H1.5a0,0,0,0,1,0,0V9.14A0,0,0,0,1,1.5,9.14Z" transform="translate(7.77 25.91) rotate(180)"></path><path class="cls-1" d="M4.36,9.14h0A7.64,7.64,0,0,1,12,1.5h0a7.64,7.64,0,0,1,7.64,7.64h0"></path><path class="cls-1" d="M19.64,16.77v1a4.78,4.78,0,0,1-4.78,4.77"></path></g></svg>
                </div>
                <span>在线客服</span>
            </div>
            <!-- new truck -->
            <div class="row">
                <div class="icon icon-ra">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M15.51 2.83H8.49C6 2.83 5.45 4.07 5.13 5.59L4 11h16l-1.13-5.41c-.32-1.52-.87-2.76-3.36-2.76ZM21.99 19.82c.11 1.17-.83 2.18-2.03 2.18h-1.88c-1.08 0-1.23-.46-1.42-1.03l-.2-.6c-.28-.82-.46-1.37-1.9-1.37H9.44c-1.44 0-1.65.62-1.9 1.37l-.2.6C7.15 21.54 7 22 5.92 22H4.04c-1.2 0-2.14-1.01-2.03-2.18l.56-6.09C2.71 12.23 3 11 5.62 11h12.76c2.62 0 2.91 1.23 3.05 2.73l.56 6.09ZM4 8H3M21 8h-1M12 3v2M10.5 5h3M6 15h3M15 15h3" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </div>
                <span>四驱</span>
            </div>
            <!-- go to rent house -->
            <div class="row">
                <div class="icon icon-ra">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5 9.5L10 13H14L11.5 16.5M3 14.6V12.1301C3 10.9814 3 10.4071 3.14805 9.87813C3.2792 9.4096 3.49473 8.96892 3.78405 8.57774C4.11067 8.13614 4.56404 7.78352 5.47078 7.07828L8.07078 5.05606C9.47608 3.96304 10.1787 3.41654 10.9546 3.20646C11.6392 3.0211 12.3608 3.0211 13.0454 3.20646C13.8213 3.41654 14.5239 3.96305 15.9292 5.05606L18.5292 7.07828C19.436 7.78352 19.8893 8.13614 20.2159 8.57774C20.5053 8.96892 20.7208 9.4096 20.8519 9.87813C21 10.4071 21 10.9814 21 12.1301V14.6C21 16.8402 21 17.9603 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C17.9603 21 16.8402 21 14.6 21H9.4C7.15979 21 6.03969 21 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43597 18.816C3 17.9603 3 16.8402 3 14.6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </div>
                <span>租辆车</span>
            </div>
        </div>
    </div>
    <div class="wbs-model" id="wbsModel">
        <div class="wbsm-box">
            <!--header-->
            <div class="hd">
                <div class="hd-box df-s">
                    <div class="icon icon-la icon-sm x-smodel" onclick="document.querySelector('#wbsModel').classList.toggle('active')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M12 18V6" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <div class="sh-box df-s">
                        <div class="icon icon-ra icon-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </div>
                        <input type="text" placeholder="品牌、型号、年份、参数，任意搜索，点我试试"/>
                    </div>
                    <button type="submit" class="btn">
                        搜索
                    </button>
                </div>
            </div>
            <!--this is popular search text list-->
            <div class="search-list-text slt">
                <div class="slth">
                    <h2>受欢迎的搜索</h2>
                </div>
                <ul class="slt-box">
                    <li>
                        <div class="l-box">
                            点我试试
                        </div>
                    </li>
                    <li>
                        <div class="l-box">
                            点我试试
                        </div>
                    </li>
                    <li>
                        <div class="l-box">
                            任意搜索
                        </div>
                    </li>
                    <li>
                        <div class="l-box">
                            任意搜索
                        </div>
                    </li>
                </ul>
            </div>
            <!--Web Slogan-->
            <div class="sg">
                <div class="sg-box df-s">
                    <div class="text">
                        <blockquote>
                            <h2>撸辆车LuAcar “安心服务包”</h2>
                            <p> 撸辆车LuAcar，全柬最大的二手车中文平台，由资深服务品牌“盈信商业服务”倾力打造。</p>
                        </blockquote>
                        <div class="btn">
                            盈信商业服务
                        </div>
                    </div>
                    <div class="logo">
                        <img src="https://license.fi855.com/web/content/336619/favicon.png" alt="盈信商业服务 Logo"/>
                    </div>
                </div>
            </div>
            <!--this is car suggestion section-->
            <div class="cs">
                <div class="cs-box">
                    <div class="csh">
                        <h2>为您推荐</h2>
                    </div>
                    <div class="csc">
                        <ul class="csc-box" id="carSuggestionList">
                            <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                             <li>
                                <div class="csl-box">
                                    <div class="img">
                                        <img src="https://d1ytnvewg96nod.cloudfront.net/images/CVAN1689/1.jpg" class="img-c" alt="S400"/>
                                    </div>
                                    <div class="text">
                                        <h2>2003 汉兰达 Highlander</h2>
                                        <div class="price">
                                            <span>$500 - $550</span>
                                        </div>
                                    </div>
                                    <div class="btn">
                                        查看详情
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="ft">
                <div class="ft-box">
                    撸辆车 luacar.com
                </div>
            </div>
        </div>
    </div>
    `;

    /* ─────────────── helpers ─────────────── */

    function getHeader() {
        return document.querySelector('[data-sv="main-header"]');
    }

    function getLangDropdown() {
        return document.getElementById('lang-dropdown');
    }

    /* ─────────────── lang dropdown ─────────────── */

    function setLangState(isOpen) {
        const dropdown = getLangDropdown();
        if (!dropdown) return;
        dropdown.classList.toggle('lang-open', isOpen);
    }

    function toggleLang() {
        const dropdown = getLangDropdown();
        if (!dropdown) return;
        setLangState(!dropdown.classList.contains('lang-open'));
    }

    function closeLang() {
        setLangState(false);
    }

    /* ─────────────── search ─────────────── */

    function handleSearch(query) {
        if (typeof window.onHeaderSearch === 'function') {
            window.onHeaderSearch(query);
        }
    }

    /* ─────────────── styles ─────────────── */

    function ensureHeaderStyles() {
        if (document.getElementById(HEADER_STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = HEADER_STYLE_ID;
        style.setAttribute('data-purpose', 'zuacar-header-v1-style');
        style.textContent = HEADER_STYLE;
        document.head.appendChild(style);
    }

    /* ─────────────── mount ─────────────── */

    function mountHeaderTemplate(targetSelector) {
        if (getHeader()) return getHeader();

        const target = targetSelector
            ? document.querySelector(targetSelector)
            : document.body;

        if (!target) return null;

        target.insertAdjacentHTML('afterbegin', HEADER_TEMPLATE);
        return getHeader();
    }

    /* ─────────────── scroll check ─────────────── */
    function checkScrollVisibility() {
        const mainActionEl = document.querySelector('.wb-main-action');
        if (!mainActionEl) return;

        // Triggers as soon as user scrolls 100px past top
        if (window.scrollY > 100) {
            mainActionEl.classList.add('wb-show');
        } else {
            mainActionEl.classList.remove('wb-show');
        }
    }

    /* ─────────────── events ─────────────── */

    function bindHeaderEvents(root) {
        root.addEventListener('click', function (event) {
            // Hamburger menu
            if (event.target.closest('[data-action="toggle-aside"]')) {
                if (typeof window.toggleAsite === 'function') window.toggleAsite();
                return;
            }

            // Lang toggle button
            if (event.target.closest('[data-action="toggle-lang"]')) {
                toggleLang();
                return;
            }

            // Lang item clicked
            const langItem = event.target.closest('#lang-dropdown li');
            if (langItem) {
                document.querySelectorAll('#lang-dropdown li')
                    .forEach(function (li) { li.classList.remove('lang-active'); });
                langItem.classList.add('lang-active');
                closeLang();
                return;
            }

            // Click anywhere else
            if (!event.target.closest('.lang-selector')) {
                closeLang();
            }
        });

        // Search input
        root.addEventListener('input', function (event) {
            if (event.target.matches('[data-action="search-input"]')) {
                handleSearch(event.target.value);
            }
        });

        // Escape key closes lang dropdown
        root.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeLang();
        });

        // FIXED: Moved outside the click listener block so it registers immediately
        window.addEventListener('scroll', checkScrollVisibility, { passive: true });
    }

    /* ─────────────── init ─────────────── */

    function initHeader(options) {
        const settings = options || {};
        ensureHeaderStyles();
        mountHeaderTemplate(settings.mountTo);
        bindHeaderEvents(document);
        checkScrollVisibility();
    }

    /* ─────────────── public API ─────────────── */

    if (typeof window !== 'undefined') {
        window.HEADER_TEMPLATE     = HEADER_TEMPLATE;
        window.mountHeaderTemplate = mountHeaderTemplate;
        window.initHeader          = initHeader;
        window.toggleLang          = toggleLang;
        window.closeLang           = closeLang;
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
    });
})();