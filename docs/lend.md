---
title: Lending Pool
sidebar_position: 5
---

# How to Lend for the Twilight Liquidity Pool

The Twilight Pool serves as the central liquidity layer for Twilight’s inverse perpetual protocol. Traders interact directly with this pool when opening and settling positions, making it the counterparty to all leveraged trades.

The pool earns protocol revenue from:

- **Liquidations** of undercollateralized positions
- **Trading fees**
- A share of the **funding fee** on open positions

By lending BTC into the pool, liquidity providers enhance protocol liquidity while earning a share of the generated revenue.

Twilight enables BTC holders to earn competitive on-chain yield through a secure and privacy-preserving lending mechanism.

> 📌 Note: All lending operations are executed privately using encrypted Subaccounts, ensuring financial privacy for institutional participants.

---

## Prerequisites

Before lending BTC to the Twilight Pool, ensure you have:

- **NYKS Tokens**: Required for transaction fees on the Twilight testnet
- **BTC Balance**: Available in your Trading Account (Subaccount) for lending
- **Subaccount**: A dedicated Trading Account for lending operations

> 💡 New users can:
>
> - Obtain NYKS tokens and BTC balance from the [Faucet](https://frontend.twilight.rest/faucet)
> - Set up Trading Accounts in the [Create Subaccounts](/docs/wallet#create-subaccounts) section

---

## Subaccount Management

> ⚠️ **Important**: Create a separate Subaccount for each lending operation. Accounts with active orders become locked and cannot be used for other operations until the lending position is closed.

---

## Connect Your Wallet

Before initiating any lending activity, ensure that your **Keplr wallet** is connected to the Twilight frontend.  
Click the **Connect Wallet** in the top-right corner of the interface and approve the connection request.

---

## Add Funds
Follow the step by step process on the [testnet faucet](https://frontend.twilight.rest/faucet), to add funds to your wallet.

## Lend Operation
Our Lend/Redeem operation is performed on subaccounts. A few points of interest before we explain the process
1. You can create as many subaccounts as you want.
2. When you lend funds the operation is performed on the complete subaccount, meaning all the funds in that account are now lent. you cannot lend partial amount.
3. when you redeem the funds are moved back to the same subaccount.

Follow the steps below to open the [Lend interface](https://frontend.twilight.rest/lend) and execute your lending transaction:

### Step 1: Create Subaccount and transfer funds

1. First Create a Subaccount, click on the Trading Account button towards the top right of the home page.
<img src="/images/subaccount.png" alt="Lend Option" class="enlarge-img-70" />
<img src="/images/newSubaccount.png" alt="Lend Option" class="enlarge-img-70" />

2. Then go to the [wallet](https://frontend.twilight.rest/wallet) page and move funds from the trading account to the new subaccount (classified as funding accounts).
<img src="/images/transfer.png" alt="Lend Option" class="enlarge-img-70" />

### Step 2: Navigate to the Lend Interface
1. Click the **"[Lend](https://frontend.twilight.rest/lend)"** tab in the top navigation bar. This opens the lending dashboard.  
   <img src="/images/.png" alt="Lend Option" class="enlarge-img-70" />

2. On the Lend page, click the **"Lend"** button to open a lend form.  
   <img src="/images/28.jpg" alt="Lend Page" class="enlarge-img-80" />

---

### Step 3: Execute the Lending Transaction
1. On the lending form:

   - Select the Subaccount you wish to lend from using the **"Account From"** dropdown.
   - Enter the amount of BTC to lend.
   - Click **"Deposit"** to initiate the transaction.  
     ![Lend Form](/images/27.jpg)

2. Once confirmed, the lent amount will be displayed under the **"Loan"** section.  
   <img src="/images/loan.png" alt="Redeem Button" class="enlarge-img" />

> ✅ Your funds are now earning yield in the Twilight Pool.

---

## Redeem Funds

If you wish to withdraw your lent BTC from the Twilight Pool, follow the steps below to redeem your funds.

### Step 1: Open the Redeem Interface

1. Go to the **Lend** tab from the top navigation bar.
2. Locate the **"Loan"** section showing your active lending positions.
3. Click the **"Redeem"** button  
   <img src="/images/loan.png" alt="Redeem Button" class="enlarge-img" />

Once confirmed, your BTC will be returned to the same account from which they were lent. The updated balance will be visible on the wallet page.

> 🔁 You can now reuse these funds to open new trades or repeat the lending process.

---
