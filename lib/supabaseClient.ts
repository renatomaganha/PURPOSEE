import { createClient } from '@supabase/supabase-js';

// As credenciais do Supabase foram fornecidas para conexão direta.
const supabaseUrl = 'https://ojsgrhaopwwqpoyayumb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qc2dyaGFvcHd3cXBveWF5dW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzY4MjEsImV4cCI6MjA3NjQ1MjgyMX0.V7RjKxmng1mAizm5t9HFcp2LXhnxVqqIA-YEoMIPDKw';

if (!supabaseUrl || !supabaseAnonKey) {
  // Este erro não deve ocorrer com as credenciais codificadas, mas é uma boa prática.
  throw new Error("As credenciais do Supabase (URL ou Chave anônima) não foram encontradas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
