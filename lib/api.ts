// lib/api.ts
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/website`, 
  headers: {
    "Content-Type": "application/json",
  },
})

// POST: /login
export const login = async (passport_id: string, password: string) => {
  const res = await axiosInstance.post("/login", {
    passport_id,
    password,
  })
  return res.data
}

// GET: /authers
export const getAuthers = async () => {
  const res = await axiosInstance.get("/authers")
  return res
}

// GET: /categories
export const getCategories = async () => {
  const res = await axiosInstance.get("/categories")
  return res
}

// GET: /kafedras
export const getKafedras = async () => {
  const res = await axiosInstance.get("/kafedras")
  return res
}

// GET: /book-items
export const getBookItems = async () => {
  const res = await axiosInstance.get("/book-items")
  return res.data
}
export const getBooks = async (): Promise<BooksResponse> => {
  const res = await axiosInstance.get<BooksResponse>("/book-items")  
  return res.data
}



interface BooksResponse {
  data?: any[];
  books?: any[];
  success?: boolean;
  message?: string;
}

// GET: /books - Fixed return type
export const getAllBooks = async (): Promise<BooksResponse> => {
  const res = await axiosInstance.get("/books")
  return res.data as BooksResponse
}



// GET: /alluser-order
export const getUserOrders = async () => {
    const res = await axiosInstance.get(`/alluser-order`)
    console.log("orders",res)
    return res.data
}


// POST: /user-order
export const postUserOrder = async (book_id:number)=>{
  const userId = localStorage.getItem("id")
  const res = await axiosInstance.post("/user-order",{
    user_id:userId,
    book_id:book_id
  })
  return res.data
}