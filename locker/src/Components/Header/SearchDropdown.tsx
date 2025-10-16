import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hook/UseApi';
import IProduct from '../../Types/Product';
import { Categories, getRussianCategoryName } from '../../Types/ProductCategoriesEnum';

interface SearchDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose, searchQuery }) => {
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const api = useApi<IProduct[]>();

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            performSearch(searchQuery);
        } else {
            setSearchResults([]);
            setHasSearched(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const performSearch = async (query: string) => {
        setIsSearching(true);
        setHasSearched(true);

        try {
            const response = await fetch(`http://localhost:3000/product?search=${encodeURIComponent(query)}&limit=10`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data || []);
            } else {
                setSearchResults([]);
            }

            if (query.trim()) {
                addToRecentSearches(query);
            }
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };


    const addToRecentSearches = (query: string) => {
        const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    };


    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
        onClose();
    };

    const handleCategoryClick = (categoryKey: string) => {
        navigate(`/category/${categoryKey}`);
        onClose();
    };

    const handleRecentSearchClick = (query: string) => {
        performSearch(query);
    };


    if (!isOpen) return null;

    return (
        <div className="search-dropdown active" ref={dropdownRef}>
            <div className="search-dropdown-content">
                {isSearching && (
                    <div className="search-loading">
                        <i className="fa-solid fa-spinner"></i>
                        <span>Поиск товаров...</span>
                    </div>
                )}

                {!isSearching && hasSearched && searchResults.length > 0 && (
                    <div className="search-results">
                        <div className="search-products-list">
                            {searchResults.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="search-product-item"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    {product.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isSearching && hasSearched && searchResults.length === 0 && (
                    <div className="search-no-results">
                        <p>Ничего не найдено</p>
                    </div>
                )}

                {!hasSearched && (
                    <>
                        <div className="search-suggestions">
                            <div className="suggestion-item" onClick={() => handleRecentSearchClick('кухни')}>
                                Кухни на заказ
                            </div>
                            <div className="suggestion-item" onClick={() => handleRecentSearchClick('стенки')}>
                                Мебель для гостиной
                            </div>
                            <div className="suggestion-item" onClick={() => handleRecentSearchClick('шкафы')}>
                                Шкафы-купе
                            </div>
                            <div className="suggestion-item" onClick={() => handleRecentSearchClick('кровати')}>
                                Кровати
                            </div>
                        </div>

                        <div className="search-categories">
                            <div className="category-item" onClick={() => handleCategoryClick('kitchen')}>
                                Кухни
                            </div>
                            <div className="category-item" onClick={() => handleCategoryClick('walls')}>
                                Стенки
                            </div>
                            <div className="category-item" onClick={() => handleCategoryClick('hallway')}>
                                Прихожие
                            </div>
                            <div className="category-item" onClick={() => handleCategoryClick('wardrobe')}>
                                Шкафы
                            </div>
                            <div className="category-item" onClick={() => handleCategoryClick('bedrooms')}>
                                Кровати
                            </div>
                        </div>

                        {recentSearches.length > 0 && (
                            <div className="search-recent">
                                {recentSearches.map((search, index) => (
                                    <div key={index} className="recent-item" onClick={() => handleRecentSearchClick(search)}>
                                        {search}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default SearchDropdown;
