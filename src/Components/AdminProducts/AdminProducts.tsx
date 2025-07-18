import { useState } from "react"

const categories = [
  "Шкафы",
  "Кухни",
  "Стенки",
  "Прихожие",
  "Спальни",
  "Детские"
];

const AdminProducts: React.FC = () => {
    const [modal, setModal] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    return (
       <>
        <div className="main-content">
        <div className="content-header">
            <h1><i className="fas fa-box"></i> Управление товарами</h1>
            <div className="header-right" style={{display:'flex', alignItems:'center', gap:16}}>
                <div className="total-products">
                    <i className="fas fa-cubes"></i>
                    Всего товаров: <span id="totalProductsCount">0</span>
                </div>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{padding:'6px 12px', fontSize:16}}>
                  <option value="">Все категории</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button onClick={() => {setModal(true)}} className="add-button" id="addProductBtn">
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
                    {/* <!-- Товары будут добавляться динамически --> */}
                </tbody>
            </table>
        </div>
    </div>

    {/* <!-- Модальное окно добавления/редактирования товара --> */}
    <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget ? setModal(false) : null} className={`modal ${modal ? 'active' : ''}`} id="productModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title" id="modalTitle"><i className="fas fa-plus-circle"></i> Добавление товара</h2>
                <button onClick={() => {setModal(false)}} className="close-button" id="closeModal">&times;</button>
            </div>
            <form id="productForm">
                <div className="form-group">
                    <label htmlFor="productName"><i className="fas fa-tag"></i> Название товара</label>
                    <input type="text" id="productName" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="productCategory"><i className="fas fa-folder"></i> Категория</label>
                    <select id="productCategory" required>
                        <option value="">Выберите категорию</option>
                        <option value="Шкафы">Шкафы</option>
                        <option value="Кровати">Кровати</option>
                        <option value="Кухни">Кухни</option>
                        <option value="Стенки">Стенки</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="productPrice"><i className="fas fa-ruble-sign"></i> Цена</label>
                    <input type="number" id="productPrice" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="productStock"><i className="fas fa-box"></i> Наличие</label>
                    <select id="productStock" required>
                        <option value="В наличии">В наличии</option>
                        <option value="Нет в наличии">Нет в наличии</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="productImage"><i className="fas fa-image"></i> Изображение товара</label>
                    <input type="file" id="productImage" accept="image/*" required/>
                    <div id="imagePreview" className="image-preview"></div>
                </div>
                <div className="form-group">
                    <label htmlFor="productDescription"><i className="fas fa-info-circle"></i> Описание товара</label>
                    <textarea id="productDescription" rows={10} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="productDimensions"><i className="fas fa-ruler"></i> Размеры (мм)</label>
                    <div className="dimensions-inputs">
                        <input type="number" id="productWidth" placeholder="Ширина" required/>
                        <input type="number" id="productHeight" placeholder="Высота" required/>
                        <input type="number" id="productDepth" placeholder="Глубина" required/>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="productMaterials"><i className="fas fa-cube"></i> Материалы</label>
                    <textarea id="productMaterials" rows={5} required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="productOpening"><i className="fas fa-door-open"></i> Открывание</label>
                    <textarea id="productOpening" rows={3} required></textarea>
                </div>
                <div className="modal-footer">
                    <button type="button" className="cancel-button" id="cancelBtn">
                        <i className="fas fa-times"></i> Отмена
                    </button>
                    <button type="submit" className="save-button" id="saveBtn">
                        <i className="fas fa-save"></i> Сохранить
                    </button>
                </div>
            </form>
        </div>
    </div>

    {/* <!-- Модальное окно просмотра описания --> */}
    <div className="modal" id="descriptionModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title"><i className="fas fa-info-circle"></i> Описание товара</h2>
                <button className="close-button" id="closeDescriptionModal">&times;</button>
            </div>
            <div className="description-content">
                <p id="descriptionText"></p>
            </div>
            <div className="modal-footer">
                <button className="cancel-button" id="closeDescriptionBtn">
                    <i className="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    </div>

    {/* <!-- Модальное окно просмотра фото --> */}
    <div className="modal" id="imageModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title"><i className="fas fa-image"></i> Фото товара</h2>
                <button className="close-button" id="closeImageModal">&times;</button>
            </div>
            <div className="image-content">
                <img id="productImagePreview" src="" alt="Фото товара"/>
            </div>
            <div className="modal-footer">
                <button className="cancel-button" id="closeImageBtn">
                    <i className="fas fa-times"></i> Закрыть
                </button>
            </div>
        </div>
    </div>
       </>
    )
}
export default AdminProducts