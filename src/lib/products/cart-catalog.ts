export interface CartCatalogProduct {
    id: number;
    title: string;
    price: number;
    image: string;
    colors: readonly string[];
}

export const cartCatalog: readonly CartCatalogProduct[] = [
    { id: 1, title: "Essential Green Hoodie", price: 850, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop", colors: ["#2d3a29", "#808080"] },
    { id: 2, title: "Signature Grey Oversized Hoodie", price: 920, image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop", colors: ["#d3d3d3", "#000000", "#be5a38"] },
    { id: 3, title: "Graphic Print Vintage Tee", price: 450, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop", colors: ["#ffffff", "#000000"] },
    { id: 4, title: "Minimalist Black Heavyweight Tee", price: 500, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop", colors: ["#000000"] },
    { id: 5, title: "Urban Denim Trucker Jacket", price: 1450, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop", colors: ["#1e3a8a", "#475569"] },
    { id: 6, title: "Classic Beige Trench Coat", price: 2100, image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop", colors: ["#d4b996", "#000000"] },
    { id: 7, title: "Relaxed Fit Cargo Pants", price: 890, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop", colors: ["#3f6212", "#18181b", "#78350f"] },
    { id: 8, title: "Streetwear Oversized Sweatshirt", price: 780, image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600&auto=format&fit=crop", colors: ["#ea580c", "#0284c7"] },
    { id: 9, title: "Puffer Insulated Winter Jacket", price: 1950, image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop", colors: ["#000000", "#dc2626"] },
    { id: 10, title: "Striped Cotton Casual Shirt", price: 620, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop", colors: ["#2563eb", "#059669"] },
    { id: 11, title: "Tactical Techwear Utility Vest", price: 1150, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop", colors: ["#18181b", "#3f3f46"] },
    { id: 12, title: "Monochrome Heavy Knit Sweater", price: 980, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop", colors: ["#f3f4f6", "#111827"] },
] as const;
