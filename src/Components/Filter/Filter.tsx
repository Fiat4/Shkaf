import { useState } from "react"

const Filter: React.FC = () => {

    const [popDD, setPopDD] = useState<boolean>(false)
    const [sizeDD, setSizeDD] = useState<boolean>(false)
    const [priceDD, setPriceDD] = useState<boolean>(false)

    return (
        <div className="filters-container">

                <div className="filter-group">
                    <div className="filter-header dropdown-trigger"  onClick={() => setPopDD(!popDD)}>
                        <span>По популярности</span>
                        <span className="arrow">^</span>
                    </div>
                    <div className={`dropdown-content ${popDD ? 'active' : ''}`}>
                        <div className="dropdown-item">По возрастанию цены</div>
                        <div className="dropdown-item">По убыванию цены</div>
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-header dropdown-trigger" onClick={() => setSizeDD(!sizeDD)}>
                        <span>Размеры</span>
                        <span className="arrow">^</span>
                    </div>
                    <div className={`dropdown-content ${sizeDD ? 'active' : ''}`}>
                        <div className="filter-options">
                            <div className="size-input">
                                <label>глубина, см</label>
                                <div className="range-inputs">
                                    <input type="number" placeholder="от"/>
                                    <input type="number" placeholder="до"/>
                                </div>
                            </div>
                            <div className="size-input">
                                <label>ширина, см</label>
                                <div className="range-inputs">
                                    <input type="number" placeholder="от"/>
                                    <input type="number" placeholder="до"/>
                                </div>
                            </div>
                            <div className="size-input">
                                <label>высота, см</label>
                                <div className="range-inputs">
                                    <input type="number" placeholder="от"/>
                                    <input type="number" placeholder="до"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-header dropdown-trigger" onClick={() => setPriceDD(!priceDD)}>
                        <span>Цена</span>
                        <span className="arrow">^</span>
                    </div>
                    <div className={`dropdown-content ${priceDD ? 'active' : ''}`}>
                        <div className="price-range">
                            <div className="slider-container">
                                <input type="range" className="price-slider min-slider" min="0" max="300000" step="172" value="0"/>
                                <input type="range" className="price-slider max-slider" min="0" max="300000" step="172" value="300000"/>
                                <div className="slider-track"></div>
                            </div>
                            <div className="filter-options">
                                <div className="size-input">
                                    <label>цена, ₽</label>
                                    <div className="range-inputs">
                                        <input type="number" className="price-from" placeholder="от"/>
                                        <input type="number" className="price-to" placeholder="до"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="filter-buttons">
                    <button className="all-filters-btn" type="button">
                        все фильтры
                    </button>
                    <button className="filter-button save" type="button">сохранить</button>
                    <button className="filter-button clear" type="button">очистить</button>
                </div>
            </div>
    )
}

export default Filter