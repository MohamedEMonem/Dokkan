import { useCallback, useSyncExternalStore } from "react";

export interface ICart {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
  imageUrl: string | null;
  inStock?: boolean;
}

const CART_KEY = "cart";
const subscribers = new Set<() => void>();

const subscribe = (listener: () => void) => {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
};

const notify = () => {
  subscribers.forEach((listener) => listener());
};

const readGuestCart = (): ICart[] => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? (JSON.parse(data) as ICart[]) : [];
  } catch {
    return [];
  }
};

let store: ICart[] = readGuestCart();

const setStore = (next: ICart[]) => {
  store = next;

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures
  }

  notify();
};

export const useGuestCartStorage = () => {
  const items = useSyncExternalStore(
    subscribe,
    () => store,
    () => store,
  );

  const loadGuestCart = useCallback(() => {
    return readGuestCart();
  }, []);

  const saveGuestCart = useCallback((cartItems: ICart[]) => {
    setStore(cartItems);
  }, []);

  //   const addGuestCartItem = useCallback(
  //     (item: ICart) => {
  //       const current = loadGuestCart();

  //       const existing = current.find((x) => x.productId === item.productId);

  //       let next: ICart[];

  //       if (existing) {
  //         next = current.map((x) =>
  //           x.productId === item.productId
  //             ? {
  //                 ...x,
  //                 quantity: x.quantity + item.quantity,
  //               }
  //             : x,
  //         );
  //       } else {
  //         next = [...current, item];
  //       }

  //       setStore(next);

  //       return next;
  //     },
  //     [loadGuestCart],
  //   );

  const removeGuestCartItem = useCallback(
    (productId: string) => {
      const current = loadGuestCart();

      const next = current.filter((x) => x.productId !== productId);

      setStore(next);

      return next;
    },
    [loadGuestCart],
  );

  const clearGuestCart = useCallback(() => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      // ignore storage failures
    }

    setStore([]);
  }, []);

  return {
    items,
    saveGuestCart,
    loadGuestCart,
    // addGuestCartItem,
    removeGuestCartItem,
    clearGuestCart,
  };
};
