// API 配置和管理
if (typeof API_CONFIG === 'undefined') {
    var API_CONFIG = {
        BASE_URL: 'https://license.fi855.com/',
        ENDPOINTS: {
            CARS: '/website/action/zuacar'
        },
        IMAGE_BASE_URL: 'https://d1ytnvewg96nod.cloudfront.net/images'
    };
}

/**
 * 获取车辆列表数据
 * @returns {Promise<Array>} 车辆数据数组
 */
async function fetchCars() {
    try {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARS;
        console.log('API调试 - 请求URL:', url);
        
        const response = await fetch(url);
        console.log('API调试 - 响应状态码:', response.status);
        console.log('API调试 - 响应是否成功:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API调试 - 完整响应数据:', data);
        console.log('API调试 - 数据类型:', typeof data);
        console.log('API调试 - 是否为数组:', Array.isArray(data));
        
        // 如果是数组直接返回，否则查找 data.result 或其他可能的字段
        if (Array.isArray(data)) {
            console.log('API调试 - 返回数组，长度:', data.length);
            return data;
        }
        
        // 尝试多个可能的数据位置
        const possibleResults = [
            data.result,
            data.data,
            data.records,
            data.cars,
            data.vehicles,
            data.items
        ];
        
        for (let result of possibleResults) {
            if (Array.isArray(result) && result.length > 0) {
                console.log('API调试 - 在嵌套字段中找到数据，长度:', result.length);
                return result;
            }
        }
        
        console.warn('API调试 - 没有找到有效的数据数组，返回空数组');
        return [];
        
    } catch (error) {
        console.error('API调试 - 请求失败/错误:', error);
        console.error('API调试 - 错误类型:', error.name);
        console.error('API调试 - 错误信息:', error.message);
        console.error('API调试 - 错误堆栈:', error.stack);
        // 返回空数组作为降级方案
        return [];
    }
}

/**
 * 根据字段ID获取car数据
 * @param {String} fieldId - x_studio_char_field_9hg_1i5fmkpet 值 或 x_original_ids 值
 * @param {Number} imageNumber - 图片编号
 * @returns {String} 完整的图片URL
 */
function getCarImageUrl(fieldId, imageNumber = 1) {
    // 如果没有fieldId或为'default'，返回占位符
    if (!fieldId || fieldId === 'default') {
        console.warn(`⚠️ 图片ID为空或无效: ${fieldId}，第${imageNumber}张图片将无法加载`);
        // 返回一个占位图片URL，而不是空字符串
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7luLjnp43po47or4E8L3RleHQ+PC9zdmc+';
    }
    return `${API_CONFIG.IMAGE_BASE_URL}/${fieldId}/${imageNumber}.jpg`;
}

/**
 * 格式化价格范围显示
 * @param {Number|null} priceMin - 最低月租价格 (x_price_min)
 * @param {Number|null} priceMax - 最高月租价格 (x_price_max)
 * @returns {String} 格式化后的价格范围，如 "1,500 - 2,000"
 */
function formatPriceRange(priceMin, priceMax) {
    const hasMin = priceMin !== null && priceMin !== undefined && priceMin !== false && priceMin !== 0;
    const hasMax = priceMax !== null && priceMax !== undefined && priceMax !== false && priceMax !== 0;

    if (!hasMin && !hasMax) return '来电咨询';

    const fmt = n => Number(n).toLocaleString('en-MY');

    if (hasMin && hasMax) return `${fmt(priceMin)} - ${fmt(priceMax)}`;
    if (hasMin) return `${fmt(priceMin)} 起`;
    return `${fmt(priceMax)} 以下`;
}

/**
 * 转换引擎排量单位（返回数字，用于数据处理和筛选）
 * @param {String|Number} engineSize - 引擎排量数值（char类型，如"1.5"、"2.0"）
 * @returns {Number} 转换后的数字值，用于筛选和比较
 */
function formatEnginePower(engineSize) {
    if (!engineSize || engineSize === '' || engineSize === '0') return 0;
    // 处理char类型：去除空格，转换为float
    const value = parseFloat(String(engineSize).trim());
    return isNaN(value) ? 0 : value;
}

