import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import MainPage from "./pages/MainPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProductPage from "./pages/ProductPage";
import WorksPage from "./pages/WorksPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import Error404Page from "./pages/Error404Page";
import AdminMain from "./Components/AdminMain/AdminMain";
import AdminProducts from "./Components/AdminProducts/AdminProducts";
import AdminPopularProducts from "./Components/AdminPopularProducts/AdminPopularProducts";
import AdminNew from "./Components/AdminNew/AdminNew";
import AdminReviews from "./Components/AdminReviews/AdminReviews";
import AdminRequests from "./Components/AdminRequests/AdminRequests";
import AdminUser from "./Components/AdminUser/AdminUser";
import LoadingPage from "./pages/LoadingPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";


function App() {
	return (
		<Routes>
			<Route path="" element={<MainPage/>}/>
			<Route path="cart" element={<CartPage/>}/>
			<Route path="category/:category" element={<CategoryPage/>}/> 
			<Route path="product/:id" element={<ProductPage/>}/>
			<Route path="review" element={<ReviewsPage/>}/>
			<Route path="works" element={<WorksPage/>}/>
			<Route path="privacy-policy" element={<PrivacyPolicy/>}/>
			<Route path="admin/login" element={<AdminLoginPage/>}/>
			<Route path="loading" element={<LoadingPage/>}/>
			<Route path="404" element={<Error404Page/>}/>
			<Route path="admin" element={
				<ProtectedRoute>
					<AdminPage/>
				</ProtectedRoute>
			}>
				<Route index element={<AdminMain/>}/>
				<Route path="prods" element={<AdminProducts/>}/>
				<Route path="pops" element={<AdminPopularProducts/>}/>
				<Route path="new" element={<AdminNew/>}/>
				<Route path="reviews" element={<AdminReviews/>}/>
				<Route path="requests" element={<AdminRequests/>}/>
				<Route path="user" element={<AdminUser/>}/>
			</Route>
			<Route path="*" element={<Navigate to="/" replace/>}/>
		</Routes>
	)
}


export default App;
