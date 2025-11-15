import { kv } from '@vercel/kv';
import type { Order } from '../types';

// Funzione helper per ottenere la chiave del giorno corrente in formato UTC.
// Questo previene problemi legati al fuso orario del server.
const getTodayKey = () => {
  const today = new Date();
  // Formato: orders_YYYY-MM-DD
  return `orders_${today.toISOString().split('T')[0]}`;
};

// Handler principale della nostra API
export default async function handler(request: Request) {
  const KEY = getTodayKey();

  // Gestione richiesta GET per ottenere tutti gli ordini del giorno
  if (request.method === 'GET') {
    try {
      const orders = await kv.get<Order[]>(KEY);
      return new Response(JSON.stringify(orders || []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('KV GET Error:', error);
      return new Response(JSON.stringify({ message: 'Error fetching orders from KV' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Gestione richiesta POST per aggiungere un nuovo ordine
  if (request.method === 'POST') {
    try {
      const newOrder = await request.json() as Order;
      
      // Validazione base del corpo della richiesta
      if (!newOrder || !newOrder.name || !newOrder.classroom || !newOrder.coffeeType) {
        return new Response(JSON.stringify({ message: 'Invalid order data' }), {
          status: 400, // Bad Request
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Recuperiamo gli ordini esistenti
      const currentOrders = await kv.get<Order[]>(KEY) || [];
      
      // Aggiungiamo il nuovo ordine alla lista
      const updatedOrders = [...currentOrders, newOrder];

      // Salviamo la lista aggiornata in KV.
      // `ex: 86400` imposta una scadenza di 24 ore (in secondi).
      // Questo funge da meccanismo di pulizia automatico per Vercel KV.
      await kv.set(KEY, updatedOrders, { ex: 86400 });

      return new Response(JSON.stringify(newOrder), {
        status: 201, // Created
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('KV SET Error:', error);
      return new Response(JSON.stringify({ message: 'Error adding order to KV' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Se il metodo HTTP non è GET o POST, restituiamo un errore
  return new Response(JSON.stringify({ message: `Method ${request.method} Not Allowed` }), {
    status: 405, // Method Not Allowed
    headers: { 'Content-Type': 'application/json', 'Allow': 'GET, POST' },
  });
}
