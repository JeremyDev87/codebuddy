# Refactoring Catalog

A comprehensive reference of refactoring patterns organized by category.
Based on Martin Fowler's refactoring catalog.

## Table of Contents

1. **[Method-Level Refactorings](#1-method-level-refactorings)**
   - [Extract Method](#extract-method) | [Inline Method](#inline-method) | [Rename Method/Function](#rename-methodfunction)
   - [Add Parameter](#add-parameter) | [Remove Parameter](#remove-parameter) | [Replace Parameter with Method Call](#replace-parameter-with-method-call)

2. **[Duplication Elimination](#2-duplication-elimination)**
   - [Extract Method for Duplicate Code](#extract-method-for-duplicate-code) | [Pull Up Method](#pull-up-method)
   - [Push Down Method](#push-down-method) | [Substitute Algorithm](#substitute-algorithm)

3. **[Moving Features](#3-moving-features)**
   - [Move Method](#move-method) | [Move Field](#move-field) | [Extract Class](#extract-class)
   - [Inline Class](#inline-class) | [Hide Delegate](#hide-delegate)

4. **[Data Organization](#4-data-organization)**
   - [Replace Primitive with Object](#replace-primitive-with-object) | [Replace Magic Number with Constant](#replace-magic-number-with-constant)
   - [Encapsulate Field](#encapsulate-field) | [Replace Type Code with Class](#replace-type-code-with-class)

5. **[Conditional Simplification](#5-conditional-simplification)**
   - [Decompose Conditional](#decompose-conditional) | [Consolidate Conditional Expression](#consolidate-conditional-expression)
   - [Replace Conditional with Polymorphism](#replace-conditional-with-polymorphism) | [Introduce Null Object](#introduce-null-object)
   - [Replace Nested Conditional with Guard Clauses](#replace-nested-conditional-with-guard-clauses)

6. **[API Simplification](#6-api-simplification)**
   - [Separate Query from Modifier](#separate-query-from-modifier) | [Parameterize Method](#parameterize-method)
   - [Replace Parameter with Query](#replace-parameter-with-query) | [Introduce Parameter Object](#introduce-parameter-object)

7. **[React/Next.js Specific Refactorings](#7-reactnextjs-specific-refactorings)**
   - [Extract Custom Hook](#extract-custom-hook) | [Lift State Up](#lift-state-up) | [Replace Local State with URL State](#replace-local-state-with-url-state)
   - [Convert to Server Component](#convert-to-server-component) | [Extract Server Action](#extract-server-action)

---

## 1. Method-Level Refactorings

### Extract Method

**Code Smell:** Long method, duplicated code fragment

**Before:**
```typescript
function printInvoice(invoice: Invoice) {
  console.log("=== Invoice ===");
  console.log(`Customer: ${invoice.customer.name}`);

  // Calculate total
  let total = 0;
  for (const item of invoice.items) {
    total += item.price * item.quantity;
  }
  if (invoice.discount) {
    total = total * (1 - invoice.discount);
  }

  console.log(`Total: $${total.toFixed(2)}`);
}
```

**After:**
```typescript
function printInvoice(invoice: Invoice) {
  console.log("=== Invoice ===");
  console.log(`Customer: ${invoice.customer.name}`);
  console.log(`Total: $${calculateTotal(invoice).toFixed(2)}`);
}

function calculateTotal(invoice: Invoice): number {
  let total = 0;
  for (const item of invoice.items) {
    total += item.price * item.quantity;
  }
  if (invoice.discount) {
    total = total * (1 - invoice.discount);
  }
  return total;
}
```

**When to apply:**
- Method is too long (>20 lines)
- Code fragment appears in multiple places
- Code needs a comment to explain what it does
- You want to test the extracted logic independently

**IDE support:** Most IDEs have "Extract Method/Function" refactoring (Ctrl+Alt+M in JetBrains, Ctrl+Shift+R in VS Code with extension)

---

### Inline Method

**Code Smell:** Method body is as clear as its name, excessive delegation

**Before:**
```typescript
function getRating(driver: Driver): number {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver: Driver): boolean {
  return driver.numberOfLateDeliveries > 5;
}
```

**After:**
```typescript
function getRating(driver: Driver): number {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**When to apply:**
- Method body is as obvious as its name
- Too many simple delegating methods
- Method is only called once
- Preparing for further refactoring

---

### Rename Method/Function

**Code Smell:** Name doesn't reveal intent

**Before:**
```typescript
function calc(a: number, b: number): number {
  return a * b * 0.1;
}
```

**After:**
```typescript
function calculateTax(price: number, quantity: number): number {
  return price * quantity * 0.1;
}
```

**When to apply:**
- Name is abbreviated or unclear
- Name doesn't match what method does
- Name uses implementation details instead of intent

**IDE support:** All major IDEs support rename refactoring (F2 in VS Code, Shift+F6 in JetBrains)

---

### Add Parameter

**Code Smell:** Method needs more information to do its job

**Before:**
```typescript
function getContact(customer: Customer): Contact {
  return customer.primaryContact;
}
```

**After:**
```typescript
function getContact(customer: Customer, type: ContactType): Contact {
  return type === 'primary'
    ? customer.primaryContact
    : customer.secondaryContact;
}
```

**When to apply:**
- Method needs additional data
- Behavior should vary based on caller's context
- Multiple similar methods could be unified

---

### Remove Parameter

**Code Smell:** Parameter is no longer used

**Before:**
```typescript
function calculatePrice(
  quantity: number,
  pricePerUnit: number,
  customer: Customer  // Never used
): number {
  return quantity * pricePerUnit;
}
```

**After:**
```typescript
function calculatePrice(quantity: number, pricePerUnit: number): number {
  return quantity * pricePerUnit;
}
```

**When to apply:**
- Parameter is never used in method body
- Parameter was for removed feature
- Parameter is always same value

---

### Replace Parameter with Method Call

**Code Smell:** Parameter can be obtained by calling another method

**Before:**
```typescript
const basePrice = quantity * itemPrice;
const discount = getDiscount();
const finalPrice = calculateFinalPrice(basePrice, discount);
```

**After:**
```typescript
const basePrice = quantity * itemPrice;
const finalPrice = calculateFinalPrice(basePrice);

function calculateFinalPrice(basePrice: number): number {
  const discount = getDiscount();
  return basePrice * (1 - discount);
}
```

**When to apply:**
- Parameter can be obtained from another method the receiver can call
- Simplifies calling code
- Parameter is always derived the same way

---

## 2. Duplication Elimination

### Extract Method for Duplicate Code

**Code Smell:** Same code fragment in multiple places

**Before:**
```typescript
function validateUser(user: User) {
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email');
  }
  // ... more validation
}

function validateAdmin(admin: Admin) {
  if (!admin.email || !admin.email.includes('@')) {
    throw new Error('Invalid email');
  }
  // ... more validation
}
```

**After:**
```typescript
function validateEmail(email: string): void {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }
}

function validateUser(user: User) {
  validateEmail(user.email);
  // ... more validation
}

function validateAdmin(admin: Admin) {
  validateEmail(admin.email);
  // ... more validation
}
```

---

### Pull Up Method

**Code Smell:** Identical method in multiple subclasses

**Before:**
```typescript
class Employee {
  // ...
}

class Engineer extends Employee {
  getName(): string {
    return this.name;
  }
}

class Salesperson extends Employee {
  getName(): string {
    return this.name;
  }
}
```

**After:**
```typescript
class Employee {
  getName(): string {
    return this.name;
  }
}

class Engineer extends Employee {}
class Salesperson extends Employee {}
```

**When to apply:**
- Same method in multiple subclasses
- Methods have identical behavior
- All subclasses need this method

---

### Push Down Method

**Code Smell:** Method only used by some subclasses

**Before:**
```typescript
class Employee {
  getQuota(): number {
    return this.quota;  // Only relevant for Salesperson
  }
}

class Engineer extends Employee {}
class Salesperson extends Employee {}
```

**After:**
```typescript
class Employee {}

class Engineer extends Employee {}

class Salesperson extends Employee {
  getQuota(): number {
    return this.quota;
  }
}
```

---

### Substitute Algorithm

**Code Smell:** Algorithm can be replaced with clearer one

**Before:**
```typescript
function findPerson(people: string[]): string {
  for (let i = 0; i < people.length; i++) {
    if (people[i] === 'Don') return 'Don';
    if (people[i] === 'John') return 'John';
    if (people[i] === 'Kent') return 'Kent';
  }
  return '';
}
```

**After:**
```typescript
function findPerson(people: string[]): string {
  const candidates = ['Don', 'John', 'Kent'];
  return people.find(p => candidates.includes(p)) ?? '';
}
```

---

## 3. Moving Features

### Move Method

**Code Smell:** Feature envy - method uses more features of another class

**Before:**
```typescript
class Account {
  type: AccountType;
  daysOverdrawn: number;

  overdraftCharge(): number {
    if (this.type.isPremium) {
      const baseCharge = 10;
      if (this.daysOverdrawn <= 7) {
        return baseCharge;
      }
      return baseCharge + (this.daysOverdrawn - 7) * 0.85;
    }
    return this.daysOverdrawn * 1.75;
  }
}
```

**After:**
```typescript
class Account {
  type: AccountType;
  daysOverdrawn: number;

  overdraftCharge(): number {
    return this.type.overdraftCharge(this.daysOverdrawn);
  }
}

class AccountType {
  isPremium: boolean;

  overdraftCharge(daysOverdrawn: number): number {
    if (this.isPremium) {
      const baseCharge = 10;
      if (daysOverdrawn <= 7) return baseCharge;
      return baseCharge + (daysOverdrawn - 7) * 0.85;
    }
    return daysOverdrawn * 1.75;
  }
}
```

---

### Move Field

**Code Smell:** Field is used more by another class

**Before:**
```typescript
class Customer {
  discountRate: number;
  // ... customer fields
}

class Order {
  customer: Customer;

  getDiscount(): number {
    return this.basePrice * this.customer.discountRate;
  }
}
```

**After:**
```typescript
class Customer {
  // discountRate moved to Order or a new DiscountPolicy class
}

class Order {
  customer: Customer;
  discountRate: number;

  getDiscount(): number {
    return this.basePrice * this.discountRate;
  }
}
```

---

### Extract Class

**Code Smell:** Class does too much (Large Class)

**Before:**
```typescript
class Person {
  name: string;
  officeAreaCode: string;
  officeNumber: string;

  getOfficePhone(): string {
    return `(${this.officeAreaCode}) ${this.officeNumber}`;
  }
}
```

**After:**
```typescript
class Person {
  name: string;
  officePhone: TelephoneNumber;
}

class TelephoneNumber {
  areaCode: string;
  number: string;

  toString(): string {
    return `(${this.areaCode}) ${this.number}`;
  }
}
```

**When to apply:**
- Class has too many responsibilities
- Subset of data/methods form a logical group
- Class is hard to understand

---

### Inline Class

**Code Smell:** Class does too little

**Before:**
```typescript
class Person {
  name: string;
  officePhone: TelephoneNumber;
}

class TelephoneNumber {
  number: string;
  // Only one field, no real behavior
}
```

**After:**
```typescript
class Person {
  name: string;
  officePhoneNumber: string;
}
```

---

### Hide Delegate

**Code Smell:** Client knows too much about class structure

**Before:**
```typescript
// Client code
const manager = person.department.manager;
```

**After:**
```typescript
class Person {
  department: Department;

  getManager(): Person {
    return this.department.manager;
  }
}

// Client code
const manager = person.getManager();
```

---

## 4. Data Organization

### Replace Primitive with Object

**Code Smell:** Primitive obsession

**Before:**
```typescript
class Order {
  priority: string;  // "high", "rush", "normal"
}

// Usage
if (order.priority === 'high' || order.priority === 'rush') {
  // ...
}
```

**After:**
```typescript
class Priority {
  private value: string;

  constructor(value: string) {
    if (!['low', 'normal', 'high', 'rush'].includes(value)) {
      throw new Error('Invalid priority');
    }
    this.value = value;
  }

  higherThan(other: Priority): boolean {
    return this.index() > other.index();
  }

  private index(): number {
    return ['low', 'normal', 'high', 'rush'].indexOf(this.value);
  }
}

class Order {
  priority: Priority;
}

// Usage
if (order.priority.higherThan(new Priority('normal'))) {
  // ...
}
```

---

### Replace Magic Number with Constant

**Code Smell:** Unexplained literal numbers

**Before:**
```typescript
function potentialEnergy(mass: number, height: number): number {
  return mass * 9.81 * height;
}
```

**After:**
```typescript
const GRAVITATIONAL_CONSTANT = 9.81;

function potentialEnergy(mass: number, height: number): number {
  return mass * GRAVITATIONAL_CONSTANT * height;
}
```

---

### Encapsulate Field

**Code Smell:** Public field

**Before:**
```typescript
class Person {
  name: string;
}
```

**After:**
```typescript
class Person {
  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
```

---

### Replace Type Code with Class

**Code Smell:** Type code that affects behavior

**Before:**
```typescript
class Employee {
  type: number;  // 0 = engineer, 1 = salesperson, 2 = manager

  getBonus(): number {
    switch (this.type) {
      case 0: return 0;
      case 1: return this.sales * 0.1;
      case 2: return 1000;
    }
  }
}
```

**After:**
```typescript
abstract class EmployeeType {
  abstract getBonus(employee: Employee): number;
}

class Engineer extends EmployeeType {
  getBonus(): number { return 0; }
}

class Salesperson extends EmployeeType {
  getBonus(employee: Employee): number {
    return employee.sales * 0.1;
  }
}

class Manager extends EmployeeType {
  getBonus(): number { return 1000; }
}

class Employee {
  type: EmployeeType;

  getBonus(): number {
    return this.type.getBonus(this);
  }
}
```

---

## 5. Conditional Simplification

### Decompose Conditional

**Code Smell:** Complex conditional logic

**Before:**
```typescript
function calculateCharge(date: Date, quantity: number): number {
  if (date < SUMMER_START || date > SUMMER_END) {
    return quantity * winterRate + winterServiceCharge;
  } else {
    return quantity * summerRate;
  }
}
```

**After:**
```typescript
function calculateCharge(date: Date, quantity: number): number {
  if (isSummer(date)) {
    return summerCharge(quantity);
  } else {
    return winterCharge(quantity);
  }
}

function isSummer(date: Date): boolean {
  return date >= SUMMER_START && date <= SUMMER_END;
}

function summerCharge(quantity: number): number {
  return quantity * summerRate;
}

function winterCharge(quantity: number): number {
  return quantity * winterRate + winterServiceCharge;
}
```

---

### Consolidate Conditional Expression

**Code Smell:** Multiple conditionals with same result

**Before:**
```typescript
function disabilityAmount(employee: Employee): number {
  if (employee.seniority < 2) return 0;
  if (employee.monthsDisabled > 12) return 0;
  if (employee.isPartTime) return 0;
  // Calculate disability
  return /* ... */;
}
```

**After:**
```typescript
function disabilityAmount(employee: Employee): number {
  if (isNotEligibleForDisability(employee)) return 0;
  // Calculate disability
  return /* ... */;
}

function isNotEligibleForDisability(employee: Employee): boolean {
  return employee.seniority < 2
    || employee.monthsDisabled > 12
    || employee.isPartTime;
}
```

---

### Replace Conditional with Polymorphism

**Code Smell:** Switch on type code

**Before:**
```typescript
function plumage(bird: Bird): string {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 'average';
    case 'AfricanSwallow':
      return bird.numberOfCoconuts > 2 ? 'tired' : 'average';
    case 'NorwegianBlueParrot':
      return bird.voltage > 100 ? 'scorched' : 'beautiful';
    default:
      return 'unknown';
  }
}
```

**After:**
```typescript
abstract class Bird {
  abstract plumage(): string;
}

class EuropeanSwallow extends Bird {
  plumage(): string { return 'average'; }
}

class AfricanSwallow extends Bird {
  numberOfCoconuts: number;
  plumage(): string {
    return this.numberOfCoconuts > 2 ? 'tired' : 'average';
  }
}

class NorwegianBlueParrot extends Bird {
  voltage: number;
  plumage(): string {
    return this.voltage > 100 ? 'scorched' : 'beautiful';
  }
}
```

---

### Introduce Null Object

**Code Smell:** Repeated null checks

**Before:**
```typescript
function getPaymentPlan(customer: Customer | null): string {
  if (customer === null) return 'basic';
  return customer.plan;
}

function getName(customer: Customer | null): string {
  if (customer === null) return 'occupant';
  return customer.name;
}
```

**After:**
```typescript
class NullCustomer implements Customer {
  get plan(): string { return 'basic'; }
  get name(): string { return 'occupant'; }
  isNull(): boolean { return true; }
}

// Replace null with NullCustomer at source
function getPaymentPlan(customer: Customer): string {
  return customer.plan;
}

function getName(customer: Customer): string {
  return customer.name;
}
```

---

### Replace Nested Conditional with Guard Clauses

**Code Smell:** Deeply nested conditionals

**Before:**
```typescript
function getPayAmount(employee: Employee): number {
  let result: number;
  if (employee.isDead) {
    result = deadAmount();
  } else {
    if (employee.isSeparated) {
      result = separatedAmount();
    } else {
      if (employee.isRetired) {
        result = retiredAmount();
      } else {
        result = normalPayAmount();
      }
    }
  }
  return result;
}
```

**After:**
```typescript
function getPayAmount(employee: Employee): number {
  if (employee.isDead) return deadAmount();
  if (employee.isSeparated) return separatedAmount();
  if (employee.isRetired) return retiredAmount();
  return normalPayAmount();
}
```

---

## 6. API Simplification

### Separate Query from Modifier

**Code Smell:** Method both returns value and changes state

**Before:**
```typescript
function getTotalOutstandingAndSetReadyForSummaries(): number {
  this.readyForSummaries = true;
  return this.invoices.reduce((sum, inv) => sum + inv.amount, 0);
}
```

**After:**
```typescript
function getTotalOutstanding(): number {
  return this.invoices.reduce((sum, inv) => sum + inv.amount, 0);
}

function setReadyForSummaries(): void {
  this.readyForSummaries = true;
}
```

---

### Parameterize Method

**Code Smell:** Multiple similar methods

**Before:**
```typescript
function tenPercentRaise(person: Person): void {
  person.salary = person.salary * 1.1;
}

function fivePercentRaise(person: Person): void {
  person.salary = person.salary * 1.05;
}
```

**After:**
```typescript
function raise(person: Person, factor: number): void {
  person.salary = person.salary * (1 + factor);
}
```

---

### Replace Parameter with Query

**Code Smell:** Parameter can be computed

**Before:**
```typescript
function finalPrice(basePrice: number, discountLevel: number): number {
  const discount = discountLevel === 2 ? 0.1 : 0.05;
  return basePrice * (1 - discount);
}

// Caller
const level = customer.discountLevel;
const price = finalPrice(basePrice, level);
```

**After:**
```typescript
function finalPrice(basePrice: number): number {
  const discount = this.discountLevel === 2 ? 0.1 : 0.05;
  return basePrice * (1 - discount);
}

// Caller
const price = finalPrice(basePrice);
```

---

### Introduce Parameter Object

**Code Smell:** Groups of parameters that travel together

**Before:**
```typescript
function amountInvoiced(startDate: Date, endDate: Date): number { /* ... */ }
function amountReceived(startDate: Date, endDate: Date): number { /* ... */ }
function amountOverdue(startDate: Date, endDate: Date): number { /* ... */ }
```

**After:**
```typescript
class DateRange {
  constructor(
    readonly start: Date,
    readonly end: Date
  ) {}

  contains(date: Date): boolean {
    return date >= this.start && date <= this.end;
  }
}

function amountInvoiced(range: DateRange): number { /* ... */ }
function amountReceived(range: DateRange): number { /* ... */ }
function amountOverdue(range: DateRange): number { /* ... */ }
```

---

## 7. React/Next.js Specific Refactorings

### Extract Custom Hook

**Code Smell:** Stateful logic duplicated across components, complex useState/useEffect clusters

**Before:**
```tsx
function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ProfileCard user={user} />;
}
```

**After:**
```tsx
// hooks/useUser.ts
function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}

// components/UserProfile.tsx
function UserProfile() {
  const { user, loading, error } = useUser();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ProfileCard user={user} />;
}
```

**When to apply:**
- Same stateful logic appears in 2+ components
- Component has 3+ useState calls with related logic
- useEffect logic could be reused elsewhere
- Testing stateful logic independently from UI

---

### Lift State Up

**Code Smell:** Sibling components need to share state, prop drilling through intermediaries

**Before:**
```tsx
function ProductList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          selected={p.id === selectedId}
          onSelect={() => setSelectedId(p.id)}
        />
      ))}
    </div>
  );
}

function ProductDetails() {
  // ❌ Can't access selectedId - needs to duplicate state or prop drill
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // ...
}
```

**After:**
```tsx
function ProductPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2">
      <ProductList
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ProductDetails productId={selectedId} />
    </div>
  );
}

function ProductList({ selectedId, onSelect }: ProductListProps) {
  return (
    <div>
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          selected={p.id === selectedId}
          onSelect={() => onSelect(p.id)}
        />
      ))}
    </div>
  );
}
```

**When to apply:**
- Sibling components need access to same state
- State changes in one component should reflect in another
- Prop drilling becomes excessive (consider context for deep trees)

---

### Replace Local State with URL State

**Code Smell:** Filter/search/pagination state lost on refresh, state not shareable via URL

**Before:**
```tsx
function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  // ❌ State lost on refresh, can't share URL
  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <CategoryFilter value={category} onChange={setCategory} />
      <ProductGrid search={search} category={category} page={page} />
      <Pagination page={page} onChange={setPage} />
    </div>
  );
}
```

**After:**
```tsx
// Next.js App Router
function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const search = searchParams.q ?? '';
  const category = searchParams.category ?? 'all';
  const page = Number(searchParams.page) || 1;

  return (
    <div>
      <SearchInput defaultValue={search} />
      <CategoryFilter value={category} />
      <ProductGrid search={search} category={category} page={page} />
      <Pagination page={page} />
    </div>
  );
}

// SearchInput uses router.push or Link to update URL
function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('q', value);
    params.set('page', '1'); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };

  return <Input defaultValue={defaultValue} onChange={handleSearch} />;
}
```

**When to apply:**
- Users expect to bookmark or share filtered views
- State should persist across browser refresh
- Back/forward navigation should restore previous state
- SEO benefits from indexable filter combinations

---

### Convert to Server Component

**Code Smell:** Client component only fetches and displays data, no interactivity

**Before:**
```tsx
'use client';

import { useEffect, useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**After:**
```tsx
// Server Component (default in App Router)
import { getUsers } from '@/entities/user/apis';

export async function UserList() {
  const users = await getUsers();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**When to apply:**
- Component only displays data (no useState, useEffect for interactivity)
- Data fetching can happen on server
- Reducing client JavaScript bundle size
- Avoiding loading states when possible

**Benefits:**
- Zero client JavaScript for this component
- No loading state needed (data fetched before render)
- Better SEO (content in initial HTML)
- Reduced network waterfall

---

### Extract Server Action

**Code Smell:** Form submission logic mixed with UI, API routes for simple mutations

**Before:**
```tsx
'use client';

export function ContactForm() {
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={pending}>
        {pending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

**After:**
```tsx
// actions/contact.ts
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const data = schema.parse({
    email: formData.get('email'),
    message: formData.get('message'),
  });

  await db.contact.create({ data });
  revalidatePath('/contact');
}

// components/ContactForm.tsx
import { submitContact } from '@/actions/contact';

export function ContactForm() {
  return (
    <form action={submitContact}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Sending...' : 'Send'}
    </button>
  );
}
```

**When to apply:**
- Form submission doesn't need client-side validation beyond HTML5
- Action is a simple database mutation
- Progressive enhancement desired (works without JS)
- Reducing client-side state management

---

## Related Resources

- Martin Fowler's Refactoring Catalog: https://refactoring.com/catalog/
- "Refactoring" by Martin Fowler (2nd Edition)
- "Clean Code" by Robert C. Martin
- React Documentation: https://react.dev/learn/sharing-state-between-components
- Next.js App Router: https://nextjs.org/docs/app
