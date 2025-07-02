# DEX Operations

**Video Tutorial:** [Watch Here](https://drive.google.com/file/d/1sp7TFu8ovId34boT6QxlMjyWqGVu_SpM/view)

---

## Prerequisites

1. Completed the [BTC deposit guide](https://twilight-pool.vercel.app).
2. Have Nyks tokens in your wallet.
3. Deposited BTC into your Twilight wallet.

---

## Create Subaccounts

Creating separate Subaccounts for each trade is highly recommended, as active orders render the account unusable. Note that exchange operations can also be conducted on the “Trading Account”.

1. Connect your Keplr wallet from the top-right corner of the navigation bar.
2. Once connected, select **Manage Subaccounts** from the Trading Account dropdown menu.

   ![Manage Subaccounts Screenshot](/images/9.png)

3. In the accounts dialog, click on **New** to create a new Subaccount.

   ![New Subaccount Screenshot](/images/10.png)

4. Enter a name for your Subaccount and click **Create**.
   ![Create Subaccount Screenshot](/images/11.png)

Once the new Subaccount is created, you can now transfer BTC into it.

![Create Subaccount Screenshot](/images/12.png)

---

## Funding to Trading Transfer

The Subaccount can now be funded with SATS using the Funding → Trading account transfer menu:

1. Hover over the **Trade** menu on the navigation bar and click on **Wallet**.
   ![Wallet Page Screenshot](/images/13.png)
2. Under the **Funding** section, click the highlighted button to open the transfer dialog.
   ![Funding Transfer Dialog Screenshot](/images/14.png)
3. In the dialog, select your Subaccount from the **Account To** dropdown.
   ![Select Subaccount Screenshot](/images/15.png)
4. Enter the amount of BTC to transfer and click **Transfer**.
5. Approve the request to confirm the transaction.
   ![Transfer Approval Screenshot](/images/16.png)

After approval, the transferred amount will be reflected in your Subaccount.

![Updated Balance Screenshot](/images/17.png)

---

## Opening a Market Order

1. On the home page, select an account with a balance (e.g., "Subaccount 1").
   ![Select Subaccount Screenshot](/images/18.png)
2. Place an order in the **Orders** panel (typically on the right side).
   ![Order Panel Screenshot](/images/19.png)
3. Enter the amount in BTC and set the leverage.
   ![Set Amount & Leverage Screenshot](/images/20.png)
4. Select **Buy** or **Sell** to create the order. A notification will appear upon success.
   ![Order Success Notification Screenshot](/images/21.png)
5. View your open orders in the **Orderbook** panel under **My Trades**.
   ![My Trades Screenshot](/images/22.png)

---

## Closing a Market Order

1. Go to the **Orderbook** panel on the home page and open **My Trades**.
   ![My Trades Panel Screenshot](/images/22.png)
2. Click **Close** next to the order you wish to close. A notification confirms the closure.
   ![Close Order Notification Screenshot](/images/23.png)

---

## Trading to Trading Transfer

This operation allows private BTC transfers among Subaccounts:

1. Create a new Subaccount for the BTC recipient.
2. Navigate to **Wallet** under the **Trade** menu.
   ![Wallet Screenshot](/images/13.png)
3. In the **Trading** section, click the button to open the transfer dialog.
   ![Trading Transfer Dialog Screenshot](/images/24.png)
4. Select the source and destination Subaccounts, enter the transfer amount.
   ![Select Accounts Screenshot](/images/25.jpg)
5. Confirm the transfer. The amount will reflect in the destination Subaccount, and transaction details appear in **Account History**.
   ![Account History Screenshot](/images/30.jpg)

---

## Trading to Funding Transfer

This function returns BTC from Subaccounts to the Funding Account:

1. Access the **Wallet** page.
2. In the **Trading** section, click the transfer dialog.
3. In the dialog, choose **Trading to Funding**, select the Subaccount, and click **Transfer**.
4. The BTC will appear in the Funding account upon successful transfer.

---

For lending at the DEX, please refer to the [Lend to Twilight Pool](https://twilight-pool.vercel.app) guide.
