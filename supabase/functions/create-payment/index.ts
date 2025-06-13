
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
    const { cartItems, totalPrice, userId, firstName, lastName, email, phoneNumber, depositData } = await req.json();

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

    // Ensure required fields are not empty
    const customerName = `${firstName || ''} ${lastName || ''}`.trim() || 'Client';
    const customerEmail = email || 'client@example.com';
    const customerPhone = phoneNumber || '0000000000'; // Provide a default phone number

    console.log("Creating payment with data:", {
      userId,
      firstName: firstName || 'N/A',
      lastName: lastName || 'N/A', 
      email: customerEmail,
      phoneNumber: customerPhone,
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
        channels: 'ALL', // Permet toutes les méthodes de paiement (cartes bancaires, mobile money, etc.)
        lang: 'fr',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone_number: customerPhone,
        customer_address: 'Adresse non spécifiée',
        customer_city: 'Ville non spécifiée',
        customer_country: 'CI',
        customer_state: 'État non spécifié',
        customer_zip_code: '00000',
        metadata: 'no_limit_payment', // Permet les paiements sans limite
        // Paramètres additionnels pour forcer l'activation de toutes les méthodes
        payment_method: 'ALL'
      })
    });

    const paymentData = await paymentResponse.json();
    console.log("CinetPay response:", paymentData);
    
    if (paymentData && paymentData.code === '201') {
      // Store the transaction reference in Supabase for later verification
      const insertData = {
        transaction_id: transactionId,
        user_id: userId,
        amount: totalPrice,
        status: 'pending',
        payment_url: paymentData.data.payment_url,
        details: JSON.stringify(cartItems)
      };

      // Add deposit data if present
      if (depositData) {
        insertData.details = JSON.stringify({
          cartItems,
          depositData
        });
      }

      await supabase.from('payment_transactions').insert(insertData);
      
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
