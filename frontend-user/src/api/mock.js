// Mock 数据服务
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// dummyjson CDN 真实商品图片（Cloudflare CDN，全球可访问，无防盗链）
const CDN = 'https://cdn.dummyjson.com/product-images'

const IMG = {
  // iPhone 15 Pro Max → iPhone 13 Pro（iPhone 高端机型）
  iphone:       `${CDN}/smartphones/iphone-13-pro/thumbnail.webp`,
  iphoneImgs:   [`${CDN}/smartphones/iphone-13-pro/1.webp`, `${CDN}/smartphones/iphone-13-pro/2.webp`, `${CDN}/smartphones/iphone-13-pro/3.webp`],
  // 华为 Mate 60 Pro → Oppo F19 Pro Plus（国产旗舰风格手机）
  huawei:       `${CDN}/smartphones/oppo-f19-pro-plus/thumbnail.webp`,
  huaweiImgs:   [`${CDN}/smartphones/oppo-f19-pro-plus/1.webp`, `${CDN}/smartphones/oppo-f19-pro-plus/2.webp`, `${CDN}/smartphones/oppo-f19-pro-plus/3.webp`],
  // 小米14 Ultra → Vivo X21（全面屏旗舰手机）
  xiaomi:       `${CDN}/smartphones/vivo-x21/thumbnail.webp`,
  xiaomiImgs:   [`${CDN}/smartphones/vivo-x21/1.webp`, `${CDN}/smartphones/vivo-x21/2.webp`, `${CDN}/smartphones/vivo-x21/3.webp`],
  // MacBook Pro 14 → Apple MacBook Pro 14（完全匹配）
  macbook:      `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp`,
  macbookImgs:  [`${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/1.webp`, `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/2.webp`, `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/3.webp`],
  // iPad Pro → iPad Mini 2021（Apple 平板）
  ipad:         `${CDN}/tablets/ipad-mini-2021-starlight/thumbnail.webp`,
  ipadImgs:     [`${CDN}/tablets/ipad-mini-2021-starlight/1.webp`, `${CDN}/tablets/ipad-mini-2021-starlight/2.webp`, `${CDN}/tablets/ipad-mini-2021-starlight/3.webp`],
  // Apple Watch Ultra 2 → Apple Watch Series 4 Gold（Apple 智能手表）
  watch:        `${CDN}/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp`,
  watchImgs:    [`${CDN}/mobile-accessories/apple-watch-series-4-gold/1.webp`, `${CDN}/mobile-accessories/apple-watch-series-4-gold/2.webp`, `${CDN}/mobile-accessories/apple-watch-series-4-gold/3.webp`],
  // Sony WH-1000XM5 → Apple AirPods Max Silver（头戴式降噪耳机）
  headphone:    `${CDN}/mobile-accessories/apple-airpods-max-silver/thumbnail.webp`,
  headphoneImgs:[`${CDN}/mobile-accessories/apple-airpods-max-silver/1.webp`],
  // Nike Air Jordan 1 → Nike Air Jordan 1 Red And Black（完全匹配）
  jordan:       `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp`,
  jordanImgs:   [`${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/1.webp`, `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/2.webp`, `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/3.webp`, `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/4.webp`],
  // SK-II 神仙水 → Olay 护肤品（瓶装护肤品）
  skincare:     `${CDN}/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp`,
  skincareImgs: [`${CDN}/skin-care/olay-ultra-moisture-shea-butter-body-wash/1.webp`, `${CDN}/skin-care/olay-ultra-moisture-shea-butter-body-wash/2.webp`, `${CDN}/skin-care/olay-ultra-moisture-shea-butter-body-wash/3.webp`],
  // Chanel 香水 → Chanel Coco Noir（完全匹配）
  perfume:      `${CDN}/fragrances/chanel-coco-noir-eau-de/thumbnail.webp`,
  perfumeImgs:  [`${CDN}/fragrances/chanel-coco-noir-eau-de/1.webp`, `${CDN}/fragrances/chanel-coco-noir-eau-de/2.webp`, `${CDN}/fragrances/chanel-coco-noir-eau-de/3.webp`],
  // Prada 手提包 → Prada Women Bag（完全匹配）
  bag:          `${CDN}/womens-bags/prada-women-bag/thumbnail.webp`,
  bagImgs:      [`${CDN}/womens-bags/prada-women-bag/1.webp`, `${CDN}/womens-bags/prada-women-bag/2.webp`, `${CDN}/womens-bags/prada-women-bag/3.webp`],
  // 太阳镜 → Black Sun Glasses（完全匹配）
  sunglasses:   `${CDN}/sunglasses/black-sun-glasses/thumbnail.webp`,
  sunglassesImgs:[`${CDN}/sunglasses/black-sun-glasses/1.webp`, `${CDN}/sunglasses/black-sun-glasses/2.webp`, `${CDN}/sunglasses/black-sun-glasses/3.webp`],
}

