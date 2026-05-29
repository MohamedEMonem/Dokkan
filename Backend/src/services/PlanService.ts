import prisma from "../config/db.js";

type PlanRecord = {
  id: string;
  name: string;
  price: unknown;
  features: unknown;
};

const mapPlan = (plan: PlanRecord) => ({
  ...plan,
  price: Number(plan.price),
});

export class PlanService {
  async listPlans() {
    const plans = await prisma.plan.findMany({
      orderBy: [{ price: "asc" }, { name: "asc" }],
    });

    return plans.map(mapPlan);
  }

  async getPlanById(planId: string) {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    return plan ? mapPlan(plan) : null;
  }

  async getOwnerStorePlan(ownerId: string) {
    const store = await prisma.store.findUnique({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        subdomain: true,
        status: true,
        subscriptions: {
          orderBy: [{ nextBillingDate: "desc" }],
          take: 1,
          select: {
            id: true,
            status: true,
            nextBillingDate: true,
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return null;
    }

    const currentSubscription = store.subscriptions[0] ?? null;

    return {
      store: {
        id: store.id,
        name: store.name,
        subdomain: store.subdomain,
        status: store.status,
      },
      subscription: currentSubscription
        ? {
            id: currentSubscription.id,
            status: currentSubscription.status,
            nextBillingDate: currentSubscription.nextBillingDate,
            plan: mapPlan(currentSubscription.plan),
          }
        : null,
    };
  }
}
