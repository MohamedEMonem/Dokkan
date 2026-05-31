export type StoreOnboardingDraft = {
  profile?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  business?: {
    address?: string;
    taxId?: string;
  };
  plan?: {
    planId?: string;
    name?: string;
    price?: number;
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
