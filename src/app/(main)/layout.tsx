import React, { ReactNode } from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
type MainLayoutProps = {
    children: ReactNode
}
function MainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default MainLayout