// 分类数据
export const categories = [
  { id: 1, name: '手机数码', icon: 'Iphone', children: [
    { id: 11, name: '手机', image: IMG.iphone },
    { id: 12, name: '平板', image: IMG.ipad },
    { id: 13, name: '智能手表', image: IMG.watch }
  ]},
  { id: 2, name: '电脑办公', icon: 'Monitor', children: [
    { id: 21, name: '笔记本', image: IMG.macbook },
    { id: 22, name: '台式机', image: `${CDN}/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp` },
    { id: 23, name: '显示器', image: `${CDN}/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp` }
  ]},
  { id: 3, name: '箱包配饰', icon: 'House', children: [
    { id: 31, name: '手提包', image: IMG.bag },
    { id: 32, name: '太阳镜', image: IMG.sunglasses },
    { id: 33, name: '香水', image: IMG.perfume }
  ]},
  { id: 4, name: '服饰鞋包', icon: 'Goods', children: [
    { id: 41, name: '男装', image: `${CDN}/mens-shirts/man-plaid-shirt/thumbnail.webp` },
    { id: 42, name: '女装', image: `${CDN}/womens-dresses/black-women's-gown/thumbnail.webp` },
    { id: 43, name: '鞋靴', image: IMG.jordan }
  ]},
  { id: 5, name: '美妆护肤', icon: 'Present', children: [
    { id: 51, name: '面部护肤', image: IMG.skincare },
    { id: 52, name: '彩妆', image: `${CDN}/beauty/eyeshadow-palette-with-mirror/thumbnail.webp` },
    { id: 53, name: '香水', image: `${CDN}/fragrances/calvin-klein-ck-one/thumbnail.webp` }
  ]},
  { id: 6, name: '食品生鲜', icon: 'Apple', children: [
    { id: 61, name: '水果', image: `${CDN}/groceries/apple/thumbnail.webp` },
    { id: 62, name: '蔬菜', image: `${CDN}/groceries/cucumber/thumbnail.webp` },
    { id: 63, name: '肉禽蛋', image: `${CDN}/groceries/beef-steak/thumbnail.webp` }
  ]}
]

