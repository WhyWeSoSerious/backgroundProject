import request from '@/utils/request'
export default {
    //todo 删除
    delete(id) {
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },
    //todo 添加或者修改 判定id
    addOrUpdate(trademark) {
        //根据id来决定这个请求函数是添加还是修改
        if (trademark.id) {
            return request.put('/admin/product/baseTrademark/update', trademark)
        } else {
            return request.post('/admin/product/baseTrademark/save', trademark)
        }
    },
    //todo 获取
    getPageList(page, limit) {
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    }
}