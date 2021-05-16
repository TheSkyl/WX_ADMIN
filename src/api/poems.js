import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/poems/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/poems/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/poems/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/poems/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/poems/add',
            method: 'post',
            data: banner,
        })
    }
}
