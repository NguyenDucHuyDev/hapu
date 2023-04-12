/** 
 * @typedef {object} userInfo
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} full_name
 * @property {string} number_phone
 * @property {string} birthday
 * @property {number} business_type
 * @property {number} city_id
 * @property {string} address
 * @property {string} business_name
 * @property {null} user_referer
 * @property {string} created_at
 * @property {string} updated_at
 * 
 * @typedef {object} productInfo
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {number} unit_price
 * @property {number} category_id
 * @property {null} description
 * @property {number} ingredient_id
 * @property {number} manufacturer_id
 * @property {string} image_url
 * @property {string} status
 * @property {number} sold
 * @property {string} created_at
 * @property {string} updated_at
 * @property {tagsInfo[]} tags
 * @property {categoryInfo} category
 * 
 * @typedef {object} orderInfo
 * @property {number} id
 * @property {number} product_id
 * @property {number} user_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} total_price
 * @property {string} number_phone
 * @property {string} shipping_address
 * @property {string} shipping_status
 * @property {null}   note
 * @property {string} created_at
 * @property {string} updated_at
 * @property {userInfo} user
 * @property {productInfo} product
 * 
 * @typedef {object} NewsInfo
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {String} image_url
 * @property {string} content_post
 * @property {SOURCE_NEWS} source
 * @property {NewTypeInfo} newType
 * @property {number} new_type_id
 * @property {string} created_at
 * @property {string} updated_at
 * 
 * @typedef {object} CartInfo
 * @property {number} id
 * @property {number} product_id
 * @property {number} user_id
 * @property {number} quantity
 * @property {string} created_at
 * @property {string} updated_at
 * @property {productInfo} product
 * 
 * @typedef {object} NewTypeInfo
 * @property {number} id
 * @property {string} name
 * @property {string} created_at
 * @property {string} updated_at
 *
 * @typedef {object} BannerInfo
 * @property {number} id
 * @property {string} image_url
 * @property {number} new_id
 * @property {string} created_at
 * @property {string} updated_at
 * @property {NewsInfo} news
 *
 * @typedef {object} ModelCommon
 * @property {number} id
 * @property {string} name
 * @property {string} created_at
 * @property {string} updated_at
 * 
 * @typedef {ModelCommon} cityInfo
 * 
 * @typedef {ModelCommon} BusinessType
 * 
 * @typedef {ModelCommon} categoryInfo
 * 
 * @typedef {ModelCommon} manufacturerInfo
 * 
 * @typedef {ModelCommon} ingredientsInfo
 * 
 * @typedef {ModelCommon} tagsInfo
 */

/**
 * @enum
 * @readonly
 */
const PRODUCT_STATUS = {
  READY: "Sẵn sàng",
  RUN_OUT: "Hết hàng",
  SUSPENSE: "Ngừng bán",
}

/**
 * @enum
 * @readonly
 */
const SHIPPING_STATUS = {
  "CONFIRMING": "Đang xác nhận",
  "PREPAIRING": "Đang xử lý",
  "SHIPPING": "Đang vận chuyển",
  "DELIVERED": "Đã nhận được hàng",
  "COMPLETED": "Hoàn tất đơn hàng",
  "REJECTED": "Từ chối nhận hàng",
}

/**
 * @enum
 * @readonly
 */
const SOURCE_NEWS = {
  "ADMIN_POST": "Đăng bởi admin",
  "CRAWL": "Đăng bởi BOT",
}

export {
  SHIPPING_STATUS,
  PRODUCT_STATUS,
  SOURCE_NEWS,
}

export default {}