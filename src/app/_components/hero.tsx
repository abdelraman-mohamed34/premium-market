import React from 'react'

function Hero() {
    return (
        <div className='w-full h-[75vh] overflow-hidden bg-white sticky top-0 -z-1'>

            {/* Background with Three People - using absolute positioning for exact overlay */}
            <img
                src="/path/to/your/image.jpg" // Replace with actual image path
                alt="Hero Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Semi-transparent blue overlay */}
            <div className="absolute inset-0 bg-blue-900 opacity-60"></div>

            {/* Content Container (Centering logic) */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-4">

                {/* Main Text Content */}
                <div className="max-w-4xl">

                    <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-tight">
                        Summer Sales
                    </h1>

                    <h2 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tight mt-2">
                        Up to
                        <span className='text-primary font-bold mx-3'>
                            30%
                        </span>
                        Off
                    </h2>

                    {/* Subtext (smaller, less prominent, from the image's small text) */}
                    <p className="text-white/80 text-sm md:text-lg mt-6 px-12 leading-relaxed">
                        The collection you've been waiting for. Discover timeless styles with the quality you deserve, now at limited-time prices.
                    </p>

                    {/* Action Button (Blue background, white text, centered) */}
                    <div className="mt-10">
                        <a href="/shop" className="inline-block bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-md uppercase text-sm tracking-wide transition-colors">
                            Shop Now
                        </a>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Hero