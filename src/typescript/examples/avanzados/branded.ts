// ─── Branded types: dos strings que NO se pueden confundir entre sí ───
// Problema: UserId y OrderId son string, así que TS deja pasar uno por el otro.
declare const brand: unique symbol;
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };

export type UserId = Brand<string, 'UserId'>;
export type OrderId = Brand<string, 'OrderId'>;
export type Email = Brand<string, 'Email'>;
export type Euros = Brand<number, 'Euros'>;

// "Constructores" que validan y devuelven el tipo marcado
export const UserId = (value: string) => value as UserId;
export const OrderId = (value: string) => value as OrderId;

export function Email(value: string): Email {
  if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error(`Email no válido: ${value}`);
  return value.toLowerCase() as Email;
}

export function Euros(value: number): Euros {
  if (!Number.isFinite(value) || value < 0) throw new Error('Importe no válido');
  return (Math.round(value * 100) / 100) as Euros;
}

export function cancelOrder(orderId: OrderId, by: UserId): string {
  return `Pedido ${orderId} cancelado por ${by}`;
}

export function sendInvoice(to: Email, amount: Euros): string {
  return `Factura de ${amount.toFixed(2)} € enviada a ${to}`;
}

// ─── Assertion functions: "asserts value is T" ───
export function assertIsDefined<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) throw new Error(message);
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript(user: UserId, order: OrderId) {
  // @ts-expect-error → se han invertido los argumentos: UserId no es OrderId
  cancelOrder(user, order);
  // @ts-expect-error → un string normal no es un Email validado
  sendInvoice('sin-validar@mail.com', Euros(10));
}

// ▶ Demo
export default function demo() {
  const user = UserId('usr_42');
  const order = OrderId('ord_1001');
  console.log(cancelOrder(order, user));
  console.log(sendInvoice(Email('Ana@Mail.com'), Euros(129.456)));

  try {
    Email('esto-no-es-un-email');
  } catch (error) {
    console.log('❌', (error as Error).message);
  }

  const maybeName: string | undefined = ['Ana', 'Luis'].find((name) => name.startsWith('L'));
  assertIsDefined(maybeName, 'No se encontró');
  console.log('Tras assertIsDefined, maybeName es string:', maybeName.toUpperCase());
}
