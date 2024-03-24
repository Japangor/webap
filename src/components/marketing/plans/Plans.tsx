import { getServerSession } from "next-auth";
import { getUserById } from "@/lib/prisma/users";
import Stripe from "stripe";

// shadcn components
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import PlanButton from "./PlanButton";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const fetchPlans = async () => {
  const products = await stripe.products.list({ active: true });
  const prices = await stripe.prices.list({ active: true });

  // Combine product and price data, including features
  const plans = products.data.map((product) => {
    const productPrices = prices.data.filter((price) => price.product === product.id);
    const features = product.metadata.features ? product.metadata.features.split(',') : [];
    return {
      ...product,
      prices: productPrices,
      features: features,
    };
  });
  console.log('Fetched plans:', plans); // Log the fetched plans

  return plans;
};

export const Plans = async () => {
  const session = await getServerSession(authOptions);

  let user = null;
  if (session?.user?.id) {
    user = await getUserById(session.user.id);
  }

  const plans = await fetchPlans();

  const userSubscriptions = user && user.user ? user.user.subscriptions : null;

  return (
    <>
      <div className="flex flex-col items-start justify-center max-w-4xl gap-6 mx-auto md:flex-row md:gap-12">
        {plans.map((plan) => {
          const price = plan.prices[0]; // Assuming each plan has at least one price
          return (
            <Card
              className="flex-1 w-full"
              key={plan.id}
              data-productid={plan.id}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="text-2xl font-bold">
                  {price.currency.toUpperCase()} {(price.unit_amount / 100).toFixed(2)}
                </div>
                <ul className="space-y-2 list-disc list-inside">
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                {userSubscriptions ? (
                  <Button>Manage Subscription</Button>
                ) : (
                  <Button>Buy</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Plans;
