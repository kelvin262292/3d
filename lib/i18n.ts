export type Language = "en" | "zh" | "vi"

export interface Translation {
  // Header & Navigation
  header: {
    logo: string
    home: string
    products: string
    categories: string
    about: string
    contact: string
    search: string
    cart: string
    wishlist: string
    account: string
    login: string
    register: string
  }

  // Search & Filters
  search: {
    placeholder: string
    suggestions: string
    recent: string
    trending: string
    popular_categories: string
    clear_all: string
    results_found: string
    results_for: string
    showing_products: string
    no_results: string
    no_results_desc: string
    filters: string
    sort_by: string
    view_mode: string
    grid: string
    list: string
  }

  // Filters
  filters: {
    categories: string
    price_range: string
    file_format: string
    min_rating: string
    features: string
    has_textures: string
    has_rigging: string
    has_animation: string
    clear_filters: string
    all_ratings: string
  }

  // Sort Options
  sort: {
    relevance: string
    newest: string
    price_low: string
    price_high: string
    rating: string
    popular: string
  }

  // Product Categories
  categories: {
    architecture: string
    vehicles: string
    characters: string
    creatures: string
    furniture: string
    weapons: string
    residential: string
    commercial: string
    sports_car: string
    aircraft: string
    anime: string
    mythology: string
  }

  // Product Details
  product: {
    add_to_cart: string
    add_to_wishlist: string
    remove_from_wishlist: string
    quick_view: string
    view_details: string
    specifications: string
    reviews: string
    related_products: string
    format: string
    polygons: string
    textures: string
    rigged: string
    animated: string
    featured: string
    discount: string
    original_price: string
    rating: string
    reviews_count: string
  }

  // Cart & Checkout
  cart: {
    title: string
    empty: string
    empty_desc: string
    continue_shopping: string
    item: string
    items: string
    quantity: string
    price: string
    total: string
    subtotal: string
    shipping: string
    tax: string
    checkout: string
    remove: string
    update: string
    coupon_code: string
    apply_coupon: string
  }

  // Account & Auth
  auth: {
    login_title: string
    register_title: string
    email: string
    password: string
    confirm_password: string
    remember_me: string
    forgot_password: string
    or: string
    login_with_google: string
    create_account: string
    already_have_account: string
    personal_info: string
    my_orders: string
    addresses: string
    change_password: string
    notifications: string
    logout: string
    username: string
    full_name: string
    phone: string
    register_with_google: string
    welcome_back: string
    login_successful: string
    login_error: string
    registration_successful: string
    registration_success_message: string
    registration_error: string
  }

  // Order Tracking
  orders: {
    title: string
    track_order: string
    order_status: string
    tracking_number: string
    estimated_delivery: string
    order_placed: string
    payment_confirmed: string
    processing: string
    shipped: string
    in_transit: string
    out_for_delivery: string
    delivered: string
    cancelled: string
    order_timeline: string
    shipping_address: string
    order_summary: string
    order_items: string
    notifications: string
    email_updates: string
    sms_updates: string
    manage_preferences: string
    track_with_carrier: string
    download_receipt: string
    contact_support: string
    share_tracking: string
    progress: string
    complete: string
    current: string
  }

  // Validation
  validation: {
    required: string
    email_required: string
    email_invalid: string
    password_required: string
    password_length: string
    confirm_password_required: string
    passwords_not_match: string
    username_required: string
    username_length: string
    fullname_required: string
    phone_required: string
    phone_invalid: string
    terms_required: string
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    edit: string
    delete: string
    confirm: string
    yes: string
    no: string
    close: string
    next: string
    previous: string
    page: string
    of: string
    currency: string
  }

  // Messages
  messages: {
    added_to_cart: string
    added_to_wishlist: string
    removed_from_wishlist: string
    item_removed: string
    cart_updated: string
    login_required: string
    login_success: string
    logout_success: string
    error_occurred: string
  }
}

