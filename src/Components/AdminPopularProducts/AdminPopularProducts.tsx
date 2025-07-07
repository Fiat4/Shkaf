const AdminPopularProducts: React.FC = () => {
    return (
         <>
            <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-star"></i> Популярные товары</h1>
            <div className="header-right">
                <div className="total-products">
                    <i className="fas fa-star"></i>
                    Популярных товаров: <span id="totalProductsCount">0</span>
                </div>
                <button className="add-button" id="addProductBtn">
                    <i className="fas fa-plus"></i> Добавить в популярное
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
                        <th>Позиция</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    {/* <!-- Здесь будут отображаться популярные товары --> */}
                </tbody>
            </table>
        </div>
    </div>

    {/* <!-- Модальное окно добавления/редактирования товара --> */}
    <div className="modal" id="productModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title" id="modalTitle"><i className="fas fa-plus-circle"></i> Добавление в популярное</h2>
                <button className="close-button" id="closeModal">&times;</button>
            </div>
            <form id="productForm">
                <div className="form-group">
                    <label htmlFor="productName"><i className="fas fa-tag"></i> Выберите товар</label>
                    <select id="productName" required>
                        <option value="">Выберите товар</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="productPosition"><i className="fas fa-sort-numeric-down"></i> Позиция в списке</label>
                    <input type="number" id="productPosition" min="1" required/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="cancel-button" id="cancelBtn">
                        <i className="fas fa-times"></i> Отмена
                    </button>
                    <button type="submit" className="save-button" id="saveBtn">
                        <i className="fas fa-save"></i> Добавить
                    </button>
                </div>
            </form>
        </div>
    </div>
        </>
    )
}
export default AdminPopularProducts