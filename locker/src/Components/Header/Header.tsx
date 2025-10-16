import React, {
	forwardRef,
	useEffect,
	useRef,
	useState,
	useImperativeHandle
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Categories, categoriesKeysLowerCase, getCategoryNameSafe } from "../../Types/ProductCategoriesEnum";
import SearchDropdown from "./SearchDropdown";

enum menuEn {
	kitchens = 'kitchens',
	wallunits = 'wallunits',
	hallways = 'hallways',
	bathrooms = 'bathrooms',
	wardrobes = 'wardrobes',
	bedrooms = 'bedrooms'
}

type HeaderProps = {
	variant?: 'default' | 'tabless' | 'searchless'
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ variant = 'default' }, ref) => {
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrolled, setScrolled] = useState<boolean>(false);
	const [sub, setSub] = useState<boolean>(false);
	const [catalogOpenedByClick, setCatalogOpenedByClick] = useState<boolean>(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [isPhoneCopied, setIsPhoneCopied] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);


	useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

	const handleScroll = () => {
		setScrolled(window.scrollY > 50);
	};

	const toggleMobileMenu = () => {
		console.log('toggleMobileMenu called, current state:', mobileMenuOpen);
		setMobileMenuOpen(prev => {
			console.log('Setting mobileMenuOpen to:', !prev);
			return !prev;
		});
	};

	const closeMobileMenu = () => {
		setMobileMenuOpen(false);
	};

	const handleCatalogClick = () => {
		setCatalogOpenedByClick(true);
		setSub(!sub);
	};

	const handleCatalogMouseEnter = () => {
		if (!catalogOpenedByClick) {
			setSub(true);
		}
	};

	const handleCatalogMouseLeave = () => {
		if (!catalogOpenedByClick) {
			setSub(false);
		}
	};

	const closeCatalog = () => {
		setSub(false);
		setCatalogOpenedByClick(false);
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setIsSearchDropdownOpen(value.length > 0);
	};

	const handleSearchInputFocus = () => {
		if (searchQuery.length > 0) {
			setIsSearchDropdownOpen(true);
		}
	};

	const handleSearchDropdownClose = () => {
		setIsSearchDropdownOpen(false);
	};

	const handleAnchorNavigation = (anchorId: string) => {
		const targetElement = document.getElementById(anchorId);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth' });
		} else {
			navigate(`/#${anchorId}`);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash;
			if (hash) {
				const elementId = hash.substring(1);
				const element = document.getElementById(elementId);
				if (element) {
					setTimeout(() => {
						element.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				}
			}
		};

		handleHashChange();

		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	}, []);

	useEffect(() => {
		console.log('mobileMenuOpen changed to:', mobileMenuOpen);
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		
		return () => {
			document.body.style.overflow = '';
		};
	}, [mobileMenuOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (catalogOpenedByClick && sub) {
				const target = event.target as HTMLElement;
				const catalogBtn = document.querySelector('.Katalog-btn');
				const catalogMenu = document.querySelector('.nav-secondary');
				
				if (catalogBtn && catalogMenu && 
					!catalogBtn.contains(target) && 
					!catalogMenu.contains(target)) {
					closeCatalog();
				}
			}
		};

		if (catalogOpenedByClick && sub) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [catalogOpenedByClick, sub]);

	const menuItems = [
		{
			key: menuEn.kitchens,
			label: 'КУХНИ',
			content: (
				<Link to="/category/kitchen" className="nav-link" onClick={closeMobileMenu}>
					Кухни
				</Link>
			)
		},
		{
			key: menuEn.wallunits,
			label: 'СТЕНКИ',
			content: (
				<Link to="/category/walls" className="nav-link" onClick={closeMobileMenu}>
					Стенки
				</Link>
			)
		},
		{
			key: menuEn.hallways,
			label: 'ПРИХОЖИЕ',
			content: (
				<Link to="/category/hallway" className="nav-link" onClick={closeMobileMenu}>
					Прихожие
				</Link>
			)
		},
		{
			key: menuEn.bathrooms,
			label: 'САНУЗЛЫ',
			content: (
				<Link to="/category/bathroom" className="nav-link" onClick={closeMobileMenu}>
					Санузлы
				</Link>
			)
		},
		{
			key: menuEn.wardrobes,
			label: 'ШКАФЫ',
			content: (
				<Link to="/category/wardrobe" className="nav-link" onClick={closeMobileMenu}>
					Шкафы
				</Link>
			)
		},
		{
			key: menuEn.bedrooms,
			label: 'КРОВАТИ',
			content: (
				<Link to="/category/bedrooms" className="nav-link" onClick={closeMobileMenu}>
					Кровати
				</Link>
			)
		},
	];


	return (
		<header className={`header ${variant}`}>
			<div
				className={`container ${scrolled ? "scrolled" : null}`}
				ref={containerRef}
			>
				<nav className="main-nav" aria-label="Основная навигация">
					<ul className="nav-primary container_2">
						<li>
							<Link to="/" className="nav-link" id="header_logo" />
							<div className="mobile-icons-container">
								<button
									className={`header_menu ${mobileMenuOpen ? 'active' : ''}`}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										console.log('Button clicked!');
										toggleMobileMenu();
									}}
									onTouchEnd={(e) => {
										e.preventDefault();
										e.stopPropagation();
										console.log('Button touched!');
										toggleMobileMenu();
									}}
									aria-label="Открыть меню"
								>
									<span className="burger-span"></span>
									<span className="burger-span"></span>
									<span className="burger-span"></span>
								</button>
							</div>


						</li>
						<div className="mobile-phone">
							<span>+7 (977) 777-77-77</span>
						</div>
						<div className={`search-container ${variant}`}>
							<input 
								type="text" 
								id="search_mobile" 
								value={searchQuery}
								onChange={handleSearchInputChange}
								onFocus={handleSearchInputFocus}
								placeholder="Поиск товаров..."
							/>
							<i className={`fa-solid fa-magnifying-glass mobile-search-icon ${variant}`}></i>
							<nav className={`mobile-nav-tabs ${variant}`}>
								<Link to="/#about" onClick={(e) => {
									e.preventDefault();
									handleAnchorNavigation('about');
								}}>О НАС</Link>
								<Link to="/#new" onClick={(e) => {
									e.preventDefault();
									handleAnchorNavigation('new');
								}}>НОВИНКИ</Link>
								<Link to="/review">ОТЗЫВЫ</Link>
								<Link to="/works">ПОРТФОЛИО</Link>
							</nav>
						</div>
						{/* <li> */}
						<span 
							className="Katalog-btn"  
							onTouchCancel={() => {setSub(false)}} 
							onMouseEnter={handleCatalogMouseEnter} 
							onMouseLeave={handleCatalogMouseLeave}
							onClick={handleCatalogClick}
						>
							КАТАЛОГ
						</span>
						{/* </li> */}
						{/* <li> */}
							<Link to="/#about" className="nav-link desktop-nav-link" onClick={(e) => {
								e.preventDefault();
								handleAnchorNavigation('about');
							}}>
								О НАС
							</Link>
						{/* </li> */}
						{/* <li> */}
						<Link to="/#contacts" className="nav-link desktop-nav-link" onClick={(e) => {
							e.preventDefault();
							window.scrollTo({
								top: document.documentElement.scrollHeight,
								behavior: "smooth",
							});
						}}>
							КОНТАКТЫ
						</Link>
						{/* </li> */}
						{/* <li> */}
							<Link to="/#new" className="nav-link desktop-nav-link" onClick={(e) => {
								e.preventDefault();
								handleAnchorNavigation('new');
							}}>
								НОВИНКИ
							</Link>
						{/* </li> */}
						{/* <li> */}
						<Link to="/review" className="nav-link desktop-nav-link">
							ОТЗЫВЫ
						</Link>
						<Link to="/works" className="nav-link desktop-nav-link works-link">
								НАШИ РАБОТЫ
						</Link>
						
						{/* </li> */}
						{/* <li> */}

						{/* </li> */}

						<li className="icons-container">
							<div className="phone-container">
								<a href="tel:+79999999999" id="phone">
									<i className="fa-solid fa-phone"></i>
								</a>
								<span
									className="phone-tooltip"
									role="button"
									aria-label="Скопировать номер телефона"
									onClick={async () => {
										try {
											await navigator.clipboard.writeText("+79999999999");
											setIsPhoneCopied(true);
											setTimeout(() => setIsPhoneCopied(false), 1500);
										} catch {}
									}}
									title={isPhoneCopied ? "Скопировано" : "Нажмите, чтобы скопировать"}
								>
									+7 (964) 777-25-25
								</span>
							</div>
						</li>
					</ul>

					{sub && (
						<div 
							className="nav-secondary active"
							onMouseEnter={handleCatalogMouseEnter}
							onMouseLeave={handleCatalogMouseLeave}
						>
							<ul className="container_2">
								{menuItems.map((item) => (
									<li key={item.key}>
										<Link 
											to={item.content.props.to} 
											className="nav-link"
											onClick={closeCatalog}
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}

					{mobileMenuOpen && (
						<div 
							className="mobile-menu-overlay"
							onClick={closeMobileMenu}
						>
							<div 
								className="mobile-menu-content"
								onClick={(e) => e.stopPropagation()}
							>
								<button
									className="close-menu-btn"
									onClick={closeMobileMenu}
									aria-label="Закрыть меню"
								>
									<i className="fa-solid fa-xmark"></i>
								</button>
								
								<nav className="mobile-menu-nav">
									{menuItems.map((item) => (
										<Link 
											key={item.key}
											to={item.content.props.to} 
											className="mobile-menu-link"
											onClick={closeMobileMenu}
										>
											{item.label}
										</Link>
									))}
								</nav>
							</div>
						</div>
					)}
				</nav>
			</div>
			
			<SearchDropdown 
				isOpen={isSearchDropdownOpen}
				onClose={handleSearchDropdownClose}
				searchQuery={searchQuery}
			/>
		</header>
	);
});

export default Header;
