# ApexLedger Security Specification & Rules Architecture

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be read or written by the authenticated user whose `request.auth.uid == userId`.
2. **Transaction Ownership Invariant**: A transaction document at `/transactions/{transactionId}` must have `userId == request.auth.uid`. Cross-user inspection, modification, or deletion is strictly forbidden.
3. **Query Isolation Invariant**: All list queries against `/transactions`, `/budgets`, `/subscriptions`, `/bankConnections`, `/syncDevices`, and `/cloudBackups` must enforce `resource.data.userId == request.auth.uid`.
4. **Immutability of Ownership**: In updates to any record, `incoming().userId == existing().userId` is strictly enforced.
5. **Path Validation Guard**: All document IDs must satisfy `isValidId(id)` (`matches('^[a-zA-Z0-9_\\-]+$')` and size <= 128 chars).
6. **Payload Hardening**: String lengths, numeric boundaries, and key white-listing are enforced on every write operation.

## 2. The "Dirty Dozen" Payloads
These 12 payloads must return `PERMISSION_DENIED` under all conditions:

1. **Unauthenticated Read (`/transactions/tx_101`)**: Attempt to read without an auth token.
2. **Cross-Tenant Snoop (`/transactions/user2_tx`)**: User A attempts to read User B's transaction.
3. **Identity Spoof Creation (`/transactions/tx_spoof`)**: User A creates a transaction with `userId: "user_B"`.
4. **Ownership Hijack Update (`/budgets/b_101`)**: User A updates budget to set `userId: "user_A"` on User B's budget.
5. **ID Poisoning Attack (`/users/../../poison`)**: Document ID contains path traversal or invalid characters.
6. **Denial of Wallet Oversized String (`/transactions/tx_heavy`)**: Payload description exceeds 256 characters (e.g. 5000 bytes).
7. **Negative Budget Limit (`/budgets/b_neg`)**: Setting a negative or non-number monthly limit.
8. **Shadow Field Injection (`/users/u_101`)**: Writing an unauthorized field `isAdmin: true` into the user profile.
9. **List Scraping Without Ownership Filter (`/transactions`)**: Listing all transactions without filtering by authenticated `userId`.
10. **Tampered Backup Restore (`/cloudBackups/b_fake`)**: Attempting to insert a backup document owned by another user.
11. **Subscription Status Corruption (`/subscriptions/sub_1`)**: Injecting unauthorized state or invalid cycle type.
12. **Bank Connection Account Hijack (`/bankConnections/bc_1`)**: Updating bank connection mask to an unvalidated arbitrary payload.

## 3. Test Runner
Defined in `firestore.rules.test.ts` to assert that all 12 malicious requests fail with PERMISSION_DENIED.
