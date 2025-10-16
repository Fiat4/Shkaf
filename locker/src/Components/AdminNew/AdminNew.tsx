import { useEffect, useState } from "react"
import useAdminApi from "../../hook/useAdminApi"
import ApiResponse from "../../Types/ApiResponse"
import IProduct from "../../Types/Product"

const AdminNew: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    const {getRecentProducts, error, data, loading} = useAdminApi<ApiResponse<IProduct>>()
    useEffect(() => {
        getRecentProducts(sortOrder)
    },[sortOrder])
    return (
        <>
        <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-clock"></i> Новинки</h1>
            <div className="header-right">
                <div className="total-products">
                    <select onChange={(e) => {
              setSortOrder(e.target.value as 'desc' | 'asc')
            }}  style={{padding:'6px 12px', fontSize:16}}>
                          <option key='desc' value="desc">Более новые</option>
                          <option key='asc' value="asc">Менее новые</option>
                          
                          
                        </select>
                    
                </div>
                
            </div>
        </div>

        <div className="content-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Дата добавления</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    {loading && <tr><td colSpan={6}>Загрузка продуктов...</td></tr>}
            {error && <tr><td colSpan={6} style={{color: 'red'}}>Что-то пошло не так</td></tr>}
            {!loading && !error && data?.data && data.data.length === 0 && <tr><td colSpan={6}>Продукты не найдены.</td></tr>}
                    {data?.data && !loading ?  data.data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{new Date(item.created_at).toLocaleDateString('ru-RU', {day: '2-digit',month: '2-digit', year: 'numeric', hour: "2-digit", minute: '2-digit'})}</td>
                    </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    </div>

    
        </>
    )
}

export default AdminNew