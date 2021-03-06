import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/poetryAuthorBanner/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/poetryAuthorBanner/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/poetryAuthorBanner/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(poetry) {
        return request({
            url: `/web/poetryAuthorBanner/update`,
            method: 'put',
            data: poetry
        })
    },
    add(poetry) {
        return request({
            url: '/web/poetryAuthorBanner/add',
            method: 'post',
            data: poetry,
        })
    }
}
