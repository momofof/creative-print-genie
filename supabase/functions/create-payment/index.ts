
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CINETPAY_API_KEY = Deno.env.get("CINETPAY_API_KEY");
const CINETPAY_SITE_ID = Deno.env.get("CINETPAY_SITE_ID");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { cartItems, totalPrice, userId, firstName, lastName, email, phoneNumber } = await req.json();

    // Create a Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Generate a unique transaction ID
    const transactionId = `TRANS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Format cart items for the description
    const itemsDescription = cartItems.map((item: any) => 
      `${item.name} x${item.quantity}`
    ).join(", ");
    
    const description = `Achat: ${itemsDescription}`;
    
    // Amount needs to be in the smallest currency unit (for XOF, there are no decimals)
    const amountInSmallestUnit = Math.round(totalPrice);

    console.log("Creating payment with data:", {
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      amountInSmallestUnit,
      description,
      transactionId,
    });

    // CinetPay payment creation API call
    const paymentResponse = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: transactionId,
        amount: amountInSmallestUnit,
        currency: 'XOF',
        description: description,
        return_url: `${req.headers.get("origin")}/payment-success?transaction_id=${transactionId}`,
        notify_url: `${req.headers.get("origin")}/api/cinetpay-webhook`,
        channels: 'ALL',
        lang: 'fr',
        customer_name: `${firstName || ''} ${lastName || ''}`.trim() || 'Client',
        customer_email: email || 'client@example.com',
        customer_phone_number: phoneNumber || '',
        customer_address: '',
        customer_city: '',
        customer_country: 'CI',
        customer_state: '',
        customer_zip_code: '',
        metadata: 'no_limit_payment' // Add metadata to indicate no payment limits
      })
    });

    const paymentData = await paymentResponse.json();
    console.log("CinetPay response:", paymentData);
    
    if (paymentData && paymentData.code === '201') {
      // Store the transaction reference in Supabase for later verification
      await supabase.from('payment_transactions').insert({
        transaction_id: transactionId,
        user_id: userId,
        amount: totalPrice,
        status: 'pending',
        payment_url: paymentData.data.payment_url,
        details: JSON.stringify(cartItems)
      });
      
      // Return the payment URL to redirect the user
      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentUrl: paymentData.data.payment_url,
          transactionId: transactionId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('CinetPay payment creation failed:', paymentData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Échec de la création du paiement',
          details: paymentData
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in create-payment function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
