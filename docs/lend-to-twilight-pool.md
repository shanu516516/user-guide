---
title: Lending Pool
sidebar_position: 5
---

# How to Lend for the Twilight Liquidity Pool

## About the Twilight Pool

The Twilight Pool acts as the central liquidity layer for the Twilight perpetual exchange. When traders open and settle positions, they interact with this pool — making it the counterparty for all leveraged trades.

The pool earns protocol revenue from:

- **Liquidations** of undercollateralized positions
- **Exchange trading fees**
- A share of the **funding rate** on open positions

By lending SATS (BTC) into the pool, liquidity providers contribute to the exchange's trading depth while earning a portion of this revenue.

Twilight enables BTC holders to earn competitive on-chain yield through a secure and privacy-preserving lending mechanism.

> 📌 Note: All lending operations are executed privately using encrypted Subaccounts, ensuring financial privacy for institutional participants.

---

## Prerequisites

Before lending SATS to the Twilight Pool, ensure you have:

- **NYKS Tokens**: Required for transaction fees on the Twilight testnet
- **SATS Balance**: Available in your Trading Account (Subaccount) for lending
- **Subaccount**: A dedicated Trading Account for lending operations

> 💡 New users can:
>
> - Obtain NYKS and SATS tokens from the [Faucet](https://frontend.twilight.rest/faucet)
> - Set up Trading Accounts in the [Create Subaccounts](#create-subaccounts) section

---

## Subaccount Management

> ⚠️ **Important**: Create a separate Subaccount for each lending operation. Accounts with active orders become locked and cannot be used for other operations until the lending position is closed.

---

## Connect Your Wallet

Before initiating any trading activity, ensure that your **Keplr wallet** is connected to the Twilight frontend.  
Click the wallet icon in the top-right corner of the interface and approve the connection request.

You must be connected for Subaccounts, balances, and trading actions to function correctly.

---

## Lend Operation

Follow the steps below to open the Lend interface and execute your lending transaction:

### Step 1: Navigate to the Lend Interface

1. Click the **"Lend"** tab in the top navigation bar. This opens the lending dashboard.  
   ![Lend Option](/images/lend-dashboard.png)

2. On the Lend page, click the **"Lend"** button to open a lend form.  
   ![Lend Page](/images/28.jpg)

---

### Step 2: Execute the Lending Transaction

1. On the lending form:

   - Select the Subaccount you wish to lend from using the **"Account From"** dropdown.
   - Enter the amount of SATS to lend.
   - Click **"Deposit"** to initiate the transaction.  
     ![Lend Form](/images/27.jpg)

2. Sign and confirm the transaction using your connected wallet.

3. Once confirmed, the lent amount will be displayed under the **"Loan"** section.  
   ![Loan Section](/images/loan.png)

> ✅ Your funds are now earning yield in the Twilight Pool.

---

## Redeem Funds

If you wish to withdraw your lent SATS from the Twilight Pool, follow the steps below to redeem your funds.

### Step 1: Open the Redeem Interface

1. Go to the **Lend** tab from the top navigation bar.
2. Locate the **"Loan"** section showing your active lending positions.
3. Click the **"Redeem"** button next to the corresponding Subaccount.  
   ![Redeem Button](/images/loan.png)

---

Once confirmed, your SATS will be returned to the same Subaccount from which they were lent. The updated balance will be visible on the wallet page.

> 🔁 You can now reuse these funds to open new trades or repeat the lending process.
