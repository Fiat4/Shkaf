import { useState } from "react"
import {CategoriesKeysLowerCase} from "../Types/ProductCategoriesEnum";
import IConsultationFormData from "../Types/Consultation";
import { IOrganizationReviewForm, IProductReviewForm } from "../Types/Reviews";

interface RequestOptions extends RequestInit {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
}

interface ErrorData {
    statusCode: number
    message: string
    error: string
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

const useApi = <T=any>() => {
    const [data, setData] = useState<T>()
    const [error, setError] = useState<ApiError | null>()
    const [loading, setLoading] = useState<boolean>(false)

    const fetchData = async (url: string, options: RequestOptions ) => {
        setError(null)
        setLoading(true)

        try {
            const {method = 'GET', headers = {}, ...rest} = options
                const response = await fetch(url, {
                method,
                headers: {
                    ...headers
                },
                ...rest,
                body: options?.body && ['POST', 'PUT', 'PATCH'].includes(method) ? options.body : undefined
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new ApiError(
                    errData.message || `HTTP Error ${response.status}`,
                    response.status,
                    errData
                )
            }
            
            const data = await response.json()
            setData(data)
        } catch (error) {
            console.log(error)
            setError(error as ApiError)
        } finally {
            setLoading(false)
        }
    }

    const removeReview = async (id: string) => await fetchData(`http://localhost:3000/reviews/${id}`, {method: 'DELETE'})
    const getReviewsByType = async (param: 'product' | 'organization') => await fetchData(`http://localhost:3000/reviews/${param}`, {method: 'GET'})
    const getAllProducts = async () => await fetchData('http://localhost:3000/product', {method: 'GET'})
    const getProductsByCategory = async (category: string) => await fetchData(`http://localhost:3000/product?category=${category}`, {method: 'GET'})
    const createProduct = async (product: any) => await fetchData('http://localhost:3000/product', {method: 'POST', body: product})
    const deleteProudctById = async (id: string) => await fetchData(`http://localhost:3000/product/${id}`, {method: 'DELETE'})
    const updateProduct = async (id: string, body: any) => await fetchData(`http://localhost:3000/product/${id}`, {method: 'PATCH', body})
    const createOrder = async (orderData: string) => await fetchData('http://localhost:3000/order', {method: 'POST', body: orderData, headers: {'Content-Type': 'application/json'}})
    const createProductReview = async (reviewData: FormData) => await fetchData('http://localhost:3000/reviews/product', {method: 'POST', body: reviewData})
    

    const createOrgReview = async (reviewData: IOrganizationReviewForm) => {
        const jsonData = JSON.stringify(reviewData)
        return await fetchData('http://localhost:3000/reviews/organization', {method: 'POST', body: jsonData, headers: {'Content-Type': 'application/json'}})
    }
    const getCategoryPageContent = async (category: CategoriesKeysLowerCase, page: number = 1, popularitySortOrder?: 'desc' | 'asc' | null, searchWord?:string, limit:number = 6) => {
        const urlParams = new URLSearchParams();
        urlParams.append('category', category)
        urlParams.append('limit', limit.toString())
        urlParams.append('page', page.toString())
        if (popularitySortOrder) {
            urlParams.append('sortBy','popularityScore')
            urlParams.append('order', popularitySortOrder)
        }

        if (searchWord) {
            urlParams.append('search', searchWord)
        }

        return await fetchData(`http://localhost:3000/product?${urlParams.toString()}`, {method: 'GET'})
    }

    const getPopularProducts = async (popularitySortOrder: 'desc' | 'asc') => {
        const urlParams = new URLSearchParams();
        if (popularitySortOrder) {
            urlParams.append('sortBy','popularityScore')
            urlParams.append('order', popularitySortOrder)
            urlParams.append('limit', '40')
        }

        return await fetchData(`http://localhost:3000/product?${urlParams.toString()}`, {method: 'GET'})
    }

    const getRecentProducts = async (sortOrder: 'desc' | 'asc', limit = 40) => {
        const urlParams = new URLSearchParams();
        if (sortOrder) {
            urlParams.append('sortBy','created_at')
            urlParams.append('order', sortOrder)
            urlParams.append('limit', `${limit}`)
        }

        return await fetchData(`http://localhost:3000/product?${urlParams.toString()}`, {method: 'GET'})
    }

    const getOrders = async (type: 'consultation' | 'order', status: 'active' | 'completed' | 'canceled') => {
        const urlParams = new URLSearchParams();
        urlParams.append('type',type)
        urlParams.append('status',status)

        return await fetchData(`http://localhost:3000/order?${urlParams.toString()}`, {method: 'GET'})
    }

    const getReviews = async (page: number = 1, type?: 'organization' | 'product', sortEntity?: 'username' | 'rating' | 'created_at', sortOrder?: 'desc' | 'asc' | null, searchWord?:string, limit:number = 3) => {
        const urlParams = new URLSearchParams();
        urlParams.append('limit', limit.toString())
        urlParams.append('page', page.toString())
        if (sortOrder) {
            urlParams.append('order', sortOrder)
        }

        if (sortEntity) {
            urlParams.append('sortBy', sortEntity)
        }

        if (searchWord) {
            urlParams.append('search', searchWord)
        }

        if(type) {
            urlParams.append('type', type)
        }

        return await fetchData(`http://localhost:3000/reviews?${urlParams.toString()}`, {method: 'GET'})
    }

    const changeOrderStatus = async (id: string, status: 'active' | 'canceled' | 'completed') => await fetchData(`http://localhost:3000/order/${id}`, {method: 'PUT', body: JSON.stringify({status}), headers: {'Content-Type': 'application/json'}})
    const getProductsById = async (id: string) => await fetchData(`http://localhost:3000/product/${id}`, {method: 'GET'})
    const getProductReview = async (id: string) => await fetchData(`http://localhost:3000/reviews/product/${id}`, {method: 'GET'})
    return {
        data,
        error,
        loading,
        getReviews,
        getAllProducts,
        getProductsByCategory,
        createProduct,
        createOrder,
        deleteProudctById,
        updateProduct,
        getCategoryPageContent,
        createOrgReview,
        getReviewsByType,
        removeReview,
        getPopularProducts,
        getRecentProducts,
        getOrders,
        changeOrderStatus,
        getProductsById,
        createProductReview,
        getProductReview
    }
    
}

export default useApi