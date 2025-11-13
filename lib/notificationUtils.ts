import { supabase } from './supabaseClient';

// IMPORTANTE: Esta chave pública VAPID deve ser gerada e armazenada de forma segura como uma variável de ambiente.
// Use o comando `npx web-push generate-vapid-keys` no seu terminal para gerar um par de chaves.
// A chave privada correspondente será usada no seu backend para enviar as notificações.
const VAPID_PUBLIC_KEY = 'BIV-tZ5P_j_gIzC-pzgxZA-ak_6nL_sPSF6jhpS6vDsoDAe2MW_F9p8b8g0L6q-s6aHk8TRImCHpB-0DnxtUn48';

/**
 * Converte uma string base64 (URL-safe) para um Uint8Array, necessário para a API de push.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Salva a inscrição de push no banco de dados Supabase, associada ao usuário atual.
 * É necessário criar uma tabela `push_subscriptions` no Supabase com as colunas:
 * - user_id (uuid, primary key, foreign key para auth.users.id)
 * - subscription_object (jsonb)
 * - created_at (timestampz, default now())
 */
async function saveSubscription(subscription: PushSubscription) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        console.error("Usuário não autenticado. Não é possível salvar a inscrição.");
        return;
    }

    const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: session.user.id,
        subscription_object: subscription,
    }, { onConflict: 'user_id' });

    if (error) {
        console.error('Erro ao salvar a inscrição no Supabase:', "Message:", error.message, "Details:", error.details, "Code:", error.code);
    } else {
        console.log('Inscrição salva com sucesso no Supabase.');
    }
}

/**
 * Pede permissão ao usuário para notificações e, se concedida, o inscreve no serviço de push.
 */
export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Mensagens push não são suportadas neste navegador.');
    throw new Error('Push não suportado');
  }
  
  const registration = await navigator.serviceWorker.ready;
  if (!registration) {
    console.error("Service worker não está pronto.");
    throw new Error('Service worker não disponível');
  }
  
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permissão para notificações não concedida.');
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('Inscrição Push recebida:', subscription);
    await saveSubscription(subscription);

  } catch (error) {
    console.error('Falha ao inscrever o usuário:', error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Cancela a inscrição de notificações push do usuário.
 */
export async function unsubscribeUserFromPush() {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        await subscription.unsubscribe();
        // Em um app real, você também faria uma chamada para remover a inscrição do seu backend (Supabase)
        // para evitar enviar notificações para endpoints inválidos.
        console.log('Inscrição removida.');
    }
}

/**
 * Obtém o estado atual da permissão de notificação e da inscrição.
 */
export async function getSubscriptionState(): Promise<{ permission: NotificationPermission, isSubscribed: boolean }> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return { permission: 'denied', isSubscribed: false };
    }
    
    const permission = Notification.permission;
    if (permission !== 'granted') {
        return { permission, isSubscribed: false };
    }
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    return { permission, isSubscribed: !!subscription };
}