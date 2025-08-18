"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"
import { getFullImageUrl } from "@/lib/utils"
import { getBooks } from "@/lib/api"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import type { BookData } from "@/types/index"
import { motion } from "framer-motion"

// Swiper stillarini import qilamiz
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Shadcn/ui komponentlarini import qilamiz
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MagnetButton from "./Magnet"

interface SwipperProps {
  initialBooks?: BookData[]
}

// Swiper uchun skeleton komponenti
const SwiperCardSkeleton = () => (
  <Card className="group hover:shadow-xl transition-all duration-300 border border-[#21466D]/10 rounded-2xl h-full flex flex-col justify-between animate-pulse overflow-hidden">
    <CardContent className="p-5 flex-grow flex flex-col max-sm:p-4 max-xs:p-3">
      <div className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl"></div>
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-5 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="p-5 pt-0 max-sm:p-4 max-xs:p-3">
      <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
    </CardFooter>
  </Card>
)

// Title skeleton component
const TitleSkeleton = () => (
  <div className="container mx-auto px-4 py-8 text-start max-w-[1800px]">
    <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-72 animate-pulse max-sm:h-12 max-sm:w-56 max-xs:h-10 max-xs:w-48"></div>
  </div>
)

export default function Swipper({ initialBooks }: SwipperProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1023px)")
  const [books, setBooks] = useState<BookData[]>(initialBooks || [])
  const [loading, setLoading] = useState(!initialBooks)

  useEffect(() => {
    const fetchData = async () => {
      if (initialBooks && initialBooks.length > 0) {
        setBooks(initialBooks)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const booksResponse = (await getBooks()) as any
        const parsedBooks: BookData[] = Array.isArray(booksResponse.data) 
          ? booksResponse.data 
          : [booksResponse.data]
        setBooks(parsedBooks)
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [initialBooks, t])

  const filteredBooks: BookData[] = books.filter((book) => {
    const createdAt = new Date(book.Book.createdAt)
    const fiveMonthsAgo = new Date()
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)
    return createdAt > fiveMonthsAgo
  })

  // Kitoblar sonini loop uchun ko'paytiramiz
  const duplicatedBooks = filteredBooks.length > 0 
    ? [...filteredBooks]
    : []

  const handleCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }

  const isTokenyes = (callback: () => void) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.warning(t("common.loginRequired"))
      router.push("/login")
    } else {
      callback()
    }
  }

  const getSkeletonCount = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 4
  }

  return (
    <div className="w-full mx-auto px-4 py-4 max-w-[1920px]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full mx-auto max-w-[1800px]"
      >
        {/* Title with loading state */}
        {loading ? (
          <TitleSkeleton />
        ) : (
          <div className="container mx-auto px-4 py-8 text-start max-w-[1800px]">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-[#21466D] to-[#4A90E2] bg-clip-text text-transparent max-lg:text-3xl max-md:text-2xl max-sm:text-xl max-xs:text-lg"
            >
              {t("common.newBooks")}
            </motion.h1>
          </div>
        )}

        <div className="relative px-4">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[Autoplay, Pagination]}
            loop={duplicatedBooks.length > 0}
            className="book-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              480: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 1.8,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.8,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.8,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3.8,
                spaceBetween: 24,
              },
              1536: {
                slidesPerView: 3.8,
                spaceBetween: 28,
              }
            }}
          >
            {loading
              ? Array.from({ length: getSkeletonCount() }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`}>
                    <SwiperCardSkeleton />
                  </SwiperSlide>
                ))
              : duplicatedBooks.map((book, index) => {
                  const isNew = true
                  return (
                    <SwiperSlide key={`${book.Book.id}-${index}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: index * 0.1 }}
                        className="h-[80%]"
                      >
                        <Card
                          onClick={() => isTokenyes(() => handleCardClick(book.Book.id))}
                          className="group transition-all duration-500 border border-[#21466D]/10 rounded-2xl cursor-pointer hover:border-[#21466D]/30 h-full flex flex-col justify-between hover:scale-[1.03] transform bg-white/80 backdrop-blur-sm hover:bg-white overflow-hidden"
                        >
                          <CardContent className="p-5 flex-grow flex flex-col max-sm:p-4 max-xs:p-3">
                            <div className="relative mb-2 overflow-hidden rounded-xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:shadow-lg">
                              <div className="aspect-[3.2/4] w-full relative">
                                <Image
                                  src={
                                    getFullImageUrl(book.Book.image?.url) ||
                                    "/placeholder.svg?height=400&width=300&query=book cover"
                                  }
                                  alt={book.Book.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                  sizes="(max-width: 480px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              {isNew && (
                                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-[#ffc82a] to-[#ffb700] text-[#21466D] text-xs font-bold shadow-lg border-0 px-3 py-1 z-10">
                                  {t("common.new")}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-between px-1 pt-2">
                              <div>
                                <h3
                                  title={book.Book.name}
                                  className="font-bold text-lg mb-1 group-hover:text-[#21466D] transition-colors line-clamp-2 text-gray-800 leading-tight max-sm:text-base max-xs:text-sm"
                                >
                                  {book.Book.name
                                    .split(/[:\s]+/)
                                    .slice(0, 4)
                                    .join(" ")}
                                  {book.Book.name.split(/[:\s]+/).length > 4 ? "..." : ""}
                                </h3>
                                
                                <div className="space-y-1 text-sm text-gray-600 mb-4 max-xs:text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#21466D] rounded-full"></div>
                                    <span className="font-medium">{book.Book.page} {t("common.page")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#21466D] rounded-full"></div>
                                    <span className="font-medium">{book.Book.year}-{t("common.year")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#ffc82a] rounded-full"></div>
                                    <span className="text-[#21466D] font-semibold">
                                      {t("common.author")}: {book.Book.Auther?.name || t("common.unknown")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="p-5 -pt-5 -mt-8 max-sm:p-4 max-xs:p-3">
                            <MagnetButton className="w-full">
                              <Button
                                className="w-full bg-gradient-to-r from-[#21466D] to-[#4A90E2] text-white hover:from-white hover:to-white font-bold border-0 hover:border-2 hover:border-[#21466D] hover:text-[#21466D] flex items-center justify-center gap-2 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl max-sm:text-sm max-xs:text-xs max-xs:py-2 h-12 max-xs:h-10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  isTokenyes(() => handleCardClick(book.Book.id))
                                }}
                              >
                                <Info className="h-4 w-4 max-xs:h-3 max-xs:w-3 transition-transform group-hover:rotate-12" /> 
                                {t("common.details")}
                              </Button>
                            </MagnetButton>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </SwiperSlide>
                  )
                })}
          </Swiper>
        </div>
      </motion.div>

      <style jsx global>{`
        .book-swiper {
          padding: 25px 0 50px 0 !important;
          overflow-x: hidden;
        }

        .book-swiper .swiper-pagination {
          bottom: 15px !important;
          text-align: center;
        }

        .book-swiper .swiper-pagination-bullet {
          background: linear-gradient(135deg, #21466D, #4A90E2);
          opacity: 0.4;
          width: 10px;
          height: 10px;
          margin: 0 6px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .book-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
          box-shadow: 0 4px 12px rgba(33, 70, 109, 0.4);
        }

        .book-swiper .swiper-slide {
          height: auto;
          display: flex;
        }

        .book-swiper .swiper-slide > div {
          width: 100%;
          height: 100%;
        }

        /* Smooth scrolling */
        .book-swiper .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .book-swiper {
            padding: 20px 0 45px 0 !important;
          }
          
          .book-swiper .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px;
          }
        }

        @media (max-width: 640px) {
          .book-swiper {
            padding: 18px 0 40px 0 !important;
          }
          
          .book-swiper .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
            margin: 0 3px;
          }
        }

        @media (max-width: 480px) {
          .book-swiper {
            padding: 15px 0 35px 0 !important;
          }
          
          .book-swiper .swiper-pagination {
            bottom: 12px !important;
          }
        }

        @media (max-width: 320px) {
          .book-swiper {
            padding: 12px 0 30px 0 !important;
          }
        }
      `}</style>
    </div>
  )
}