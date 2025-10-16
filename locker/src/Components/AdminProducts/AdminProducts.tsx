import { useEffect, useState } from "react"
import NewProductModal from "../Modals/NewProductModal";
import useAdminApi from "../../hook/useAdminApi";
import {Categories} from "../../Types/ProductCategoriesEnum";
import DeleteProductModal from "../Modals/DeleteProductModalt";
import EditProductModal from "../Modals/EditProductModal";
import IProduct from "../../Types/Product";

const AdminProducts: React.FC = () => {
    const [addModal, setAddModal] = useState<boolean>(false)
    const [deleteProduct, setDeleteProduct] = useState<{name: string, id: string} | null>(null)
    const [editProduct, setEditProduct] = useState<IProduct | null>(null)

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const {data, error, loading, getAllProducts, getProductsByCategory} = useAdminApi()
    const [PopUp, setPopUp] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            await getAllProducts();   
        };

        fetchProducts()
    }, []); 

    return (
       <>
        <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-box"></i> Управление товарами</h1>
            <div className="header-right" style={{display:'flex', alignItems:'center', gap:16}}>
                <div className="total-products">
                    <i className="fas fa-cubes"></i>
                    Всего товаров: <span id="totalProductsCount">{data ? data.meta.total : 0}</span>
                </div>
                <select onChange={e => {
                    e.target.value === '' ? getAllProducts() : getProductsByCategory(e.target.value)
                    setSelectedCategory(e.target.value)
                }} style={{padding:'6px 12px', fontSize:16}}>
                  <option key='ALL' value=''>Все категории</option>
                  {Object.entries(Categories).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}
                </select>
                <button onClick={() => {setAddModal(true)}} className="add-button" id="addProductBtn">
                    <i className="fas fa-plus"></i> Добавить товар
                </button>
            </div>
        </div>

        <div className="content-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Цена</th>
                        <th>Наличие</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    {loading && <tr><td colSpan={6}>Загрузка продуктов...</td></tr>}
                    {error && <tr><td colSpan={6} style={{color: 'red'}}>Что-то пошло не так</td></tr>}
                    {!loading && !error && data && data.data && data.data.length === 0 && <tr><td colSpan={6}>Продукты не найдены.</td></tr>}
                    {!loading && !error && data && data.data && data.data.map((product: any) => (
                      <tr className="product-table-item" key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.price}</td>
                        <td>{product.inStock ? "Да" : "Нет"}</td>
                        <td>
                            <button onClick={() => setDeleteProduct({
                                name: product.name,
                                id: product.id
                            })} className="delete-button">
                                <i className="fas fa-trash"></i>
                            </button>
                            <button onClick={() => setEditProduct({
                                ...product
                            })} className="edit-button">
                                <i className="fas fa-pencil-alt"></i>
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>

    <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget ? setAddModal(false) : null} className={`modal ${addModal ? 'active' : ''}`} id="productModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title" id="modalTitle"><i className="fas fa-plus-circle"></i> Добавление товара</h2>
                <button onClick={() => {setAddModal(false)}} className="close-button" id="closeModal">&times;</button>
            </div>
            <NewProductModal 
              selectedCategory={selectedCategory}
              setModal={setAddModal}
              getAllProducts={getAllProducts}
              getProductsByCategory={getProductsByCategory}
            />
        </div>
    </div>

    {deleteProduct ? <DeleteProductModal setDeleteProduct={setDeleteProduct} deleteProduct={deleteProduct} getAllProducts={getAllProducts}
              getProductsByCategory={getProductsByCategory} selectedCategory={selectedCategory}/> : null}

    {editProduct ? <EditProductModal setEditProduct={setEditProduct} editProduct={editProduct} getAllProducts={getAllProducts} getProductsByCategory={getProductsByCategory} selectedCategory={selectedCategory}/> : null}

       </>
    )
}
export default AdminProducts