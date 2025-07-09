import React, {
	forwardRef,
	useEffect,
	useRef,
	useState,
	useImperativeHandle
} from "react";
import { Link } from "react-router-dom";

const Header = forwardRef<HTMLDivElement>((_, ref) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrolled, setScrolled] = useState<boolean>(false);
	const [sub, setSub] = useState<boolean>(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

	// Expose internal ref to parent via forwardRef
	useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

	const handleScroll = () => {
		setScrolled(window.scrollY > 50);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen((prev) => {
			const newState = !prev;
			document.body.classList.toggle("menu-open", newState);
			return newState;
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.body.classList.remove("menu-open");
		};
	}, []);

	return (
		<header className="header">
			<div
				className={`container ${scrolled ? "scrolled" : null}`}
				ref={containerRef}
			>
				<nav className="main-nav" aria-label="Основная навигация">
					<ul className="nav-primary container_2">
						<li>
							<Link to="/" className="nav-link" id="header_logo"/>
							<div className="mobile-icons-container">
								<Link to="cart" id="heart">
								<i className="fa-regular fa-heart"></i>
								</Link>
								<button 
								className={`header_menu ${mobileMenuOpen ? 'active' : ''}`}
								onClick={toggleMobileMenu}
								aria-label="Открыть меню"
							>
								<span></span>
								<span></span>
								<span></span>
							</button>
							</div>
							
							
						</li>
						<div className="mobile-phone">
							<span>+7 (999) 999-99-99</span>
						</div>
						<div className="search-container">
							<input type="text" id="search_mobile" placeholder="Поиск" />
							<nav className="mobile-nav-tabs">
								{/* <a href="#catalog">КАТАЛОГ</a> */}
								<a href="#about">О НАС</a>
								<a href="#sales">АКЦИИ</a>
								<a href="#new">НОВИНКИ</a>
								<a href="#reviews">ОТЗЫВЫ</a>
							</nav>
						</div>
						{/* <li> */}
							<Link to="asgai" className="nav-link desktop-nav-link" onMouseEnter={() => setSub(true)} onMouseLeave={() => setSub(false)}>
								КАТАЛОГ
							</Link>
						{/* </li> */}
						{/* <li> */}
							<Link to="asnflaskng" className="nav-link desktop-nav-link">
								О НАС
							</Link>
						{/* </li> */}
						{/* <li> */}
							<Link to="xyu" className="nav-link desktop-nav-link" onClick={(e) => {
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
							<Link to="asfas" className="nav-link desktop-nav-link">
								АКЦИИ
							</Link>
						{/* </li> */}
						{/* <li> */}
							<Link to="asfasf" className="nav-link desktop-nav-link">
								НОВИНКИ
							</Link>
						{/* </li> */}
						{/* <li> */}
							<Link to="review" className="nav-link desktop-nav-link">
								ОТЗЫВЫ
							</Link>
						{/* </li> */}

						<li className="icons-container">
							<Link to="cart" id="heart" className="desktop-heart">
								<i className="fa-regular fa-heart"></i>
							</Link>
							<div className="phone-container">
								<a href="tel:+79999999999" id="phone">
									<i className="fa-solid fa-phone"></i>
								</a>
								<span className="phone-tooltip">+7 (999) 999-99-99</span>
							</div>
						</li>
					</ul>

					<ul
						id="con_2"
						onMouseEnter={() => setSub(true)}
						onMouseLeave={() => setSub(false)}
						className={`nav-secondary container_2 ${sub ? "active" : ""} ${mobileMenuOpen ? "mobile-active" : ""}`}
						aria-label="Подкатегории"
					>
						
						<li className="menu-button-holder">
							<Link to="/category/closets" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Шкафы
							</Link>
							<button 
								className={`header_menu ${mobileMenuOpen ? 'active' : ''}`}
								onClick={toggleMobileMenu}
								aria-label="Открыть меню"
							>
								<i className="fa-solid fa-xmark"></i>
							</button>
						</li>
						<li>
							<Link to="/category/kitchens" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Кухни
							</Link>
						</li>
						<li>
							<Link to="/category/walls" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Стенки
							</Link>
						</li>
						<li>
							<Link to="/category/wardrobes" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Прихожие
							</Link>
						</li>
						<li>
							<Link to="/category/bedrooms" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Спальни
							</Link>
						</li>
						<li>
							<Link to="/category/kidRooms" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
								Детские
							</Link>
						</li>
						<li>
							<input type="text" placeholder="Поиск" className="search-input" />
						</li>
						<li>
							<i className="search-icon"></i>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
});

export default Header;
