'use client'

import React from 'react'
import SendProductContent from '../../../_components/maker/SendProductContent'

export default function SendProductPage({ params }) {
    const { id } = React.use(params)

    // Dummy product lookup (matching CatalogContent dummy data)
    const dummyProducts = [
        { id: 1, name: "Gethuk Lindri", price: 15000, imageSrc: "/dummy/gethuk.jpeg" },
        { id: 2, name: "Bubur Sumsum", price: 10000, imageSrc: "/dummy/sumsum.jpeg" },
        { id: 3, name: "Martabak Terbul", price: 25000, imageSrc: "/dummy/terbul.jpeg" },
        { id: 4, name: "Keripik Pisang", price: 15000, imageSrc: null }
    ]

    const product = dummyProducts.find(p => p.id === parseInt(id)) || dummyProducts[0]

    return <SendProductContent product={product} />
}
