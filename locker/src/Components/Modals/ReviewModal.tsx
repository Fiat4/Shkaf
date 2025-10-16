








import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IProductReviewForm, IReview } from '../../Types/Reviews';
import useApi from '../../hook/UseApi';
import { CircularProgress } from '@mui/material';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string
    api: ReturnType<typeof useApi<IReview>>;
    setNotification: () => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    productId, 
    api,
    setNotification
}) => {

    const {register, watch, getValues, setValue, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<IProductReviewForm>()
    const watchedAvatar = watch('avatar');
    const watchedImgs = watch('imgs');
    const rating = watch('rating')
    const [fileError, setFileError] = useState<string>('');
    
    useEffect(() => {
        if (api.data || api.error) {
            onClose()
            setNotification()
            reset()
        }
    }, [api.data, api.error])

  useEffect(() => setValue('rating', 5), [])
  const handleAvatarRemove = () => {
    setValue('avatar', undefined);
  };

  const handleImageRemove = (index: number) => {
  const currentFiles = getValues('imgs');
  if (currentFiles) {
    const fileArray: File[] = [];
    
    for (let i = 0; i < currentFiles.length; i++) {
      const file = currentFiles.item(i);
      if (file) {
        fileArray.push(file);
      }
    }
    
    const updatedFiles = fileArray.filter((_, i) => i !== index);
    
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    
    setValue('imgs', dataTransfer.files.length > 0 ? dataTransfer.files : undefined);
  }
};

  const validateMultipleImages = (files: FileList | undefined | null) => {
    if (!files) return true;
    
    if (files.length > 4) {
      return 'Можно загрузить не более 5 фотографий';
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        return 'Все файлы должны быть изображениями';
      }
      if (file.size > 5 * 1024 * 1024) {
        return 'Размер каждого файла не должен превышать 5MB';
      }
    }
    
    return true;
  };

  const onSubmit = async (form: IProductReviewForm) => {
    const formData = new FormData()
        formData.append('username', form.userName)
        formData.append('email', form.email)
        formData.append('rating', form.rating.toString())
        formData.append('review', form.review)
        formData.append('productId', productId)

        if (form.avatar && form.avatar[0]) {
            formData.append('avatar', form.avatar[0]);
        }
    
        if (form.imgs) {
             Array.from(form.imgs).forEach((file) => {
                formData.append(`imgs`, file);
            });
        }

    await api.createProductReview(formData)
    setValue('rating', 5)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileError('');

    if (files && files.length > 5) {
      setFileError('Можно загрузить не более 5 фотографий');
      e.target.value = '';
      return;
    }

  };

   const { ref, onChange, ...rest } = register('imgs', {
    validate: validateMultipleImages
  });
  
  






    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={e => e.stopPropagation()}>
                <button className="review-modal-close" onClick={onClose}>&times;</button>
                
                <div className="review-modal-content">
                    <div className="review-modal-header">
                        <h2 className="review-modal-title">Оставить отзыв</h2>
                        <p className="review-modal-description">
                            Поделитесь своим мнением о товаре
                        </p>
                    </div>
                    
                    <form className="review-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="review-form-row">
                            <input
                                type="text"
                                placeholder="ВАШЕ ИМЯ"
                                className="review-input"
                                {...register('userName', {required: 'Имя пользователя обязательно!', minLength: {value: 2, message: 'Имя должно содержать более 2х букв'}})}
                                required
                            />
                            <input
                                type="email"
                                placeholder="ВАШ EMAIL"
                                className="review-input"
                                {...register('email', {required: 'Почта обязательна', pattern: { value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, message: 'Некорректный почтовый адрес'}})}
                                required
                            />
                        </div>
                        
                        <div className="review-rating-section">
                            <label className="review-rating-label">ОЦЕНКА</label>
                            <div className="review-stars">
                                {[1, 2, 3, 4, 5].map((star, index) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${ rating >= star ? 'active' : ''}`}
                                        onClick={() => setValue('rating', star)}
                                    >
                                        <i className="fa-solid fa-star"></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <textarea
                            placeholder="ВАШ ОТЗЫВ"
                            className="review-textarea"
                            rows={4}
                            {...register('review', {required: 'Название продукта обязательно', maxLength: {value: 300, message: 'Отзыв должен содержать до 300 символов.'}})}
                            required
                        />
                        
                        <div className="review-photo-section">
                            
                            <label className="review-photo-label">
                                <input
                                type="file"
                                accept="image/*"
                                className="review-photo-input"
                                id="review-photo"
                                {...register('avatar')}
                            />
                                <i className="fa-solid fa-camera"></i>
                                ДОБАВИТЬ АВАТАР (необязательно)
                            </label>
                            {watchedAvatar && watchedAvatar.length > 0 && (
                                <div className="review-photo-preview">
                                    <img src={URL.createObjectURL(watchedAvatar[0])} alt="Preview" />
                                    <button 
                                        type="button" 
                                        className="remove-photo-btn"
                                        onClick={handleAvatarRemove}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            )}



                            <label htmlFor='review-imgs' className="review-photo-label">
                                <input
                                type="file"
                                multiple
                                className="review-photo-input"
                                {...rest}
                                ref={ref}
                                onChange={(e) => {
                                    handleFileChange(e);
                                    onChange(e);
                                }}
                                id="review-imgs"
                            />

                                <i className="fa-solid fa-camera"></i>
                                ДОБАВИТЬ ФОТО ТОВАРА (необязательно)
                            </label>
                            <div className="review-images-preview">
                            {watchedImgs && Array.from(watchedImgs).map((file, index) => (
                            <div key={index} className="review-photo-preview">
                                <img src={URL.createObjectURL(file as File)} alt={`Preview ${index + 1}`} />
                                <button 
                                type="button" 
                                className="remove-photo-btn"
                                onClick={() => handleImageRemove(index)}
                                >
                                <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            ))}
                            {fileError && (
                                <p style={{ color: 'red' }}>⚠️ {fileError.toString()}</p>
                            )}
                            {errors.imgs && <p style={{ color: 'red' }}>⚠️ {errors.imgs.message?.toString()}</p>}
                        </div>
                            


                        </div>
                        <button type="submit" className="review-submit-btn">
                            {isSubmitting ? <CircularProgress size={20} style={{color: 'white'}}/> : 'ОТРАВИТЬ ОТЗЫВ'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
