'use server'

import webpush from 'web-push'

export type PushSubscriptionPayload = {
  endpoint: string
  expirationTime?: number | null
  keys?: {
    auth?: string
    p256dh?: string
  }
}

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY ?? ''
const vapidContact = process.env.VAPID_CONTACT_EMAIL ?? 'mailto:founder@example.com'

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidContact, vapidPublicKey, vapidPrivateKey)
}

let activeSubscription: webpush.PushSubscription | null = null

export async function subscribeUser(subscription: PushSubscriptionPayload) {
  if (!subscription?.endpoint) {
    return { success: false, error: 'Invalid subscription payload received.' }
  }

  activeSubscription = {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: {
      auth: subscription.keys?.auth ?? '',
      p256dh: subscription.keys?.p256dh ?? ''
    }
  }

  return { success: true }
}

export async function unsubscribeUser() {
  activeSubscription = null
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return { success: false, error: 'VAPID keys are not configured on the server.' }
  }

  if (!activeSubscription) {
    return { success: false, error: 'No active push subscription found.' }
  }

  try {
    await webpush.sendNotification(
      activeSubscription,
      JSON.stringify({
        title: 'Cursor SaaS Notification',
        body: message,
        icon: '/icons/icon-192.png'
      })
    )

    return { success: true }
  } catch (error) {
    console.error('Failed to send push notification', error)
    return { success: false, error: 'Failed to send push notification.' }
  }
}

