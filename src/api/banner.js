import request from '@/utils/request'

export class BannerApi {
  static getBanners(count, page) {
    return request({
      url: 'homepage/banners?count=' + count + '&page=' + page + '&showPast=true',
      method: 'get'
    })
  }
  static createBanner(data) {
    return request({
      url: 'homepage/banners',
      method: 'post',
      data
    })
  }
  static updateBanner(data, id) {
    return request({
      url: 'homepage/banners/' + id,
      method: 'put',
      data
    })
  }
  static deleteBanner(id) {
    return request({
      url: 'homepage/banners/' + id,
      method: 'delete'
    })
  }
}