/**
 * 转换引擎排量为显示格式（返回字符串，用于UI显示）
 * @param {String|Number} engineSize - 引擎排量
 * @returns {String} 格式化显示的L值（如"1.5 L"）
 */
function formatEnginePowerDisplay(engineSize) {
    const value = formatEnginePower(engineSize);
    return value > 0 ? value.toFixed(1) + ' L' : '-';
}

/**
 * 转换引擎汽缸数量（返回数字，用于数据处理和筛选）
 * @param {String|Number} powerUnit - 汽缸数量（char类型，如"4"、"6"）
 * @returns {Number} 转换后的数字值，用于筛选和比较
 */
function formatCylinders(powerUnit) {
    if (!powerUnit || powerUnit === '' || powerUnit === '0') return 0;
    // 处理char类型：去除空格，转换为int
    const value = parseInt(String(powerUnit).trim());
    return isNaN(value) ? 0 : value;
}

/**
 * 转换引擎汽缸数量为显示格式（返回字符串，用于UI显示）
 * @param {String|Number} powerUnit - 汽缸数量
 * @returns {String} 格式化显示的汽缸数（如"4缸"）
 */
function formatCylindersDisplay(powerUnit) {
    const value = formatCylinders(powerUnit);
    return value > 0 ? value + '缸' : '-';
}

/**
 * 燃料类型中英文映射
 * Odoo API返回的是英文值，此处进行中文转换
 * 映射关系如下：
 * - diesel -> 柴油
 * - gasoline -> 汽油
 * - full_hybrid -> 全混合
 * - plug_in_hybrid_diesel -> 插电式混合动力柴油机
 * - plug_in_hybrid_gasoline -> 插电式混合动力汽车 汽油
 * - cng -> CNG
 * - lpg -> LPG
 * - hydrogen -> 液态氢
 * - electric -> 新能源汽车
 */
const FUEL_TYPE_MAP = {
    'diesel': '柴油',
    'gasoline': '汽油',
    'full_hybrid': '全混合',
    'plug_in_hybrid_diesel': '插电式混合动力柴油机',
    'plug_in_hybrid_gasoline': '插电式混合动力汽车 汽油',
    'cng': 'CNG',
    'lpg': 'LPG',
    'hydrogen': '液态氢',
    'electric': '新能源汽车'
};

/**
 * 转换燃料类型为中文
 * @param {String} fuelType - 英文燃料类型
 * @returns {String} 中文燃料类型
 */
function formatFuelType(fuelType) {
    if (!fuelType) return '';
    return FUEL_TYPE_MAP[fuelType.toLowerCase()] || fuelType;
}

/**
 * 构建车辆卡片信息
 * @param {Object} carData - 来自API的车辆数据
 * @returns {Object} 处理后的车辆数据
 */
