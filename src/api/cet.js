import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/cet4/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/cet4/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/cet4/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(poetry) {
        return request({
            url: `/web/cet4/update`,
            method: 'put',
            data: poetry
        })
    },
    add(poetry) {
        return request({
            url: '/web/cet4/add',
            method: 'post',
            data: poetry,
        })
    }
}