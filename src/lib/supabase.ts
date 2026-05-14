import { createClient } from '@supabase/supabase-js';

// La clé anon Supabase est publique par conception — elle est envoyée depuis le navigateur
// et protégée par les politiques RLS (lecture publique, écriture limitée aux clés connues).
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  || 'https://ubcadxvjhyvwlltoytwh.supabase.co';

const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  || 'sb_publishable_khkuS_7LbvdmeXlXV47bcQ_3CB43xcl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
