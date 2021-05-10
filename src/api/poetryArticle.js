import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/poetrys/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/poetrys/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/poetrys/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/poetrys/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/poetrys/add',
            method: 'post',
            data: banner,
        })
    }
}
