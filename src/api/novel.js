import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/novel/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/novel/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/novel/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(novel) {
        return request({
            url: `/web/novel/update`,
            method: 'put',
            data: novel
        })
    },
    add(novel) {
        return request({
            url: '/web/novel/add',
            method: 'post',
            data: novel,
        })
    },
    getArticle(id){
        return request({
            url: `/web/article/getById/${id}`,
            method: 'get'
        })
    },
    updateArticle(article) {
        return request({
            url: `/web/article/update`,
            method: 'put',
            data: article
        })
    },
    addArticle(article) {
        return request({
            url: '/web/article/add',
            method: 'post',
            data: article
        })
    },
    delArticleById(id) {
        return request({
            url: `/web/article/delById/${id}`,
            method: 'DELETE',
        })
    },
}
