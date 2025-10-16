import { FC, useEffect } from "react";
import useAdminApi from "../../hook/useAdminApi";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'

interface IProps {
    setDeleteProduct: React.Dispatch<React.SetStateAction<{name: string, id: string} | null>>;
    deleteProduct: {name: string, id: string} | null;
    getAllProducts: () => Promise<void>;
    getProductsByCategory: (category: string) => Promise<void>;
    selectedCategory: string | null;
}

const DeleteProductModal: FC<IProps> = ({setDeleteProduct, deleteProduct, getAllProducts, getProductsByCategory, selectedCategory}) => {

    const {data, error, loading, deleteProductById} = useAdminApi()

    useEffect(()=> {
        const updateData = async () => {
            if(data) {
                if (selectedCategory) {
                    await getProductsByCategory(selectedCategory);
                } else {
                    await getAllProducts();
                }
                setDeleteProduct(null)
            }
        }
        updateData()

    }, [data])

    return (
        <div onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget ? setDeleteProduct(null) : null} className='modal active' id="descriptionModal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title"><i className="fas fa-info-circle"></i> Удаление продукта</h2>
                </div>
                <div className="description-content">
                    {!loading && !error && !data ? <p id="descriptionText">Вы действительно хотите удалить пордукт "{deleteProduct?.name}"?</p> : null}
                    {loading && !error && !data ? 
                                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                    <CircularProgress color='info'/>
                                </Box> : null
                    }
                    {!error && !loading && data ? <p> Продукт {deleteProduct?.name} успешно удалён</p> : null}
                    {error && !loading && ! data ? <p> Не удалось удалить продукт </p> : null}
                </div>
                <div className="modal-footer">
                    <button onClick={() => {setDeleteProduct(null)}} className="cancel-button" id="closeDescriptionBtn">
                        <i className="fas fa-times"></i> Отмена
                    </button>
                    <button disabled={error || loading || data } style={error || loading || data ? {background: '#686565'} : {background: '#d41e39'}} onClick={async () => {
                        if (deleteProduct) {
                            await deleteProductById(deleteProduct.id)
                        }

                    }} className="save-button" id="closeDescriptionBtn">
                        <i className="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        </div>
    ) 
}

export default DeleteProductModal