// ─── Interface que las clases prometen cumplir ───
export interface Describable {
  describe(): string;
}

// ─── Clase abstracta: no se puede instanciar, solo heredar ───
export abstract class Account implements Describable {
  private static nextId = 1; // compartido por todas las instancias
  readonly id: number;
  protected balance = 0; // visible en esta clase y en las hijas
  private history: string[] = []; // solo dentro de esta clase

  // "parameter property": public owner crea y asigna la propiedad automáticamente
  constructor(public owner: string) {
    this.id = Account.nextId++;
  }

  deposit(amount: number): this {
    if (amount <= 0) throw new Error('La cantidad debe ser positiva');
    this.balance += amount;
    this.history.push(`+${amount}`);
    return this; // devolver "this" permite encadenar llamadas
  }

  withdraw(amount: number): this {
    if (amount > this.available) throw new Error(`Saldo insuficiente en la cuenta de ${this.owner}`);
    this.balance -= amount;
    this.history.push(`-${amount}`);
    return this;
  }

  // getter: se usa como una propiedad (account.available)
  get available(): number {
    return this.balance + this.overdraftLimit();
  }

  get movements(): readonly string[] {
    return this.history;
  }

  // método abstracto: cada clase hija DEBE implementarlo
  protected abstract overdraftLimit(): number;

  describe(): string {
    return `#${this.id} ${this.constructor.name} de ${this.owner}: ${this.balance} €`;
  }
}

export class SavingsAccount extends Account {
  constructor(
    owner: string,
    private interestRate: number
  ) {
    super(owner); // llama al constructor del padre
  }

  protected overdraftLimit(): number {
    return 0;
  }

  addInterest(): this {
    return this.deposit(Math.round(this.balance * this.interestRate * 100) / 100);
  }
}

export class CheckingAccount extends Account {
  protected overdraftLimit(): number {
    return 500; // permite números rojos hasta 500 €
  }
}

// Errores que TypeScript detecta al compilar (esta función nunca se ejecuta)
export function erroresQueDetectaTypeScript(account: SavingsAccount) {
  // @ts-expect-error → Cannot create an instance of an abstract class
  new Account('Ana');
  // @ts-expect-error → Property 'balance' is protected
  return account.balance;
}

// ▶ Demo
export default function demo() {
  const savings = new SavingsAccount('Ana', 0.02).deposit(1000).addInterest();
  const checking = new CheckingAccount('Luis').deposit(100).withdraw(400);

  const accounts: Describable[] = [savings, checking]; // polimorfismo
  for (const account of accounts) console.log(account.describe());

  console.log('Disponible de Luis:', checking.available, '| movimientos:', checking.movements);

  try {
    savings.withdraw(5000);
  } catch (error) {
    console.log('❌', (error as Error).message);
  }
}