export const translations: Record<Language, Translation> = {
  en: {
    header: {
      logo: "3D Store",
      home: "Home",
      products: "Products",
      categories: "Categories",
      about: "About",
      contact: "Contact",
      search: "Search",
      cart: "Cart",
      wishlist: "Wishlist",
      account: "Account",
      login: "Login",
      register: "Register",
    },
    search: {
      placeholder: "Search 3D models...",
      suggestions: "Search suggestions",
      recent: "Recent searches",
      trending: "Trending searches",
      popular_categories: "Popular categories",
      clear_all: "Clear all",
      results_found: "results found",
      results_for: "results for",
      showing_products: "Showing products",
      no_results: "No products found",
      no_results_desc: "Try changing your search keywords or filters",
      filters: "Filters",
      sort_by: "Sort by",
      view_mode: "View mode",
      grid: "Grid",
      list: "List",
    },
    filters: {
      categories: "Categories",
      price_range: "Price range",
      file_format: "File format",
      min_rating: "Minimum rating",
      features: "Features",
      has_textures: "Has textures",
      has_rigging: "Has rigging",
      has_animation: "Has animation",
      clear_filters: "Clear all filters",
      all_ratings: "All ratings",
    },
    sort: {
      relevance: "Most relevant",
      newest: "Newest",
      price_low: "Price: Low to High",
      price_high: "Price: High to Low",
      rating: "Highest rated",
      popular: "Most popular",
    },
    categories: {
      architecture: "Architecture",
      vehicles: "Vehicles",
      characters: "Characters",
      creatures: "Creatures",
      furniture: "Furniture",
      weapons: "Weapons",
      residential: "Residential",
      commercial: "Commercial",
      sports_car: "Sports Car",
      aircraft: "Aircraft",
      anime: "Anime",
      mythology: "Mythology",
    },
    product: {
      add_to_cart: "Add to Cart",
      add_to_wishlist: "Add to Wishlist",
      remove_from_wishlist: "Remove from Wishlist",
      quick_view: "Quick View",
      view_details: "View Details",
      specifications: "Specifications",
      reviews: "Reviews",
      related_products: "Related Products",
      format: "Format",
      polygons: "Polygons",
      textures: "Textures",
      rigged: "Rigged",
      animated: "Animated",
      featured: "Featured",
      discount: "Discount",
      original_price: "Original Price",
      rating: "Rating",
      reviews_count: "reviews",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      empty_desc: "Add some amazing 3D models to get started",
      continue_shopping: "Continue Shopping",
      item: "item",
      items: "items",
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      checkout: "Checkout",
      remove: "Remove",
      update: "Update",
      coupon_code: "Coupon Code",
      apply_coupon: "Apply Coupon",
    },
    auth: {
      login_title: "Login",
      register_title: "Create Account",
      email: "Email",
      password: "Password",
      confirm_password: "Confirm Password",
      remember_me: "Remember me",
      forgot_password: "Forgot password?",
      or: "or",
      login_with_google: "Login with Google",
      create_account: "Create new account",
      already_have_account: "Already have an account?",
      personal_info: "Personal Information",
      my_orders: "My Orders",
      addresses: "Addresses",
      change_password: "Change Password",
      notifications: "Notifications",
      logout: "Logout",
      username: "Username",
      full_name: "Full Name",
      phone: "Phone Number",
      register_with_google: "Register with Google",
      welcome_back: "Welcome back to 3D Store!",
      login_successful: "Login Successful",
      login_error: "Invalid email or password. Please try again.",
      registration_successful: "Registration Successful",
      registration_success_message: "Your account has been created successfully!",
      registration_error: "Registration failed. Please try again.",
    },
    orders: {
      title: "Order Tracking",
      track_order: "Track Order",
      order_status: "Order Status",
      tracking_number: "Tracking Number",
      estimated_delivery: "Estimated Delivery",
      order_placed: "Order Placed",
      payment_confirmed: "Payment Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      in_transit: "In Transit",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      order_timeline: "Order Timeline",
      shipping_address: "Shipping Address",
      order_summary: "Order Summary",
      order_items: "Order Items",
      notifications: "Notifications",
      email_updates: "Email Updates",
      sms_updates: "SMS Updates",
      manage_preferences: "Manage Preferences",
      track_with_carrier: "Track with Carrier",
      download_receipt: "Download Receipt",
      contact_support: "Contact Support",
      share_tracking: "Share Tracking",
      progress: "Progress",
      complete: "Complete",
      current: "Current",
    },
    validation: {
      required: "This field is required",
      email_required: "Email is required",
      email_invalid: "Please enter a valid email address",
      password_required: "Password is required",
      password_length: "Password must be at least 8 characters",
      confirm_password_required: "Please confirm your password",
      passwords_not_match: "Passwords do not match",
      username_required: "Username is required",
      username_length: "Username must be at least 3 characters",
      fullname_required: "Full name is required",
      phone_required: "Phone number is required",
      phone_invalid: "Please enter a valid phone number",
      terms_required: "You must agree to the Terms of Service and Privacy Policy",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      close: "Close",
      next: "Next",
      previous: "Previous",
      page: "Page",
      of: "of",
      currency: "$",
    },
    messages: {
      added_to_cart: "Added to cart successfully",
      added_to_wishlist: "Added to wishlist",
      removed_from_wishlist: "Removed from wishlist",
      item_removed: "Item removed",
      cart_updated: "Cart updated",
      login_required: "Please login to continue",
      login_success: "Login successful",
      logout_success: "Logout successful",
      error_occurred: "An error occurred",
    },
  },
  zh: {
    header: {
      logo: "3D商店",
      home: "首页",
      products: "产品",
      categories: "分类",
      about: "关于我们",
      contact: "联系我们",
      search: "搜索",
      cart: "购物车",
      wishlist: "收藏夹",
      account: "账户",
      login: "登录",
      register: "注册",
    },
    search: {
      placeholder: "搜索3D模型...",
      suggestions: "搜索建议",
      recent: "最近搜索",
      trending: "热门搜索",
      popular_categories: "热门分类",
      clear_all: "清除全部",
      results_found: "个结果",
      results_for: "的搜索结果",
      showing_products: "显示产品",
      no_results: "未找到产品",
      no_results_desc: "请尝试更改搜索关键词或筛选条件",
      filters: "筛选",
      sort_by: "排序方式",
      view_mode: "查看模式",
      grid: "网格",
      list: "列表",
    },
    filters: {
      categories: "分类",
      price_range: "价格范围",
      file_format: "文件格式",
      min_rating: "最低评分",
      features: "功能特性",
      has_textures: "包含贴图",
      has_rigging: "包含绑定",
      has_animation: "包含动画",
      clear_filters: "清除所有筛选",
      all_ratings: "所有评分",
    },
    sort: {
      relevance: "最相关",
      newest: "最新",
      price_low: "价格：从低到高",
      price_high: "价格：从高到低",
      rating: "评分最高",
      popular: "最受欢迎",
    },
    categories: {
      architecture: "建筑",
      vehicles: "车辆",
      characters: "角色",
      creatures: "生物",
      furniture: "家具",
      weapons: "武器",
      residential: "住宅",
      commercial: "商业",
      sports_car: "跑车",
      aircraft: "飞机",
      anime: "动漫",
      mythology: "神话",
    },
    product: {
      add_to_cart: "加入购物车",
      add_to_wishlist: "加入收藏",
      remove_from_wishlist: "取消收藏",
      quick_view: "快速查看",
      view_details: "查看详情",
      specifications: "规格参数",
      reviews: "评价",
      related_products: "相关产品",
      format: "格式",
      polygons: "多边形",
      textures: "贴图",
      rigged: "绑定",
      animated: "动画",
      featured: "精选",
      discount: "折扣",
      original_price: "原价",
      rating: "评分",
      reviews_count: "条评价",
    },
    cart: {
      title: "购物车",
      empty: "购物车为空",
      empty_desc: "添加一些精美的3D模型开始购物",
      continue_shopping: "继续购物",
      item: "件商品",
      items: "件商品",
      quantity: "数量",
      price: "价格",
      total: "总计",
      subtotal: "小计",
      shipping: "运费",
      tax: "税费",
      checkout: "结算",
      remove: "移除",
      update: "更新",
      coupon_code: "优惠券代码",
      apply_coupon: "使用优惠券",
    },
    auth: {
      login_title: "登录",
      register_title: "创建账户",
      email: "邮箱",
      password: "密码",
      confirm_password: "确认密码",
      remember_me: "记住我",
      forgot_password: "忘记密码？",
      or: "或",
      login_with_google: "使用Google登录",
      create_account: "创建新账户",
      already_have_account: "已有账户？",
      personal_info: "个人信息",
      my_orders: "我的订单",
      addresses: "地址管理",
      change_password: "修改密码",
      notifications: "通知设置",
      logout: "退出登录",
      username: "用户名",
      full_name: "全名",
      phone: "电话号码",
      register_with_google: "使用Google注册",
      welcome_back: "欢迎回到3D商店！",
      login_successful: "登录成功",
      login_error: "邮箱或密码无效。请重试。",
      registration_successful: "注册成功",
      registration_success_message: "您的账户已成功创建！",
      registration_error: "注册失败。请重试。",
    },
    orders: {
      title: "订单跟踪",
      track_order: "跟踪订单",
      order_status: "订单状态",
      tracking_number: "跟踪号码",
      estimated_delivery: "预计送达",
      order_placed: "订单已下达",
      payment_confirmed: "付款已确认",
      processing: "处理中",
      shipped: "已发货",
      in_transit: "运输中",
      out_for_delivery: "派送中",
      delivered: "已送达",
      cancelled: "已取消",
      order_timeline: "订单时间线",
      shipping_address: "收货地址",
      order_summary: "订单摘要",
      order_items: "订单商品",
      notifications: "通知",
      email_updates: "邮件更新",
      sms_updates: "短信更新",
      manage_preferences: "管理偏好",
      track_with_carrier: "承运商跟踪",
      download_receipt: "下载收据",
      contact_support: "联系客服",
      share_tracking: "分享跟踪",
      progress: "进度",
      complete: "完成",
      current: "当前",
    },
    validation: {
      required: "此字段为必填项",
      email_required: "邮箱为必填项",
      email_invalid: "请输入有效的邮箱地址",
      password_required: "密码为必填项",
      password_length: "密码必须至少8个字符",
      confirm_password_required: "请确认您的密码",
      passwords_not_match: "密码不匹配",
      username_required: "用户名为必填项",
      username_length: "用户名必须至少3个字符",
      fullname_required: "全名为必填项",
      phone_required: "电话号码为必填项",
      phone_invalid: "请输入有效的电话号码",
      terms_required: "您必须同意服务条款和隐私政策",
    },
    common: {
      loading: "加载中...",
      error: "错误",
      success: "成功",
      cancel: "取消",
      save: "保存",
      edit: "编辑",
      delete: "删除",
      confirm: "确认",
      yes: "是",
      no: "否",
      close: "关闭",
      next: "下一页",
      previous: "上一页",
      page: "第",
      of: "页，共",
      currency: "¥",
    },
    messages: {
      added_to_cart: "已成功加入购物车",
      added_to_wishlist: "已加入收藏夹",
      removed_from_wishlist: "已取消收藏",
      item_removed: "商品已移除",
      cart_updated: "购物车已更新",
      login_required: "请先登录",
      login_success: "登录成功",
      logout_success: "退出成功",
      error_occurred: "发生错误",
    },
  },
  vi: {
    header: {
      logo: "3D Store",
      home: "Trang chủ",
      products: "Sản phẩm",
      categories: "Danh mục",
      about: "Giới thiệu",
      contact: "Liên hệ",
      search: "Tìm kiếm",
      cart: "Giỏ hàng",
      wishlist: "Yêu thích",
      account: "Tài khoản",
      login: "Đăng nhập",
      register: "Đăng ký",
    },
    search: {
      placeholder: "Tìm kiếm mô hình 3D...",
      suggestions: "Gợi ý tìm kiếm",
      recent: "Tìm kiếm gần đây",
      trending: "Tìm kiếm phổ biến",
      popular_categories: "Danh mục phổ biến",
      clear_all: "Xóa tất cả",
      results_found: "kết quả",
      results_for: "kết quả cho",
      showing_products: "Hiển thị sản phẩm",
      no_results: "Không tìm thấy sản phẩm nào",
      no_results_desc: "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc",
      filters: "Bộ lọc",
      sort_by: "Sắp xếp theo",
      view_mode: "Chế độ xem",
      grid: "Lưới",
      list: "Danh sách",
    },
    filters: {
      categories: "Danh mục",
      price_range: "Khoảng giá",
      file_format: "Định dạng file",
      min_rating: "Đánh giá tối thiểu",
      features: "Tính năng",
      has_textures: "Có texture",
      has_rigging: "Có rigging",
      has_animation: "Có animation",
      clear_filters: "Xóa tất cả bộ lọc",
      all_ratings: "Tất cả đánh giá",
    },
    sort: {
      relevance: "Liên quan nhất",
      newest: "Mới nhất",
      price_low: "Giá thấp đến cao",
      price_high: "Giá cao đến thấp",
      rating: "Đánh giá cao nhất",
      popular: "Phổ biến nhất",
    },
    categories: {
      architecture: "Kiến trúc",
      vehicles: "Xe cộ",
      characters: "Nhân vật",
      creatures: "Sinh vật",
      furniture: "Nội thất",
      weapons: "Vũ khí",
      residential: "Nhà ở",
      commercial: "Thương mại",
      sports_car: "Xe thể thao",
      aircraft: "Máy bay",
      anime: "Anime",
      mythology: "Thần thoại",
    },
    product: {
      add_to_cart: "Thêm vào giỏ",
      add_to_wishlist: "Thêm yêu thích",
      remove_from_wishlist: "Bỏ yêu thích",
      quick_view: "Xem nhanh",
      view_details: "Xem chi tiết",
      specifications: "Thông số",
      reviews: "Đánh giá",
      related_products: "Sản phẩm liên quan",
      format: "Định dạng",
      polygons: "Đa giác",
      textures: "Texture",
      rigged: "Rigging",
      animated: "Animation",
      featured: "Nổi bật",
      discount: "Giảm giá",
      original_price: "Giá gốc",
      rating: "Đánh giá",
      reviews_count: "đánh giá",
    },
    cart: {
      title: "Giỏ hàng",
      empty: "Giỏ hàng trống",
      empty_desc: "Thêm một số mô hình 3D tuyệt vời để bắt đầu",
      continue_shopping: "Tiếp tục mua sắm",
      item: "sản phẩm",
      items: "sản phẩm",
      quantity: "Số lượng",
      price: "Giá",
      total: "Tổng cộng",
      subtotal: "Tạm tính",
      shipping: "Phí vận chuyển",
      tax: "Thuế",
      checkout: "Thanh toán",
      remove: "Xóa",
      update: "Cập nhật",
      coupon_code: "Mã giảm giá",
      apply_coupon: "Áp dụng mã",
    },
    auth: {
      login_title: "Đăng nhập",
      register_title: "Tạo tài khoản",
      email: "Email",
      password: "Mật khẩu",
      confirm_password: "Xác nhận mật khẩu",
      remember_me: "Ghi nhớ đăng nhập",
      forgot_password: "Quên mật khẩu?",
      or: "hoặc",
      login_with_google: "Đăng nhập với Google",
      create_account: "Tạo tài khoản mới",
      already_have_account: "Đã có tài khoản?",
      personal_info: "Thông tin cá nhân",
      my_orders: "Đơn hàng của tôi",
      addresses: "Địa chỉ giao hàng",
      change_password: "Đổi mật khẩu",
      notifications: "Cài đặt thông báo",
      logout: "Đăng xuất",
      username: "Tên người dùng",
      full_name: "Họ và tên",
      phone: "Số điện thoại",
      register_with_google: "Đăng ký với Google",
      welcome_back: "Chào mừng trở lại với 3D Store!",
      login_successful: "Đăng nhập thành công",
      login_error: "Email hoặc mật khẩu không hợp lệ. Vui lòng thử lại.",
      registration_successful: "Đăng ký thành công",
      registration_success_message: "Tài khoản của bạn đã được tạo thành công!",
      registration_error: "Đăng ký thất bại. Vui lòng thử lại.",
    },
    orders: {
      title: "Theo dõi đơn hàng",
      track_order: "Theo dõi đơn hàng",
      order_status: "Trạng thái đơn hàng",
      tracking_number: "Mã theo dõi",
      estimated_delivery: "Dự kiến giao hàng",
      order_placed: "Đã đặt hàng",
      payment_confirmed: "Đã xác nhận thanh toán",
      processing: "Đang xử lý",
      shipped: "Đã gửi hàng",
      in_transit: "Đang vận chuyển",
      out_for_delivery: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
      order_timeline: "Lịch sử đơn hàng",
      shipping_address: "Địa chỉ giao hàng",
      order_summary: "Tóm tắt đơn hàng",
      order_items: "Sản phẩm trong đơn",
      notifications: "Thông báo",
      email_updates: "Cập nhật qua email",
      sms_updates: "Cập nhật qua SMS",
      manage_preferences: "Quản lý tùy chọn",
      track_with_carrier: "Theo dõi với nhà vận chuyển",
      download_receipt: "Tải hóa đơn",
      contact_support: "Liên hệ hỗ trợ",
      share_tracking: "Chia sẻ theo dõi",
      progress: "Tiến độ",
      complete: "Hoàn thành",
      current: "Hiện tại",
    },
    validation: {
      required: "Trường này là bắt buộc",
      email_required: "Email là bắt buộc",
      email_invalid: "Vui lòng nhập địa chỉ email hợp lệ",
      password_required: "Mật khẩu là bắt buộc",
      password_length: "Mật khẩu phải có ít nhất 8 ký tự",
      confirm_password_required: "Vui lòng xác nhận mật khẩu của bạn",
      passwords_not_match: "Mật khẩu không khớp",
      username_required: "Tên người dùng là bắt buộc",
      username_length: "Tên người dùng phải có ít nhất 3 ký tự",
      fullname_required: "Họ và tên là bắt buộc",
      phone_required: "Số điện thoại là bắt buộc",
      phone_invalid: "Vui lòng nhập số điện thoại hợp lệ",
      terms_required: "Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật",
    },
    common: {
      loading: "Đang tải...",
      error: "Lỗi",
      success: "Thành công",
      cancel: "Hủy",
      save: "Lưu",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      confirm: "Xác nhận",
      yes: "Có",
      no: "Không",
      close: "Đóng",
      next: "Tiếp theo",
      previous: "Trước",
      page: "Trang",
      of: "của",
      currency: "đ",
    },
    messages: {
      added_to_cart: "Đã thêm vào giỏ hàng thành công",
      added_to_wishlist: "Đã thêm vào danh sách yêu thích",
      removed_from_wishlist: "Đã xóa khỏi danh sách yêu thích",
      item_removed: "Đã xóa sản phẩm",
      cart_updated: "Giỏ hàng đã được cập nhật",
      login_required: "Vui lòng đăng nhập để tiếp tục",
      login_success: "Đăng nhập thành công",
      logout_success: "Đăng xuất thành công",
      error_occurred: "Đã xảy ra lỗi",
    },
  },
}

export const getTranslation = (language: Language): Translation => {
  return translations[language] || translations.vi
}

export const formatCurrency = (amount: number, language: Language): string => {
  const currency = translations[language].common.currency

  switch (language) {
    case "en":
      return `${currency}${amount.toLocaleString("en-US")}`
    case "zh":
      return `${currency}${amount.toLocaleString("zh-CN")}`
    case "vi":
    default:
      return `${amount.toLocaleString("vi-VN")}${currency}`
  }
}

export const getLanguageName = (language: Language): string => {
  const names = {
    en: "English",
    zh: "中文",
    vi: "Tiếng Việt",
  }
  return names[language]
}

export const getLanguageFlag = (language: Language): string => {
  const flags = {
    en: "🇺🇸",
    zh: "🇨🇳",
    vi: "🇻🇳",
  }
  return flags[language]
}
