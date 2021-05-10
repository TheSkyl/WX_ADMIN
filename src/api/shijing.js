import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/shijing/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/shijing/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/shijing/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/shijing/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/shijing/add',
            method: 'post',
            data: banner,
        })
    }
}