// 商品数据 - 12 个商品全部使用 dummyjson 真实图片
export const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB 原色钛金属',
    price: 9999, originalPrice: 10999,
    image: IMG.iphone,
    sales: 12580, rating: 4.9, stock: 999, categoryId: 11,
    tags: ['新品', '热卖']
  },
  {
    id: 2,
    name: 'MacBook Pro 14英寸 M3芯片 16GB+512GB',
    price: 14999, originalPrice: 15999,
    image: IMG.macbook,
    sales: 8920, rating: 4.8, stock: 500, categoryId: 21,
    tags: ['热卖']
  },
  {
    id: 3,
    name: '华为 Mate 60 Pro 12GB+512GB 雅丹黑',
    price: 6999, originalPrice: 7499,
    image: IMG.huawei,
    sales: 25600, rating: 4.9, stock: 888, categoryId: 11,
    tags: ['新品', '爆款']
  },
  {
    id: 4,
    name: 'iPad Pro 11英寸 M2芯片 WiFi版 256GB',
    price: 6799, originalPrice: 7299,
    image: IMG.ipad,
    sales: 6780, rating: 4.7, stock: 666, categoryId: 12,
    tags: []
  },
  {
    id: 5,
    name: 'Sony WH-1000XM5 无线降噪耳机 黑色',
    price: 2499, originalPrice: 2999,
    image: IMG.headphone,
    sales: 15800, rating: 4.8, stock: 1200, categoryId: 13,
    tags: ['热卖']
  },
  {
    id: 6,
    name: 'Chanel 可可小姐黑色香水 100ml',
    price: 1590, originalPrice: 1890,
    image: IMG.perfume,
    sales: 9200, rating: 4.6, stock: 300, categoryId: 33,
    tags: []
  },
  {
    id: 7,
    name: 'Nike Air Jordan 1 High OG 黑红脚趾',
    price: 1299, originalPrice: 1599,
    image: IMG.jordan,
    sales: 32000, rating: 4.9, stock: 2000, categoryId: 43,
    tags: ['爆款']
  },
  {
    id: 8,
    name: 'SK-II 神仙水护肤精华露 230ml',
    price: 1590, originalPrice: 1790,
    image: IMG.skincare,
    sales: 45000, rating: 4.8, stock: 5000, categoryId: 51,
    tags: ['热卖']
  },
  {
    id: 9,
    name: '小米14 Ultra 16GB+512GB 黑色',
    price: 6499, originalPrice: 6999,
    image: IMG.xiaomi,
    sales: 18900, rating: 4.7, stock: 777, categoryId: 11,
    tags: ['新品']
  },
  {
    id: 10,
    name: 'Apple Watch Ultra 2 钛金属表壳',
    price: 6499, originalPrice: 6999,
    image: IMG.watch,
    sales: 7800, rating: 4.8, stock: 400, categoryId: 13,
    tags: []
  },
  {
    id: 11,
    name: 'Prada 经典皮革手提包 黑色',
    price: 15800, originalPrice: 18900,
    image: IMG.bag,
    sales: 5600, rating: 4.5, stock: 200, categoryId: 31,
    tags: ['新品']
  },
  {
    id: 12,
    name: '经典偏光太阳镜 黑色飞行员款',
    price: 899, originalPrice: 1299,
    image: IMG.sunglasses,
    sales: 12300, rating: 4.6, stock: 800, categoryId: 32,
    tags: ['热卖']
  }
]

// 轮播图
const banners = [
  { id: 1, title: '新品首发 iPhone 15 Pro', image: IMG.iphoneImgs[0], link: '/product/1' },
  { id: 2, title: 'MacBook Pro 限时优惠', image: IMG.macbookImgs[0], link: '/product/2' },
  { id: 3, title: 'Nike 爆款球鞋', image: IMG.jordanImgs[0], link: '/product/7' },
  { id: 4, title: '美妆护肤节', image: IMG.skincareImgs[0], link: '/products?categoryId=51' }
]

// 订单状态映射
export const orderStatus = {
  0: { label: '待付款', color: 'warning' },
  1: { label: '待发货', color: 'info' },
  2: { label: '待收货', color: '' },
  3: { label: '已完成', color: 'success' },
  4: { label: '已取消', color: 'danger' }
}

// 模拟订单
const orders = [
  {
    id: 'ORD20240201001',
    status: 3,
    createTime: '2024-02-01 14:30:00',
    totalAmount: 9999,
    items: [
      { productId: 1, name: 'iPhone 15 Pro Max 256GB 原色钛金属', price: 9999, quantity: 1, image: IMG.iphone }
    ],
    address: { name: '张三', phone: '138****8888', province: '北京市', city: '朝阳区', district: '三里屯', detail: 'SOHO大厦A座1001' }
  },
  {
    id: 'ORD20240205002',
    status: 2,
    createTime: '2024-02-05 10:15:00',
    totalAmount: 16288,
    items: [
      { productId: 2, name: 'MacBook Pro 14英寸 M3芯片 16GB+512GB', price: 14999, quantity: 1, image: IMG.macbook },
      { productId: 7, name: 'Nike Air Jordan 1 High OG 黑红脚趾', price: 1299, quantity: 1, image: IMG.jordan }
    ],
    address: { name: '张三', phone: '138****8888', province: '北京市', city: '朝阳区', district: '三里屯', detail: 'SOHO大厦A座1001' }
  },
  {
    id: 'ORD20240210003',
    status: 0,
    createTime: '2024-02-10 18:45:00',
    totalAmount: 6499,
    items: [
      { productId: 9, name: '小米14 Ultra 16GB+512GB 黑色', price: 6499, quantity: 1, image: IMG.xiaomi }
    ],
    address: { name: '李四', phone: '139****9999', province: '上海市', city: '浦东新区', district: '陆家嘴', detail: '金融中心B栋2205' }
  }
]

