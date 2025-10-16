import { useEffect, useState } from "react"
import ApiResponse from "../../Types/ApiResponse"
import IProduct from "../../Types/Product"
import useAdminApi from "../../hook/useAdminApi"

const AdminPopularProducts: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
    const {getPopularProducts, error, data, loading} = useAdminApi<ApiResponse<IProduct>>()
    useEffect(() => {
        getPopularProducts(sortOrder)
    },[sortOrder])
    return (
         
            <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-star"></i> Популярные товары</h1>
            <div className="header-right">
                <select onChange={(e) => {
              setSortOrder(e.target.value as 'desc' | 'asc')
            }}  style={{padding:'6px 12px', fontSize:16}}>
                          <option key='desc' value="desc">Более популярные</option>
                          <option key='asc' value="asc">Менее популярные</option>
                          
                          
                        </select>
            </div>
        </div>

        <div className="content-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Оценка популярности</th>
                        <th>Всего просмотров</th>
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
                        <td>{item.popularityScore.toFixed(2)}</td>
                        <td>{item.viewsCount}</td>
                    </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
    </div>
    )
}
export default AdminPopularProducts