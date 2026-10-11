# Security Specification: Tkash Firestore Rules

## 1. Data Invariants
1. **User Identity Invariant**: A user can only create or update their own user record where `userId == request.auth.uid`.
2. **Immutability of Ownership**: `userId` in `investments` and `transactions` cannot be modified after document creation.
3. **Transaction State Integrity**: Transactions and investments cannot have negative amounts.
4. **ID Format Enforcement**: All document IDs and path variables must adhere to `^[a-zA-Z0-9_\-]+$` and be <= 128 characters.
5. **No Blind Blanket Reads**: Read operations on user data, investments, and transactions require authentication and ownership (`resource.data.userId == request.auth.uid`).

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Payload 1 (Ghost User ID Spoof)**: Unauthenticated client creates `/users/target_user` with spoofed ID.
2. **Payload 2 (Balance Inflation Write)**: User B updates `/users/userA` balance to 9999999.
3. **Payload 3 (Oversized Document Attack)**: User injects 2MB payload into `avatarUrl` or `details`.
4. **Payload 4 (Negative Investment)**: Creating an investment with `investedAmount: -500`.
5. **Payload 5 (Negative Transaction)**: Creating a transaction with `amount: -1000`.
6. **Payload 6 (Foreign Investment Creation)**: User A creates investment with `userId: "userB"`.
7. **Payload 7 (Foreign Investment Query)**: User A queries `investments` where `userId == "userB"`.
8. **Payload 8 (Invalid ID Injection)**: Document ID containing non-alphanumeric characters like `../admin/exploit`.
9. **Payload 9 (Terminal State Mutation)**: Attempting to modify an investment once `status: "completed"`.
10. **Payload 10 (Transaction Reference Modification)**: Modifying `reference` or `userId` on existing transaction.
11. **Payload 11 (Unauthenticated STK Record Overwrite)**: Unauthenticated user modifies an `mpesa_records` log.
12. **Payload 12 (Foreign Transaction Snooping)**: User B reads `/transactions/tx_userA`.

## 3. Security Test Runner (Phase 0 TDD)
See `firestore.rules.test.ts` for full implementation verifying all 12 payloads return `PERMISSION_DENIED`.
