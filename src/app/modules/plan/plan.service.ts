import Stripe from "stripe";
import { AppError } from "../../utils/app_error";
import { User_Model } from "../auth/auth.schema";
import { Plan_Model } from "./plan.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const get_all_plan_from_db = async () => {
  const result = await Plan_Model.find();

  return result;
};

const create_plan_into_db = async (payload: any) => {
  const result = await Plan_Model.create(payload);

  return result;
};

const create_checkout_session = async (userId: string, planId: string) => {
  try {
    const user = await User_Model.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    const plan = await Plan_Model.findById(planId);
    if (!plan) throw new AppError(404, "Plan not found");

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const sessionConfig: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe create_checkout_session error:", error);
    // Throw the actual error message for debugging
    throw new AppError(500, error.message || "Error creating checkout session");
  }
};

const cancel_subscription_from_db = async (userId: string) => {
  const isUserExist = await User_Model.findById(userId);

  if (!isUserExist) throw new AppError(404, "User not found");
  if (!isUserExist?.subscriptionId) throw new AppError(400, "No active subscription found");

  const canceled = await stripe.subscriptions.update(isUserExist.subscriptionId, {
    cancel_at_period_end: true, // cancels at the end of the billing cycle
  });

  isUserExist.subscriptionStatus = canceled.status;
  await isUserExist.save();

  return { status: canceled.status };
};

export const plan_service = {
  get_all_plan_from_db,
  create_plan_into_db,
  create_checkout_session,
  cancel_subscription_from_db,
};
