import { FC } from "react";
import { useForm } from "react-hook-form";
import { validateImage, validateMultipleImages } from "./validModal";
import {Categories} from "../../Types/ProductCategoriesEnum";
import useAdminApi from "../../hook/useAdminApi";

interface IFormData {
    name: string,
    category: keyof typeof Categories,
    price: string,
    avatar: FileList,
    imgs: FileList,
    width: string,
    height: string,
    depth: string,
    materials: string,
    description: string,

}

interface INewProductModalProps {
    selectedCategory: string | null;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    getAllProducts: () => Promise<void>;
    getProductsByCategory: (category: string) => Promise<void>;
}

const NewProductModal: FC<INewProductModalProps> = ({ selectedCategory, setModal, getAllProducts, getProductsByCategory }) => {
    const {register, handleSubmit, formState: {errors}, reset} = useForm<IFormData>()
    const {createProduct, loading, error, data} = useAdminApi()

    const submitData = async (form: IFormData) => {
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('category', form.category)
        formData.append('price', form.price)
        formData.append('width', form.width)
        formData.append('height', form.height)
        formData.append('depth', form.depth)
        formData.append('description', form.description)
        formData.append('materials', form.materials)
        

        if (form.avatar && form.avatar[0]) {
            formData.append('avatar', form.avatar[0]);
        }
    
        if (form.imgs) {
             Array.from(form.imgs).forEach((file, index) => {
                formData.append(`imgs`, file);
            });
        }

        await createProduct(formData)
    
        if (selectedCategory && !error && !loading) {
            await getProductsByCategory(selectedCategory);
        } else {
            await getAllProducts();
        }
        setModal(false); 
        reset(); 
    }

    return (
        <form id="productForm" onSubmit={handleSubmit((data) => submitData(data))}>
                <div className="admin-form-group">
                    <label htmlFor="productName"><i className="fas fa-tag"></i> Название товара</label>
                    <input {...register('name', {required: 'Название продукта обязательно', minLength: {value: 4, message: 'Название должно содержать более 4х букв'}})} type="text" id="productName" required/>
                    {errors.name && <p style={{ color: 'red' }}>⚠️ {errors.name.message?.toString()}</p>}
                </div>
                <div className="admin-form-group">
                    <label htmlFor="productCategory"><i className="fas fa-folder"></i> Категория</label>
                    <select {...register('category', {validate: (value: keyof typeof Categories | '') => value !== '' || 'Выберите категорию'})} id="productCategory" required>
                        <option value="">Выберите категорию</option>
                        {Object.entries(Categories).map(([key, value]) => <option value={key}>{value}</option>)}
                    </select>
                    {errors.category && <p style={{ color: 'red' }}>⚠️ {errors.category.message?.toString()}</p>}
                </div>
                <div className="admin-form-group">
                    <label htmlFor="productPrice"><i className="fas fa-ruble-sign"></i> Цена</label>
                    <input {...register('price', {required: 'Цена продукта обязательна', max: {value:10000000, message: 'Цена слишком высокая'} ,min: {value: 10000, message: 'Цена слишком низкая'}})} type="number" id="productPrice" required/>
                    {errors.price && <p style={{ color: 'red' }}>⚠️ {errors.price.message?.toString()}</p>}
                </div>
    
                <div className="admin-form-group">
                    <label htmlFor="productImage"><i className="fas fa-image"></i> Аватар товара</label>
                    <input {...register('avatar', {validate: validateImage})} type="file" id="productImage" accept="image/*" required/>
                    <div id="imagePreview" className="image-preview"></div>
                    {errors.avatar && (
                        <p style={{ color: 'red' }}>⚠️ {errors.avatar.message as string}</p>
                        )}
                </div>

                <div className="admin-form-group">
                    <label htmlFor="productImage"><i className="fas fa-image"></i> Изображения товара</label>
                    <input {...register('imgs', {validate: validateMultipleImages})} type="file" multiple id="productImage" accept="image/*" required/>
                    <div id="imagePreview" className="image-preview"></div>
                    {errors.imgs && (
                        <p style={{ color: 'red' }}>⚠️ {errors.imgs.message as string}</p>
                        )}
                </div>

                <div className="admin-form-group">
                    <label htmlFor="productDescription"><i className="fas fa-info-circle"></i> Описание товара</label>
                    <textarea {...register('description', {required: 'Добавьте описание товара', maxLength: {value: 255, message: 'Максимально 250 символов'}})} id="productDescription" rows={10} required></textarea>
                </div>

                <div className="admin-form-group">
                    <label htmlFor="productDimensions"><i className="fas fa-ruler"></i> Размеры (мм)</label>
                    <div className="dimensions-inputs">
                        <input {...register('width', {required: 'Введите размеры'})} type="number" id="productWidth" placeholder="Ширина" required/>
                        <input {...register('height', {required: 'Введите размеры'})} type="number" id="productHeight" placeholder="Высота" required/>
                        <input {...register('depth', {required: 'Введите размеры'})} type="number" id="productDepth" placeholder="Глубина" required/>
                    </div>
                </div>
                <div className="admin-form-group">
                    <label htmlFor="productMaterials"><i className="fas fa-cube"></i> Материалы</label>
                    <textarea {...register('materials', {required: 'Добавьте материалы товара', maxLength: {value: 255, message: 'Максимально 250 символов'}})} id="productMaterials" rows={5} required></textarea>
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
    )
}

export default NewProductModal