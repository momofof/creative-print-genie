
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Création du client Supabase avec la clé de service (pour avoir les privilèges admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérification de l'authentification et des autorisations
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No auth header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Vérifier le token JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Vérifier si l'utilisateur a le rôle admin (à implémenter selon votre système de rôles)
    // Pour l'instant, on va simplement continuer

    // Récupérer et traiter les données de la requête
    const { supplierId, action } = await req.json();

    if (!supplierId || !['approve', 'reject', 'suspend', 'activate'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Bad request - Invalid parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let newStatus;
    switch (action) {
      case 'approve':
      case 'activate':
        newStatus = 'active';
        break;
      case 'reject':
      case 'suspend':
        newStatus = 'suspended';
        break;
      default:
        newStatus = 'pending';
    }

    // Mettre à jour le statut du fournisseur
    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .update({ status: newStatus })
      .eq('id', supplierId)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier status:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update supplier status', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Envoi d'une notification par email (à implémenter)
    // Ici, vous pourriez ajouter du code pour envoyer un email au fournisseur

    return new Response(
      JSON.stringify({
        message: `Supplier status updated to ${newStatus}`,
        supplier: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
