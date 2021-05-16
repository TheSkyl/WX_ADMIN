import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/lunyu/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/lunyu/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/lunyu/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(banner) {
        return request({
            url: `/web/lunyu/update`,
            method: 'put',
            data: banner
        })
    },
    add(banner) {
        return request({
            url: '/web/lunyu/add',
            method: 'post',
            data: banner,
        })
    }
}
