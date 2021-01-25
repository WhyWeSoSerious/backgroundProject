import request from '@/utils/request'
export default {
    //todo 获取
    getList(category1Id, category2Id, category3Id) {
        return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    //todo 删除
    delete(attrId) {
        return request.delete(` /admin/product/deleteAttr/${attrId}`)
    },
    //todo 添加
    addOrUpdate(attr) {
        return request.post('/admin/product/saveAttrInfo', attr)
    }
}