import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/banner/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/banner/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/banner/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/banner/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/banner/add',
            method: 'post',
            data: banner,
        })
    }
}
