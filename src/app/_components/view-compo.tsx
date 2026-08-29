import ComboCard from '@/features/_components/reusable/combo-card'
import ProductCard, { Product } from '@/features/_components/reusable/product-card'
import React from 'react'

const comboItem = {
    id: 1,
    title: "Tops",
    subtitle: "Custom Free Edition",
    buttonText: "Shop Now",
    isMain: true,
    image: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    ]
}

const productsList: Product[] = [
    {
        id: 101,
        title: "Essential Green Hoodie",
        price: "EGP 850.00",
        discount: "30% OFF",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
        colors: ["#2d3a29", "#808080"]
    },
    {
        id: 102,
        title: "Signature Grey Oversized Hoodie",
        price: "EGP 920.00",
        originalPrice: "EGP 1,200.00",
        image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop",
        colors: ["#d3d3d3", "#000000"]
    },
    {
        id: 103,
        title: "Graphic Print Vintage Tee",
        price: "EGP 450.00",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
    },
    {
        id: 104,
        title: "Minimalist Black Heavyweight Tee",
        price: "EGP 500.00",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
    }
]

function ViewCombo() {
    return (
        <section className="w-full mx-auto pb-4">
            <div className="grid grid-cols-5 grid-rows-2 gap-2 min-h-[500px]">
                <div className="col-span-2 row-span-2">
                    <ComboCard item={comboItem} />
                </div>

                <div className="col-span-2 row-span-1">
                    <ProductCard
                        product={productsList[0]}
                        hideWishlist={true}
                        hideFooter={true}
                    />
                </div>

                <div className="col-span-1 row-span-2">
                    <ProductCard
                        product={productsList[1]}
                        hideWishlist={true}
                        hideFooter={true}
                    />
                </div>

                <div className="col-span-1 row-span-1">
                    <ProductCard
                        product={productsList[2]}
                        hideWishlist={true}
                        hideFooter={true}
                    />
                </div>

                <div className="col-span-1 row-span-1">
                    <ProductCard
                        product={productsList[3]}
                        hideWishlist={true}
                        hideFooter={true}
                        className="rounded-r-none"
                    />
                </div>
            </div>
        </section>
    )
}

export default ViewCombo