---
title: Trade on Twilight
sidebar_position: 4
---

# How to Trade on the Twilight DEX

Twilight is a privacy-preserving inverse perpetual DEX that enables users to trade BTC with leverage while keeping their positions confidential.  
All trades are performed using encrypted subaccounts to ensure private settlement and execution.

**Video Tutorial:** [Watch Here](https://drive.google.com/file/d/1sp7TFu8ovId34boT6QxlMjyWqGVu_SpM/view)

---

## Prerequisites

Before trading on the DEX, ensure you have:

- **NYKS Tokens**: Required for transaction fees on the Twilight Testnet
- **SATS Balance**: Available in your Trading Account (Subaccount) for trading
- **Subaccount**: A dedicated Trading Account for trading operations

> 💡 New users can:
>
> - Obtain NYKS and SATS tokens from the [Faucet](https://frontend.twilight.rest/faucet)
> - Set up Trading Accounts using the [Wallet Guide](wallet.md)

> ⚠️ **Note**: Currently, only Testnet trading is supported. All operations are performed on the Twilight Testnet using test tokens.

---

## Subaccount Management

> ⚠️ **Important**: Each Subaccount becomes locked when a position is open.  
> To maintain flexibility and trade efficiently, create a separate Subaccount for each position.

---

## Connect Your Wallet

Before initiating any trading activity, ensure that your **Keplr wallet** is connected to the Twilight frontend.  
Click the wallet icon in the top-right corner of the interface and approve the connection request.

You must be connected for Subaccounts, balances, and trading actions to function correctly.

---

## Opening a Market Order

### Step 1: Access the Trading Interface

1. Navigate to the **Trade** tab in the top navigation bar
2. Select your Trading Account from the dropdown menu in the top-right corner
   ![Trading Account Selection](/images/18.png)

### Step 2: Configure Your Order

1. Locate the **Orders** panel on the right side of the interface
   ![Orders Panel](/images/19.png)

2. Set your trading parameters:

   - **Amount**: The full balance of your selected account will be used
   - **Leverage**: Choose your desired leverage multiplier
     ![Trading Parameters](/images/20.png)

   > ⚠️ **Important**:
   >
   > - Only full account balance orders are supported
   > - For trading with different amounts, create a new Trading Account via the [Wallet section](#wallet)

### Step 3: Execute the Trade

1. Click either **Buy** or **Sell** to create your order
2. Confirm the transaction when prompted
   ![Order Confirmation](/images/21.png)

### Step 4: Monitor Your Position

- Track your open positions in the **Details** panel under **My Trades**
- View order status, P&L, and other trade information
  ![Position Details](/images/order-info.png)

---

## Closing a Market Order

### Step 1: Access Your Positions

1. Navigate to the **Details** panel on the trading interface
2. Open the **My Trades** section to view your active positions
   ![My Trades Panel](/images/order-info.png)

### Step 2: Close the Position

1. Locate the position you want to close
2. Click the **Close** button next to the corresponding position
3. A notification will appear to confirm that your position has been closed
   ![Position Closing](/images/close-order.png)

### Step 3: Settlement

- The position will be automatically closed.
- Any profit or loss (PnL) will be settled back to your original Trading Account
- You can verify the updated balance in your Trading Account

> 💡 **Note**: The settlement occurs automatically to the same Trading Account that was used to open the position

---

## Placing a Limit Order

Limit orders allow you to specify the price at which you want to buy or sell BTC on the Twilight exchange. The order will remain open until it is either filled at your target price or cancelled.

### Step 1: Access the Trading Interface

1. Navigate to the **Trade** tab in the top navigation bar
2. Select your Trading Account from the dropdown menu in the top-right corner
   ![Trading Account Selection](/images/18.png)

### Step 2: Configure the Limit Order

1. Locate the **Orders** panel on the right side
2. Switch from **Market** to **Limit** on the panel
   ![Order Type Selection](/images/limit-order-select.png)

3. Set your trading parameters:
   - **Amount**: The full balance of your selected account will be used
   - **Limit Price**: Your desired execution price
   - **Leverage**: Choose your desired leverage multiplier
     ![Limit Order Parameters](/images/limit-order-details.png)

### Step 3: Place the Order

1. Click either **Buy** or **Sell** to create your limit order

### Step 4: Monitor Your Order

- Track your pending orders in the **Details → My Trades** section
- The order will remain active until either:
  - It is matched at your specified price
  - You manually cancel it
    ![Order Status](/images/limit-order-my-trades.png)

> 📌 You can cancel an open limit order at any time by clicking the **Cancel** button in the My Trades panel.

> ⚠️ **Important**:
>
> - Only full account balance orders are supported
> - Ensure sufficient collateral is available in your Trading Account
> - For trading with different amounts, create a new Trading Account via the [Wallet section](#wallet)

---

For wallet-related operations such as account creation and transfers, please refer to the [Wallet Guide](wallet.md).

---

## Related: The Twilight Settlement Pool

All trades on the Twilight DEX settle against a shared liquidity pool on the Twilight Testnet.  
This pool is funded by users who lend their SATS (BTC) to earn yield from liquidation fees, trading fees, and funding rates.

If you're interested in becoming a liquidity provider, see the [Lend to Twilight Pool](lend-to-twilight-pool.md) guide for details.

---
