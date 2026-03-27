import { createClient } from '@/lib/supabase/client'

/**
 * Create a notification in the notif_v2 table
 * @param {string} userId - Target user ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} relatedId - ID of related record (titip_v2, pesanan_v2, etc.)
 */
export const createNotification = async (userId, title, message, relatedId = null) => {
    const supabase = createClient()
    try {
        const { error } = await supabase
            .from('notif_v2')
            .insert({
                user_id: userId,
                title: title,
                message: message,
                related_id: relatedId
            })
        if (error) throw error
    } catch (error) {
        console.error('Error creating notification:', error)
    }
}
