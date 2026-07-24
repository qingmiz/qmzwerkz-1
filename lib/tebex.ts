const TEBEX_STORE = process.env.NEXT_PUBLIC_TEBEX_STORE!;

export function getStoreUrl() {
  return TEBEX_STORE;
}

export function getPackage(packageId: number | string) {
  return `${TEBEX_STORE}/package/${packageId}`;
}

export function getCategory(categoryId: number | string) {
  return `${TEBEX_STORE}/category/${categoryId}`;
}

export async function verifyPurchase(transactionId: string) {
  // TODO:
  // Connect to the Tebex API later.
  return {
    success: true,
    transactionId,
  };
}