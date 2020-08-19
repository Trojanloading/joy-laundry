import request from '@/utils/request'

export class AnnouncementApi {
  static getAnnouncements(count, page) {
    return request({
      url: 'homepage/announcements?sort=valid_until&sort_direction=asc&count=' + count + '&page=' + page + '&showPast=true',
      method: 'get'
    })
  }
  static createAnnouncement(data) {
    return request({
      url: 'homepage/announcements',
      method: 'post',
      data
    })
  }
  static updateAnnouncement(data, id) {
    return request({
      url: 'homepage/announcements/' + id,
      method: 'put',
      data
    })
  }
  static deleteAnnouncement(id) {
    return request({
      url: 'homepage/announcements/' + id,
      method: 'delete'
    })
  }
}
