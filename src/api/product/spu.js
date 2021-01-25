/* 
包含spu管理相关接口请求函数
*/
import request from '@/utils/request'

export default {
  
    getSaleAttrList() {
        return request.get('/admin/product/baseSaleAttrList')
    },

   
    remove(spuId) {
        return request.delete(`/admin/product/deleteSpu/${spuId}`)
    },

   
    get(spuId) {
        return request.get(`/admin/product/getSpuById/${spuId}`)
    },

   
    addUpdate(spuInfo) {
        // return request.post(`/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`, spuInfo)
        return request({
            url: `/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
            method: 'POST',
            data: spuInfo
        })
    },

  
    getList(page, limit, category3Id) {
      
        return request({
            url: `/admin/product/${page}/${limit}`,
            method: 'GET',
            params: { category3Id }
        })
    },

  
}