import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripePayment = async (
  number,
  cvc,
  exp_month,
  exp_year,
  amount
) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: number, // Card number as string (e.g., "4242424242424242")
        exp_month: exp_month, // Expiry month as number (e.g., 12)
        exp_year: exp_year, // Expiry year as number (e.g., 2025)
        cvc: cvc, // CVC as string (e.g., "424")
      },
    });

    // Convert the amount to cents
    const amountInCents = amount * 100;

    // Step 2: Attempt to create and confirm the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Amount in cents (e.g., 2600000 for PKR)
      currency: "pkr", // Currency as string
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: "http://localhost:5173/",
    });

    return paymentIntent;
  } catch (error) {
    console.error("Payment error:", error.message || error); // Log full error details for debugging
    return {
      success: false,
      message: error.message || "An unknown error occurred.",
    };
  }
};
