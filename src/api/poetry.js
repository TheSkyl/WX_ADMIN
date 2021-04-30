import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/poetry/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/poetry/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/poetry/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(poetry) {
        return request({
            url: `/web/poetry/update`,
            method: 'put',
            data: poetry
        })
    },
    add(poetry) {
        return request({
            url: '/web/poetry/add',
            method: 'post',
            data: poetry,
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
