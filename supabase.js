import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://ewuikrghkddybjuxqtel.supabase.co";

const supabaseKey =
"sb_publishable_D7kry2KGAjVF1j09oKukTw_Eub2qJev";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
