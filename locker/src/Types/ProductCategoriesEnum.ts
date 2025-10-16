export enum Categories {
    KITCHEN = "Кухни",
    WALLS = "Стенки",
    HALLWAY = "Прихожие",
    BATHROOM = "Санузлы",
    WARDROBE = "Шкафы",
    BEDROOMS = "Кровати",
};

export type CategoriesKeysLowerCase = Lowercase<keyof typeof Categories>

export const categoriesKeysLowerCase = [
  'kitchen',
  'walls',
  'hallway',
  'bathroom',
  'wardrobe',
  'bedrooms',
] as const;

export type CategoriesPathParam = typeof categoriesKeysLowerCase[number];

export const getCategoryNameSafe = (
  categoryKey: typeof categoriesKeysLowerCase[number]
): string => {
  switch (categoryKey) {
    case 'kitchen': return Categories.KITCHEN;
    case 'walls': return Categories.WALLS;
    case 'hallway': return Categories.HALLWAY;
    case 'bathroom': return Categories.BATHROOM;
    case 'wardrobe': return Categories.WARDROBE;
    case 'bedrooms': return Categories.BEDROOMS;
    default: return categoryKey;
  }
};

export const getRussianCategoryName = (backendCategory: string): string => {
  const categoryMap: Record<string, string> = {
    'KITCHEN': Categories.KITCHEN,
    'WALLS': Categories.WALLS,
    'HALLWAY': Categories.HALLWAY,
    'BATHROOM': Categories.BATHROOM,
    'WARDROBE': Categories.WARDROBE,
    'BEDROOMS': Categories.BEDROOMS,
  };
  
  return categoryMap[backendCategory] || '';
};