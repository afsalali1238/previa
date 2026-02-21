/**
 * Register service worker for PWA functionality
 */
export function registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('[SW] Registered with scope:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000); // Every hour

            } catch (error) {
                console.error('[SW] Registration failed:', error);
            }
        });
    }
}

/**
 * Unregister service worker (for development)
 */
export async function unregisterServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.unregister();
    }
}
