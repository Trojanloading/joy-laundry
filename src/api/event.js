import request from '@/utils/request'

export class EventApi {
  static getEvents(count, page, is_apply_register, type) {
    return request({
      url:
        'events?sort=date&sort_direction=desc&count=' +
        count +
        '&page=' +
        page +
        '&show_apply_register=' + is_apply_register + '&type=' + type,
      method: 'get'
    })
  }
  static getEventDetail(id) {
    return request({
      url: 'events/' + id,
      method: 'get'
    })
  }
  static createEvent(data) {
    return request({
      url: 'events',
      method: 'post',
      data
    })
  }
  static deleteEvent(id) {
    return request({
      url: 'events/' + id,
      method: 'delete'
    })
  }
  static updateEvent(data, id) {
    return request({
      url: 'events/' + id,
      method: 'put',
      data
    })
  }
  // 获取活动列表 (无分页)
  static getAllEvents() {
    return request({
      url: 'events',
      method: 'get'
    })
  }
}
