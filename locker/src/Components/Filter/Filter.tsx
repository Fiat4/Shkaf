import { useState } from "react"

const Filter: React.FC<{setSortOrder: React.Dispatch<React.SetStateAction<"desc" | "asc" | null>>, sortEnts: "desc" | "asc" | null, onApply?: () => void}> = ({setSortOrder, sortEnts, onApply}) => {

    const [popDD, setPopDD] = useState<boolean>(false)
    const [sizeDD, setSizeDD] = useState<boolean>(false)
    const [priceDD, setPriceDD] = useState<boolean>(false)

    return (
        <div className="filters-container">

            <div className="filter-group">
                <div className="filter-header dropdown-trigger" onClick={() => setPopDD(!popDD)}>
                    <span>По популярности</span>
                    <span className="arrow">^</span>
                </div>
                <div className={`dropdown-content ${popDD ? 'active' : ''}`}>
                    <div className={`dropdown-item ${sortEnts==='desc' ? ' active' : null}`} onClick={() => setSortOrder((v) => {
                        return v==='desc' ? null : 'desc'
                    })}>Более популярные</div>
                    <div className={`dropdown-item ${sortEnts==='asc' ? ' active' : null}`} onClick={() => setSortOrder((v) => {
                        return v==='asc' ? null : 'asc'
                    })}>Менее популярные</div>
                </div>
            </div>

            <div className="filter-buttons">
                <button className="filter-button clear" onClick={() => setSortOrder(null)} type="button">очистить</button>
                {onApply && (
                    <button className="filter-button apply" onClick={onApply} type="button">применить</button>
                )}
            </div>
        </div>
    )
}

export default Filter