
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CINETPAY_API_KEY = Deno.env.get("CINETPAY_API_KEY");
const CINETPAY_SECRET_KEY = Deno.env.get("CINETPAY_SECRET_KEY");
const CINETPAY_SITE_ID = Deno.env.get("CINETPAY_SITE_ID");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();

    // Create a Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // CinetPay check payment status API call
    const verifyResponse = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: transactionId
      })
    });

    const verifyData = await verifyResponse.json();
    
    if (verifyData && verifyData.code === '00') {
      const paymentStatus = verifyData.data.status;
      // Status "ACCEPTED" means the payment was successful
      const isSuccessful = paymentStatus === 'ACCEPTED';
      
      // Update the transaction status in our database
      await supabase
        .from('payment_transactions')
        .update({ 
          status: isSuccessful ? 'completed' : 'failed',
          response_data: JSON.stringify(verifyData)
        })
        .eq('transaction_id', transactionId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentSuccessful: isSuccessful,
          status: paymentStatus,
          details: verifyData.data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('CinetPay payment verification failed:', verifyData);
      
      // Update the transaction as failed or unknown in our database
      await supabase
        .from('payment_transactions')
        .update({ 
          status: 'verification_failed',
          response_data: JSON.stringify(verifyData)
        })
        .eq('transaction_id', transactionId);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Échec de la vérification du paiement',
          details: verifyData
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
