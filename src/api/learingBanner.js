import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/learingbanner/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/learingbanner/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/learingbanner/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/learingbanner/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/learingbanner/add',
            method: 'post',
            data: banner,
        })
    }
}
