import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { PACKS, type DiamondPack } from "@/context/gameData";

let Purchases: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Purchases = require("react-native-purchases").default;
} catch {
  Purchases = null;
}

const API_KEY = Platform.select({
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
});

export const purchasesAreLive = () => !!Purchases && !!API_KEY;
export const purchasesMode = (): "revenuecat" | "demo" =>
  purchasesAreLive() ? "revenuecat" : "demo";

let configured = false;
export function initPurchases() {
  if (!purchasesAreLive() || configured) return;
  try {
    Purchases.configure({ apiKey: API_KEY });
    configured = true;
  } catch (e) {
    console.warn("RevenueCat configure failed", e);
  }
}

export type PackOffer = DiamondPack & { priceLabel: string; rcPackage?: any };

const demoOffers = (): PackOffer[] =>
  PACKS.map((p) => ({ ...p, priceLabel: p.price }));

export async function loadOffers(): Promise<PackOffer[]> {
  if (!purchasesAreLive()) return demoOffers();
  try {
    initPurchases();
    const offerings = await Purchases.getOfferings();

    console.log("RevenueCat current offering:", offerings.current);
    console.log(
      "RevenueCat packages:",
      offerings.current?.availablePackages.map((p: any) => ({
        id: p.identifier,
        product: p.product.identifier,
        price: p.product.priceString,
      })),
    );

    const packages: any[] = offerings.current?.availablePackages ?? [];
    return PACKS.map((p) => {
      const pkg = packages.find(
        (x) =>
          x.product.identifier === p.productId ||
          x.product.identifier.startsWith(`${p.productId}:`),
      );
      return {
        ...p,
        priceLabel: pkg ? pkg.product.priceString : p.price,
        rcPackage: pkg,
      };
    });
  } catch (e) {
    console.warn("RevenueCat getOfferings failed", e);
    return demoOffers().map((o) => ({ ...o, rcPackage: undefined }));
  }
}

export type BuyResult = {
  status: "success" | "cancelled" | "error";
  message?: string;
  transactionId?: string;
};

export async function buyOffer(offer: PackOffer): Promise<BuyResult> {
  if (!purchasesAreLive()) return { status: "success" };
  if (!offer.rcPackage)
    return {
      status: "error",
      message: "This pack is not available in the store right now.",
    };
  try {
    const res = await Purchases.purchasePackage(offer.rcPackage);
    const txId: string =
      res?.transaction?.transactionIdentifier ??
      `${offer.productId}:${Date.now()}`;
    return { status: "success", transactionId: txId };
  } catch (e) {
    const err = e as any;
    if (err?.userCancelled) return { status: "cancelled" };
    return {
      status: "error",
      message: err?.message ?? "Something went wrong.",
    };
  }
}

export function useOffers() {
  const [offers, setOffers] = useState<PackOffer[]>(demoOffers());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    loadOffers()
      .then((o) => alive && setOffers(o))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  return { offers, loading };
}