// 收货地址
const addresses = [
  { id: 1, name: '张三', phone: '13800138888', province: '北京市', city: '朝阳区', district: '三里屯街道', detail: 'SOHO大厦A座1001室', isDefault: true },
  { id: 2, name: '李四', phone: '13900139999', province: '上海市', city: '浦东新区', district: '陆家嘴街道', detail: '金融中心B栋2205室', isDefault: false }
]

// 模拟用户
const mockUser = {
  id: 1,
  username: 'demo',
  nickname: '购物达人',
  avatar: 'https://placehold.co/100x100/FF6B35/fff?text=U',
  phone: '138****8888',
  email: 'demo@shop.com'
}

// 商品详情图片映射
const detailImagesMap = {
  1: IMG.iphoneImgs,
  2: IMG.macbookImgs,
  3: IMG.huaweiImgs,
  4: IMG.ipadImgs,
  5: IMG.headphoneImgs,
  6: IMG.perfumeImgs,
  7: IMG.jordanImgs,
  8: IMG.skincareImgs,
  9: IMG.xiaomiImgs,
  10: IMG.watchImgs,
  11: IMG.bagImgs,
  12: IMG.sunglassesImgs
}

// 商品规格映射
const specsMap = {
  1: [{ name: '颜色', values: ['原色钛金属', '蓝色钛金属', '白色钛金属', '黑色钛金属'] }, { name: '存储', values: ['256GB', '512GB', '1TB'] }],
  2: [{ name: '颜色', values: ['深空灰', '银色'] }, { name: '内存', values: ['16GB', '32GB'] }],
  3: [{ name: '颜色', values: ['雅丹黑', '南糯紫', '雅川青'] }, { name: '存储', values: ['256GB', '512GB', '1TB'] }],
  4: [{ name: '颜色', values: ['深空灰', '银色'] }, { name: '存储', values: ['128GB', '256GB', '512GB'] }],
  5: [{ name: '颜色', values: ['黑色', '银色', '午夜蓝'] }],
  6: [{ name: '规格', values: ['50ml', '100ml'] }],
  7: [{ name: '尺码', values: ['39', '40', '41', '42', '43', '44'] }],
  8: [{ name: '规格', values: ['75ml', '160ml', '230ml'] }],
  9: [{ name: '颜色', values: ['黑色', '白色'] }, { name: '存储', values: ['256GB', '512GB', '1TB'] }],
  10: [{ name: '表带', values: ['橙色高山回环式表带', '绿色高山回环式表带', '蓝色海洋表带'] }],
  11: [{ name: '颜色', values: ['黑色', '棕色', '酒红色'] }],
  12: [{ name: '颜色', values: ['黑色', '金色', '银色'] }]
}

// 商品描述映射
const descMap = {
  1: 'iPhone 15 Pro Max 搭载 A17 Pro 芯片，钛金属设计，4800万像素主摄，支持 USB-C 接口，超长续航。',
  2: 'MacBook Pro 14英寸搭载 M3 芯片，Liquid Retina XDR 显示屏，长达18小时续航，专业级性能。',
  3: '华为 Mate 60 Pro 搭载麒麟9000S芯片，超可靠玄武架构，XMAGE影像系统，卫星通信。',
  4: 'iPad Pro 11英寸搭载 M2 芯片，Liquid Retina 显示屏，支持 Apple Pencil 悬停，ProRes 视频拍摄。',
  5: 'Sony WH-1000XM5 行业领先降噪，30小时续航，自适应声音控制，多点连接，轻量化设计。',
  6: 'Chanel 可可小姐黑色香水，东方花香调，前调柑橘与佛手柑，中调玫瑰与茉莉，尾调广藿香与香草。',
  7: 'Nike Air Jordan 1 经典黑红配色，高帮设计，真皮鞋面，Air-Sole 缓震，篮球文化标志性鞋款。',
  8: 'SK-II 护肤精华露（神仙水），富含超过90%的PITERA™精华，改善肤质，令肌肤晶莹剔透。',
  9: '小米14 Ultra 搭载骁龙8 Gen3，徕卡光学 Summilux 镜头，1英寸大底传感器，专业影像旗舰。',
  10: 'Apple Watch Ultra 2 钛金属表壳，超亮显示屏，精准双频GPS，水深仪和水温传感器，极限运动首选。',
  11: 'Prada 经典皮革手提包，意大利手工制作，Saffiano 十字纹牛皮，金属三角标志，内含可拆卸肩带。',
  12: '经典飞行员偏光太阳镜，UV400防紫外线，高清偏光镜片，轻量金属镜框，适合驾驶和户外运动。'
}

