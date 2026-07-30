export interface PendingCartAction {
  itemId: number;
  quantity: number;
  productName: string;
  itemName: string;
}

const pendingCartActionKey = 'mofu-pending-cart-action';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isPositiveInteger = (value: unknown) => {
  return Number.isInteger(value) && Number(value) > 0;
};

const isPendingCartAction = (value: unknown): value is PendingCartAction => {
  return (
    isRecord(value) &&
    isPositiveInteger(value.itemId) &&
    isPositiveInteger(value.quantity) &&
    typeof value.productName === 'string' &&
    typeof value.itemName === 'string'
  );
};

export const savePendingCartAction = (action: PendingCartAction) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(pendingCartActionKey, JSON.stringify(action));
  } catch {
    // Ignore storage failures; login redirect should still work.
  }
};

export const takePendingCartAction = () => {
  if (typeof window === 'undefined') return null;

  try {
    const rawAction = window.sessionStorage.getItem(pendingCartActionKey);

    window.sessionStorage.removeItem(pendingCartActionKey);

    if (!rawAction) return null;

    const parsedAction: unknown = JSON.parse(rawAction);

    return isPendingCartAction(parsedAction) ? parsedAction : null;
  } catch {
    return null;
  }
};
