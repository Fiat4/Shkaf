const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/x-icon'
];

const validateMultipleImages = (fileList: FileList) => {

  if (!fileList || fileList.length < 2) {
    return 'Выберите хотя бы два изображения';
  }

  const maxFiles = 6;
  if (fileList.length > maxFiles) {
    return `Максимум можно загрузить ${maxFiles} картинок`;
  }

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];


    if (!IMAGE_MIME_TYPES.includes(file.type)) {
      return `Файл ${file.name}: Только картинки!`;
    }


    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Файл ${file.name}: Максимальный размер 20MB`;
    }
  }

  return true;
};

const validateMultipleEditImages = (fileList: FileList) => {

  if (fileList.length !== 0) {
    if (!fileList || fileList.length < 2) {
      return 'Выберите хотя бы два изображения';
    }

    if (fileList.length > 6) {
      return `Максимум можно загрузить 6 изображений`;
    }


    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (!IMAGE_MIME_TYPES.includes(file.type)) {
        return `Файл ${file.name}: Только картинки!`;
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        return `Файл ${file.name}: Максимальный размер 20MB`;
      }
    }
    return true
  }

  return true;
};

const validateImage = (fileList: FileList) => {
  if (!fileList || fileList.length === 0) {
    return 'Выберите одно изображение';
  }

  const file = fileList[0]
  if (!IMAGE_MIME_TYPES.includes(file.type)) {
    return `Файл ${file.name}: Только картинки!`;
  }

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return `Файл ${file.name}: Максимальный размер 20MB`;
  }
  return true
}

const validateEditImage = (fileList: FileList) => {
  if (fileList.length === 0) {
    return true;
  } else {
    const file = fileList[0]
    if (!IMAGE_MIME_TYPES.includes(file.type)) {
      return `Файл ${file.name}: Только картинки!`;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return `Файл ${file.name}: Максимальный размер 20MB`;
    }
  }

  return true
}



export { validateImage, validateMultipleImages, validateEditImage, validateMultipleEditImages }
