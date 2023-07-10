import api from "../config/api";

const orderService = {
    getOrderDetail(id) {
        return api.get(`/order/v2/${id}`)
    },

    getList(query = '') {
        return api.get(`/order/v2${query}`)
    }
}

export default orderService
