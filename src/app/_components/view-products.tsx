import ProductsRows from '@/features/_components/products-rows'
import React from 'react'
import ComboGrid from './view-compo'
import { Product } from '@/features/_components/reusable/product-card'

export const Products: Product[] = [
    {
        id: 1,
        title: "Essential Green Hoodie",
        price: "EGP 850.00",
        discount: "30% OFF",
        image: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#2d3a29", "#808080"],
        tags: ["Hoodies", "Best Seller", "Winter"],
        rating: 4.8,
        reviewsCount: 24,
        reviews: [
            { id: 1, author: "Ahmed M.", rating: 5, comment: "الخامة ممتازة جداً والتقفيل يعيش!", date: "2026-02-15" },
            { id: 2, author: "Omar S.", rating: 4.5, comment: "مريح ومقاسه مضبوط بالظبط.", date: "2026-02-10" }
        ]
    },
    {
        id: 2,
        title: "Signature Grey Oversized Hoodie",
        price: "EGP 920.00",
        originalPrice: "EGP 1,200.00",
        discount: "20% OFF",
        image: [
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#d3d3d3", "#000000", "#be5a38"],
        tags: ["Oversized", "Hoodies", "New Arrival"],
        rating: 4.9,
        reviewsCount: 18,
        reviews: [
            { id: 1, author: "Youssef K.", rating: 5, comment: "الاستايل الاوفرسايز طالع تحفة في اللبس.", date: "2026-02-18" }
        ]
    },
    {
        id: 3,
        title: "Graphic Print Vintage Tee",
        price: "EGP 450.00",
        image: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#ffffff", "#000000"],
        tags: ["T-Shirts", "Vintage", "Summer"],
        rating: 4.2,
        reviewsCount: 9,
        reviews: [
            { id: 1, author: "Khaled R.", rating: 4, comment: "الطباعة جودتها عالية جداً ومش بتأثر بالغسيل.", date: "2026-01-28" }
        ]
    },
    {
        id: 4,
        title: "Minimalist Black Heavyweight Tee",
        price: "EGP 500.00",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
        colors: ["#000000"],
        tags: ["Basic", "T-Shirts", "Heavyweight"],
        rating: 4.6,
        reviewsCount: 15,
        reviews: [
            { id: 1, author: "Hassan T.", rating: 5, comment: "خامة تقيلة ومحترمة جداً تيشيرت أساسي لازم يكون عند أي حد.", date: "2026-02-01" }
        ]
    },
    {
        id: 5,
        title: "Urban Denim Trucker Jacket",
        price: "EGP 1,450.00",
        originalPrice: "EGP 1,800.00",
        discount: "15% OFF",
        image: [
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#1e3a8a", "#475569"],
        tags: ["Jackets", "Denim", "Outerwear"],
        rating: 4.7,
        reviewsCount: 31,
        reviews: [
            { id: 1, author: "Mostafa N.", rating: 5, comment: "جاكيت جينز قيم جداً واللون زي الصورة تماماً.", date: "2026-02-12" }
        ]
    },
    {
        id: 6,
        title: "Classic Beige Trench Coat",
        price: "EGP 2,100.00",
        image: [
            "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#d4b996", "#000000"],
        tags: ["Coats", "Formal", "Winter"],
        rating: 4.9,
        reviewsCount: 12,
        reviews: [
            { id: 1, author: "Sara A.", rating: 5, comment: "شيك جداً في اللبس وشغل أنيق للغاية.", date: "2026-02-14" }
        ]
    },
    {
        id: 7,
        title: "Relaxed Fit Cargo Pants",
        price: "EGP 890.00",
        originalPrice: "EGP 1,100.00",
        discount: "18% OFF",
        image: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#3f6212", "#18181b", "#78350f"],
        tags: ["Pants", "Cargo", "Streetwear"],
        rating: 4.4,
        reviewsCount: 20,
        reviews: [
            { id: 1, author: "Kareem H.", rating: 4, comment: "البنطلون مريح وجيوبه عملية جداً.", date: "2026-02-05" }
        ]
    },
    {
        id: 8,
        title: "Streetwear Oversized Sweatshirt",
        price: "EGP 780.00",
        image: [
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#ea580c", "#0284c7"],
        tags: ["Sweatshirts", "Oversized", "Trending"],
        rating: 4.5,
        reviewsCount: 11,
        reviews: [
            { id: 1, author: "Ali F.", rating: 5, comment: "الوان ثابتة وخامة دافية جداً.", date: "2026-02-08" }
        ]
    },
    {
        id: 9,
        title: "Puffer Insulated Winter Jacket",
        price: "EGP 1,950.00",
        discount: "25% OFF",
        image: [
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#000000", "#dc2626"],
        tags: ["Jackets", "Puffer", "Winter Essential"],
        rating: 4.9,
        reviewsCount: 42,
        reviews: [
            { id: 1, author: "Tarek B.", rating: 5, comment: "بيدفي جداً في أصعب أوقات البرد وخفيف في الشيل.", date: "2026-01-20" }
        ]
    },
    {
        id: 10,
        title: "Striped Cotton Casual Shirt",
        price: "EGP 620.00",
        image: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#2563eb", "#059669"],
        tags: ["Shirts", "Casual", "Cotton"],
        rating: 4.3,
        reviewsCount: 7,
        reviews: [
            { id: 1, author: "Ibrahim N.", rating: 4, comment: "قميص قطن مريح للبس اليومي في الشغل.", date: "2026-02-11" }
        ]
    },
    {
        id: 11,
        title: "Tactical Techwear Utility Vest",
        price: "EGP 1,150.00",
        originalPrice: "EGP 1,400.00",
        discount: "17% OFF",
        image: [
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#18181b", "#3f3f46"],
        tags: ["Techwear", "Vests", "New Arrival"],
        rating: 4.6,
        reviewsCount: 14,
        reviews: [
            { id: 1, author: "Mahmoud E.", rating: 5, comment: "ديزاين مدروس وجيوب كتير ومظهر عصري.", date: "2026-02-16" }
        ]
    },
    {
        id: 12,
        title: "Monochrome Heavy Knit Sweater",
        price: "EGP 980.00",
        image: [
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
        ],
        colors: ["#f3f4f6", "#111827"],
        tags: ["Knitwear", "Sweaters", "Winter Essential"],
        rating: 4.7,
        reviewsCount: 19,
        reviews: [
            { id: 1, author: "Amr Z.", rating: 5, comment: "تريكو ناعم ومش بيعمل وبرة خالص.", date: "2026-02-17" }
        ]
    }
]

function ViewProducts() {
    return (
        <div className='bg-white'>
            <div className='w-full flex flex-col justify-center p-3 PT-5'>
                <ProductsRows data={Products} title="summer sales" />
            </div>
            <ComboGrid />
        </div>

    )
}

export default React.memo(ViewProducts)
