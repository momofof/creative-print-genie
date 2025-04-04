
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

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
    // Create a Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse the webhook payload
    const webhookData = await req.json();
    console.log("Received CinetPay webhook:", webhookData);

    // Extract important data from webhook
    const { cpm_trans_id, cpm_site_id, cpm_trans_status } = webhookData;

    if (!cpm_trans_id) {
      throw new Error('Missing transaction ID in webhook data');
    }

    // Update payment status in our database
    const isPaymentSuccessful = cpm_trans_status === 'ACCEPTED';
    
    // Update the payment transaction in the database
    const { error } = await supabase
      .from('payment_transactions')
      .update({ 
        status: isPaymentSuccessful ? 'completed' : 'failed',
        webhook_data: JSON.stringify(webhookData),
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', cpm_trans_id);

    if (error) {
      console.error('Error updating transaction:', error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }

    // If payment was successful, create order
    if (isPaymentSuccessful) {
      // Get transaction details
      const { data: transactionData } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('transaction_id', cpm_trans_id)
        .single();

      if (transactionData) {
        // Parse the cart items from details
        const cartItems = JSON.parse(transactionData.details || '[]');
        
        // Create order from payment data
        await supabase.from('orders_complete').insert({
          customer_id: transactionData.user_id,
          total: transactionData.amount,
          status: 'processing',
          product_quantity: cartItems.length,
          payment_id: cpm_trans_id,
          payment_status: 'paid',
          payment_method: 'cinetpay'
        });
        
        // Clear the user's cart since the payment was successful
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', transactionData.user_id);
      }
    }

    // Return success response to CinetPay
    return new Response(
      JSON.stringify({ status: 'success' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ status: 'error', message: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
