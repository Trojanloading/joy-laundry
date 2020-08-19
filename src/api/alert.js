import request from '@/utils/request'

export class AlertApi {
  static getAlerts(count, page) {
    return request({
      // url: 'homepage/alerts?sort=valid_until&sort_direction=asc&count=' + count + '&page=' + page + '&status=true&showPast=false',
      url: 'homepage/alerts?sort=valid_until&sort_direction=asc&count=' + count + '&page=' + page + '&showPast=true',
      method: 'get'
    })
  }
  static createAlert(data) {
    return request({
      url: 'homepage/alerts',
      method: 'post',
      data
    })
  }
  static updateAlert(data, id) {
    return request({
      url: 'homepage/alerts/' + id,
      method: 'put',
      data
    })
  }
  static deleteAlert(id) {
    return request({
      url: 'homepage/alerts/' + id,
      method: 'delete'
    })
  }
}
