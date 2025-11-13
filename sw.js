// sw.js

// Evento 'push' é acionado quando uma notificação é recebida do servidor.
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event mas sem dados.');
    return;
  }
  const data = event.data.json();
  const title = data.title || 'PURPOSE MATCH';
  const options = {
    body: data.body,
    icon: '/icon-192.png', // Caminho para um ícone
    badge: '/icon-192.png', // Ícone para a barra de notificações (Android)
    data: {
      url: data.url || '/', // URL para abrir ao clicar
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Evento 'notificationclick' é acionado quando o usuário clica na notificação.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Verifica se a janela do app já está aberta
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não estiver aberta, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Eventos básicos do ciclo de vida do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
  self.skipWaiting(); // Força o novo service worker a se tornar ativo
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado');
  // Limpa caches antigos, se necessário
  return self.clients.claim();
});