import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import {Categories} from "../../Types/ProductCategoriesEnum";
import { validateEditImage, validateImage, validateMultipleEditImages, validateMultipleImages } from "./validModal";
import IProduct from "../../Types/Product";
import useAdminApi from "../../hook/useAdminApi";
import { Box, CircularProgress } from "@mui/material";

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
    setEditProduct: React.Dispatch<React.SetStateAction<IProduct | null>>;
    editProduct: IProduct | null;
    getAllProducts: () => Promise<void>;
    getProductsByCategory: (category: string) => Promise<void>;
}

const EditProductModal: FC<INewProductModalProps> = ({setEditProduct, editProduct, getAllProducts, getProductsByCategory, selectedCategory}) => {
    const {register, handleSubmit, formState: {errors, dirtyFields, isDirty}, reset} = useForm<IFormData>()
    const {loading, error, data, updateProduct} = useAdminApi()
    useEffect(() => {
        if (editProduct) {
          reset({
            name: editProduct.name,
            price: editProduct.price.toString(),
            description: editProduct.description,
            category: editProduct.category,
            width: editProduct.width.toString(),
            height: editProduct.height.toString(),
            depth: editProduct.depth.toString(),
            materials: editProduct.materials,
          });
        }
      }, []);
      useEffect(()=> {
        const updateData = async () => {
            if(data) {
                if (selectedCategory) {
                    await getProductsByCategory(selectedCategory);
                } else {
                    await getAllProducts();
                }
                
            }
        }
        updateData()

    }, [data])

    const submitData = async (form: IFormData) => {
        const formData = new FormData()
        if (dirtyFields.name)formData.append('name', form.name)
        if (dirtyFields.category) formData.append('category', form.category)
        if (dirtyFields.price) formData.append('price', form.price)
        if (dirtyFields.width) formData.append('width', form.width)
        if (dirtyFields.height) formData.append('height', form.height)
        if (dirtyFields.depth) formData.append('depth', form.depth)
        if (dirtyFields.description) formData.append('description', form.description)
        if (dirtyFields.materials) formData.append('materials', form.materials)

        if (form.avatar && form.avatar[0] && dirtyFields.avatar) {
            formData.append('avatar', data.avatar[0]);
        }
    
        if (form.imgs) {
             Array.from(form.imgs).forEach((file, index) => {
                formData.append(`imgs`, file);
            });
        }

        if (editProduct?.id)  await updateProduct(editProduct?.id, formData).then(() => console.log(data));
        reset(); 

       


    }
    return (

        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget ? setEditProduct(null) : null} className='modal active' id="productModal">
        <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title" id="modalTitle"><i className="fas fa-checkx-circle"></i> Редактирование товара</h2>
                <button onClick={() => {setEditProduct(null)}} className="close-button" id="closeModal">&times;</button>
            </div>
            <form id="productForm" onSubmit={handleSubmit((data) => submitData(data))}>

                {!error && !loading && !data ? <><div className="form-group">
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
                    <input {...register('avatar', {validate: validateEditImage})} type="file" id="productImage" accept="image/*" />
                    <div id="imagePreview" className="image-preview"></div>
                    {errors.avatar && (
                        <p style={{ color: 'red' }}>⚠️ {errors.avatar.message as string}</p>
                        )}
                </div>

                <div className="admin-form-group">
                    <label htmlFor="productImage"><i className="fas fa-image"></i> Изображения товара</label>
                    <input {...register('imgs', {validate: validateMultipleEditImages})} type="file" multiple id="productImage" accept="image/*"/>
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
                    <button type="submit" disabled={!isDirty} className="save-button" id="saveBtn">
                        <i className="fas fa-save"></i> Сохранить
                    </button>
                </div></>  : null}

                {loading && !error && !data ? 
                                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                    <CircularProgress color='info'/>
                                </Box> : null
                    }
                    {!error && !loading && data ? <p> Продукт {editProduct?.name} успешно изменён</p> : null}
                    {error && !loading && ! data ? <p> Не удалось изменить продукт </p> : null}
            </form>

        </div>
    </div>
        
    )
}

export default EditProductModal