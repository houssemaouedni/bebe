// src/registerSW.js
import { registerSW } from 'virtual:pwa-register'

// Cette fonction enregistre le service worker et gère les mises à jour
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    console.log("yes");
    const updateSW = registerSW({
      onNeedRefresh() {
        // Afficher une notification à l'utilisateur qu'une mise à jour est disponible
        if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        // Informer l'utilisateur que l'application est prête à fonctionner hors ligne
        console.log('L\'application est prête à fonctionner hors ligne')
      },
    })
  }
}