function processCarData(carData) {
    // 处理 model_id - 可能是数组或字符串
    let modelId = '';
    if (Array.isArray(carData.model_id)) {
        modelId = carData.model_id[1] || carData.model_id[0] || '';
    } else if (typeof carData.model_id === 'string') {
        modelId = carData.model_id;
    }
    
    // 处理 modelName - 优先使用 model_id_name，否则使用 modelId
    let modelName = carData.model_id_name || modelId || '未知车型';
    
    // 处理 brand_id - 可能是数组[id, "名称"]或字符串
    let brandId = '';
    if (Array.isArray(carData.brand_id)) {
        brandId = carData.brand_id[1] || carData.brand_id[0] || '';
    } else if (typeof carData.brand_id === 'string') {
        brandId = carData.brand_id;
    }
    
    // 处理 state_id - 可能是数组[id, "名称"]或字符串
    let stateId = '';
    let stateName = '';
    if (Array.isArray(carData.state_id)) {
        stateId = carData.state_id[0] || '';
        stateName = carData.state_id[1] || '';
    } else if (typeof carData.state_id === 'string') {
        stateName = carData.state_id;
    }
    
    // 根据state_id判断是否为模型车辆
    let isModelCar = stateName.includes('模型车辆') || stateName.includes('ឡានបង្ហាញ');
    
    // 根据车辆类型选择使用哪个字段作为图片ID
    let imageId = '';
    if (isModelCar) {
        // 模型车辆：使用 x_original_ids
        imageId = carData.x_original_ids || carData.x_studio_char_field_9hg_1i5fmkpet || 'default';
    } else {
        // 普通车辆（空闲车辆）：使用 fieldId
        imageId = carData.x_studio_char_field_9hg_1i5fmkpet || 'default';
    }
    
    console.log('处理车辆数据:', {
        id: carData.id,
        model_id: carData.model_id,
        model_id_name: carData.model_id_name,
        处理后的modelId: modelId,
        处理后的modelName: modelName,
        brand_id: carData.brand_id,
        处理后的brandId: brandId,
        state_id: carData.state_id,
        stateName: stateName,
        isModelCar: isModelCar,
        imageId: imageId,
        x_original_ids: carData.x_original_ids,
        x_studio_char_field_9hg_1i5fmkpet: carData.x_studio_char_field_9hg_1i5fmkpet
    });
    
    // 验证图片URL是否可以生成
    const generatedImageUrl = getCarImageUrl(imageId, 1);
    const generatedAllImages = [1, 2, 3, 4, 5].map(num => getCarImageUrl(imageId, num));
    
    console.log(`✅ 车辆 ${carData.id} 的图片配置:`, {
        使用的imageId: imageId,
        主图URL: generatedImageUrl,
        是否为模型车: isModelCar,
        原始fieldId: carData.x_studio_char_field_9hg_1i5fmkpet,
        原始originalIds: carData.x_original_ids
    });
    
    return {
        id: carData.id,
        licensePlate: carData.license_plate || '',
        year: carData.x_model_year || '',
        modelId: modelId,
        modelName: modelName,
        type: carData.x_studio_type || '商务车',
        fuelType: formatFuelType(carData.fuel_type),
        fuelTypeEnglish: carData.fuel_type || '',
        seats: carData.seats || 7,
        fieldId: carData.x_studio_char_field_9hg_1i5fmkpet || 'default',
        originalIds: carData.x_original_ids || '', // 新车队业务编码
        stateId: stateId,
        stateName: stateName,
        isModelCar: isModelCar, // 是否为模型车辆
        monthlyFee: carData.x_monthly_rental_fee || 0,
        priceMin: carData.x_price_min || null,
        priceMax: carData.x_price_max || null,
        // 使用格式化函数处理char类型字段，转换为数字
        power: formatEnginePower(carData.x_engine_size),
        powerDisplay: formatEnginePowerDisplay(carData.x_engine_size),
        powerUnit: formatCylinders(carData.x_cylinder),
        powerUnitDisplay: formatCylindersDisplay(carData.x_cylinder),
        brand_id: brandId,
        brand: brandId, // 品牌名称（用于显示）
        code: carData.license_plate || '', // 编码（使用车牌号）
        create_date: carData.create_date || '',
        webStatus: carData.x_web_status || false, // 是否发布状态字段

        // 根据车辆类型生成主图URL
        imageUrl: getCarImageUrl(imageId, 1),
        // 生成所有图片URL (1-5)
        allImages: [1, 2, 3, 4, 5].map(num => getCarImageUrl(imageId, num)),
        // 格式化价格范围
        priceDisplay: formatPriceRange(carData.x_price_min, carData.x_price_max)
    };
}

/**
 * 批量处理车辆数据
 * @param {Array} cars - 原始车辆数据数组
 * @returns {Array} 处理后的车辆数据数组
 */
function processMultipleCars(cars) {
    return cars.map(car => processCarData(car));
}

// 导出函数供全局使用
window.API = {
    fetchCars,
    getCarImageUrl,
    formatPriceRange,
    formatEnginePower,
    formatCylinders,
    formatFuelType,
    FUEL_TYPE_MAP,
    processCarData,
    processMultipleCars
};
