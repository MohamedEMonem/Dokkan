export type StoreOnboardingDraft = {
  profile?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  business?: {
    address?: string;
    taxId?: string;
    phone?: string;
  };
  plan?: {
    planId?: string;
    name?: string;
    price?: number;
    slug?: string;
  };
  payment?: {
    cardholderName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  };
  store?: {
    name?: string;
    description?: string;
    subdomain?: string;
  };
};

export type StepPatch = Partial<StoreOnboardingDraft>;
