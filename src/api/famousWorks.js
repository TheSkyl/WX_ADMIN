import request from '@/utils/request'

export default {
    getAll(pageNum, pageSize, keyword) {
        return request({
            url: '/web/famousWorks/page',
            method: 'get',
            params: { pageNum, pageSize, keyword }
        })
    },
    getById(id) {
        return request({
            url: `/web/famousWorks/getById/${id}`,
            method: 'get',
        })
    },
    delById(id) {
        return request({
            url: `/web/famousWorks/delById/${id}`,
            method: 'DELETE',
        })
    },
    update(famousWorks) {
        return request({
            url: `/web/famousWorks/update`,
            method: 'put',
            data: famousWorks
        })
    },
    add(famousWorks) {
        return request({
            url: '/web/famousWorks/add',
            method: 'post',
            data: famousWorks,
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
