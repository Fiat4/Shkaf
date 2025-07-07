import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import MainPage from "./pages/MainPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProductPage from "./pages/ProductPage";
import AdminPage from "./pages/AdminPage";
import AdminProducts from "./Components/AdminProducts/AdminProducts";
import AdminPopularProducts from "./Components/AdminPopularProducts/AdminPopularProducts";
import AdminNew from "./Components/AdminNew/AdminNew";
import AdminMain from "./Components/AdminMain/AdminMain";

function App() {
	return (
		<Routes>
			<Route path="" element={<MainPage/>}/>
			<Route path="cart" element={<CartPage/>}/>
			<Route path="category">
				 <Route path="kitchens" element={<CategoryPage product={"Кухни"}/>}/>
				 <Route path="bedrooms" element={<CategoryPage product={"Спальни"} />}/>
				 <Route path="kidRooms" element={<CategoryPage product={"Детские"} />}/>
				 <Route path="closets" element={<CategoryPage product={"Шкафы"} />}/>
				 <Route path="walls" element={<CategoryPage product={"Стенки"} />}/>
				 <Route path="wardrobes" element={<CategoryPage product={"Прихожие"} />}/>
			</Route>
			<Route path="product" element={<ProductPage/>}/>
			<Route path="review" element={<ReviewsPage/>}/>
			<Route path="admin" element={<AdminPage/>}>
				<Route index element={<AdminMain/>}/>
				<Route path="prods" element={<AdminProducts/>}/>
				<Route path="pops" element={<AdminPopularProducts/>}/>
				<Route path="new" element={<AdminNew/>}/>
			</Route>
			<Route path="*" element={<Navigate to="/" replace/>}/> 
		</Routes>
	)
}

export default App;
