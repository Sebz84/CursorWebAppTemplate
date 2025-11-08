'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { sendNotification, subscribeUser, unsubscribeUser, type PushSubscriptionPayload } from '../../actions'

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

const INITIAL_MESSAGE = 'Hello from Cursor SaaS!'

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = typeof window === 'undefined' ? '' : window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

const isIosDevice = () => {
  if (typeof window === 'undefined') return false
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

const isStandalone = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
}

export const NotificationsCard = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [supported, setSupported] = useState<boolean>(true)
  const [permission, setPermission] = useState<NotificationPermission>(typeof window === 'undefined' ? 'default' : Notification.permission)
  const [message, setMessage] = useState<string>(INITIAL_MESSAGE)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const shouldShowInstallPrompt = useMemo(() => isIosDevice() && !isStandalone(), [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const featureSupport = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    setSupported(featureSupport)

    if (!featureSupport) {
      return
    }

    const register = async () => {
      try {
        const swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        setRegistration(swRegistration)

        const existingSubscription = await swRegistration.pushManager.getSubscription()
        if (existingSubscription) {
          setSubscription(existingSubscription)
          const payload = existingSubscription.toJSON() as PushSubscriptionPayload
          await subscribeUser(payload)
        }
      } catch (err) {
        console.error('Failed to register service worker', err)
        setError('Unable to register the service worker for push notifications.')
      }
    }

    register()
  }, [])

  const ensurePermission = useCallback(async () => {
    if (permission === 'granted') {
      return 'granted'
    }
    if (typeof Notification === 'undefined') {
      return 'denied'
    }
    const requestResult = await Notification.requestPermission()
    setPermission(requestResult)
    return requestResult
  }, [permission])

  const handleSubscribe = useCallback(async () => {
    if (!registration) {
      setError('Service worker is not ready yet.')
      return
    }

    if (!publicVapidKey) {
      setError('The public VAPID key is missing. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your environment variables.')
      return
    }

    setBusy(true)
    setError(null)
    setStatus(null)

    try {
      const permissionState = await ensurePermission()
      if (permissionState !== 'granted') {
        setError('Notifications were blocked. Allow notifications to subscribe.')
        return
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })

      const payload = newSubscription.toJSON() as PushSubscriptionPayload
      const result = await subscribeUser(payload)

      if (!result.success) {
        throw new Error(result.error ?? 'Subscription failed')
      }

      setSubscription(newSubscription)
      setStatus('Push notifications enabled.')
    } catch (err) {
      console.error('Error subscribing to push notifications', err)
      setError('Failed to enable push notifications. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [ensurePermission, registration])

  const handleUnsubscribe = useCallback(async () => {
    if (!registration) {
      setError('Service worker is not ready yet.')
      return
    }

    setBusy(true)
    setError(null)
    setStatus(null)

    try {
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        await existingSubscription.unsubscribe()
      }

      await unsubscribeUser()
      setSubscription(null)
      setStatus('Push notifications disabled.')
    } catch (err) {
      console.error('Error unsubscribing from push notifications', err)
      setError('Failed to disable push notifications. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [registration])

  const handleSendNotification = useCallback(async () => {
    if (!message.trim()) {
      setError('Enter a message before sending a notification.')
      return
    }

    setBusy(true)
    setError(null)
    setStatus(null)

    try {
      const result = await sendNotification(message.trim())
      if (!result.success) {
        throw new Error(result.error ?? 'Notification failed')
      }
      setStatus('Notification sent. Check your device!')
    } catch (err) {
      console.error('Error sending push notification', err)
      setError('Failed to send the notification. Ensure you are subscribed and try again.')
    } finally {
      setBusy(false)
    }
  }, [message])

  if (!supported) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200">
        Push notifications are not supported in this browser.
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold">Progressive Web App</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Enable push notifications and install the app for a native-like experience.
        </p>
      </header>

      {shouldShowInstallPrompt ? <InstallPrompt /> : null}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3">
          {subscription ? (
            <button
              type="button"
              onClick={handleUnsubscribe}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
              disabled={busy}
            >
              Disable notifications
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubscribe}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
            >
              Enable notifications
            </button>
          )}

          <button
            type="button"
            onClick={handleSendNotification}
            className="rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary/60 dark:text-primary"
            disabled={!subscription || busy}
          >
            Send test notification
          </button>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Notification message
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            rows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Let's stay productive today!"
            disabled={busy}
          />
        </label>
      </div>

      {status ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">{status}</p> : null}
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">{error}</p> : null}
    </div>
  )
}

const InstallPrompt = () => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200">
    <p className="font-medium">Install on iOS</p>
    <ol className="mt-1 list-decimal space-y-1 pl-5">
      <li>Tap the share icon in Safari.</li>
      <li>Select <span className="font-semibold">“Add to Home Screen”</span>.</li>
      <li>Confirm to install the app on your home screen.</li>
    </ol>
  </div>
)

