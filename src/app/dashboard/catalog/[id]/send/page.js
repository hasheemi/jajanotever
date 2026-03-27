import React from 'react'
import SendProductContent from '../../../_components/maker/SendProductContent'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SendProductPage({ params }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch product details
    const { data: product, error: productError } = await supabase
        .from('products_v2')
        .select('*')
        .eq('id', id)
        .single()

    if (productError || !product) {
        redirect('/dashboard/catalog')
    }

    // Fetch current user details for paguyuban filtering
    const { data: { user } } = await supabase.auth.getUser()
    const { data: currentUser } = await supabase
        .from('users_v2')
        .select('*')
        .eq('id', user?.id)
        .single()

    return <SendProductContent product={product} currentUser={currentUser} />
}