// Mock API 接口
const mockApi = {
  async getCategories() {
    await delay(200)
    return { code: 200, data: categories }
  },

  async getProducts(params = {}) {
    await delay(300)
    let list = [...products]
    if (params.categoryId) {
      const cid = Number(params.categoryId)
      // 支持一级分类查询（匹配子分类）
      const parent = categories.find(c => c.id === cid)
      if (parent) {
        const childIds = parent.children.map(c => c.id)
        list = list.filter(p => childIds.includes(p.categoryId))
      } else {
        list = list.filter(p => p.categoryId === cid)
      }
    }
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(kw))
    }
    // 排序
    if (params.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (params.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (params.sort === 'sales') list.sort((a, b) => b.sales - a.sales)
    // 分页
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const pageList = list.slice(start, start + pageSize)
    return { code: 200, data: { list: pageList, total: list.length, page, pageSize } }
  },

  async getProductDetail(id) {
    await delay(300)
    const product = products.find(p => p.id === Number(id))
    if (!product) return { code: 404, message: '商品不存在' }
    return {
      code: 200,
      data: {
        ...product,
        images: detailImagesMap[product.id] || [product.image],
        specs: specsMap[product.id] || [],
        description: descMap[product.id] || ''
      }
    }
  },

  async getBanners() {
    await delay(200)
    return { code: 200, data: banners }
  },

  async getOrders(params = {}) {
    await delay(300)
    let list = [...orders]
    if (params.status !== undefined && params.status !== '') {
      list = list.filter(o => o.status === Number(params.status))
    }
    return { code: 200, data: { list, total: list.length } }
  },

  async getOrderDetail(id) {
    await delay(300)
    const order = orders.find(o => o.id === id)
    if (!order) return { code: 404, message: '订单不存在' }
    return { code: 200, data: order }
  },

  async createOrder(data) {
    await delay(500)
    const newOrder = {
      id: 'ORD' + Date.now(),
      status: 0,
      createTime: new Date().toLocaleString('zh-CN'),
      totalAmount: data.totalAmount,
      items: data.items,
      address: data.address
    }
    orders.unshift(newOrder)
    return { code: 200, data: newOrder }
  },

  async payOrder(orderId) {
    await delay(500)
    const order = orders.find(o => o.id === orderId)
    if (!order) return { code: 404, message: '订单不存在' }
    if (order.status !== 0) return { code: 400, message: '订单状态异常' }
    order.status = 1
    return { code: 200, data: order }
  },

  async confirmReceive(orderId) {
    await delay(500)
    const order = orders.find(o => o.id === orderId)
    if (!order) return { code: 404, message: '订单不存在' }
    if (order.status !== 2) return { code: 400, message: '订单状态异常' }
    order.status = 3
    return { code: 200, data: order }
  },

  async getAddresses() {
    await delay(200)
    return { code: 200, data: addresses }
  },

  async login(data) {
    await delay(500)
    if (data.username === 'demo' && data.password === '123456') {
      return { code: 200, data: { token: 'mock-token-' + Date.now(), user: mockUser } }
    }
    return { code: 401, message: '用户名或密码错误' }
  },

  async register(data) {
    await delay(500)
    return { code: 200, data: { token: 'mock-token-' + Date.now(), user: { ...mockUser, username: data.username, nickname: data.nickname || data.username } } }
  },

  async getUserInfo() {
    await delay(200)
    return { code: 200, data: { ...mockUser } }
  },

  async updateUserInfo(data) {
    await delay(300)
    // 更新模拟用户数据
    if (data.nickname) mockUser.nickname = data.nickname
    if (data.email) mockUser.email = data.email
    return { code: 200, data: { ...mockUser } }
  }
}

export default mockApi
