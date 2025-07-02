---
title: Connecting Keplr Wallet
sidebar_position: 2
---

# Connecting Keplr Wallet

> **Audience**: New users who want to interact with the Twilight.
>
> **Goal**: Install Keplr, add _Twilight Testnet_ to Keplr, and fund the wallet with test tokens using faucet.

---

## 1 Install the Keplr browser extension

1. Open your Chromium‑based browser (Chrome, Brave, Edge, etc.).
2. Visit the official Chrome Web Store listing → [https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap).
3. Click **Add to Chrome** ▸ **Add Extension**.

<!-- ![Install Keplr](/images/keplr-logo.png) -->

> _Tip: Keplr also provides a Firefox add‑on; steps are identical._

---

## 2 Connect Keplr from the Twilight frontend

1. Navigate to **[https://frontend.twilight.rest](https://frontend.twilight.rest)**.
2. Click **Connect Wallet** (top‑right).
3. A Keplr popup appears asking to _"Add Twilight Testnet"_.

   - Review the chain parameters (chain‑id, RPC, currency).
   - Click **Approve**.

![Approve Twilight Testnet](/images/keplr-approve-chain.png)

![Enable Twilight Chain](/images/keplr-approve-chain1.png)

> After approval Keplr automatically switches to _Twilight Testnet chain_.

---

## 3 Verify & manage chains in Keplr

1. Open the Keplr panel (click the extension icon).
2. Click the **Menu icon ☰**.
3. Select **Add/Remove Chain**.
4. In the search field type _Twilight Testnet_.
5. Ensure the radio button next to _Twilight Testnet_ is **checked** → click **Click**.

![Enable Twilight Chain](/images/keplr-manage-chain.png)

Your Keplr wallet is now ready to sign transactions.

---

## 4 Fund your wallet

1. Visit the [**Faucet**](https://frontend.twilight.rest/faucet) on the Twilight Frontend site.
2. Click **Connect Wallet** if your Keplr wallet is not already connected.
3. Press **Continue** and verify that your connected address matches your Twilight Testnet address.
4. Click **Get NYKS Tokens** to request 100,000 NYKS from the faucet.
5. Then, click **Register BTC Address** to generate and register a BTC public key.
   > ⚠️ Do not refresh the page during this step.
6. Approve the transaction in your Keplr wallet when prompted.
7. Once registration is complete, click **Get BTC Tokens** to receive your testnet BTC.

<img src="/images/nyks-faucet.png" alt="Faucet Request" class="enlarge-img" />

8. Navigate to the [**Wallet**](https://frontend.twilight.rest/wallet) page to view your BTC balance.  
   The tokens will appear under your **Funding Account**.

> Transfers are processed almost instantly—your testnet balances should update within a few seconds.

---

<!--
## 5 Next Steps

- Open a **trade order** and try a small inverse‑perp position.
- Provide liquidity with a **lend order** to earn funding fees. for lend order go to **[Lend Page](https://frontend.twilight.rest/lend)**

--- -->

### Troubleshooting

| Symptom                            | Fix                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------- |
| _Keplr popup does not appear_      | Disable popup blockers & retry **Connect Wallet**.                          |
| _Twilight Testnet not listed_      | Re‑invoke **Connect Wallet**; make sure you approved the add‑chain request. |
| _Faucet says “insufficient funds”_ | The faucet has rate limits—wait 10 minutes and retry.                       |

---

<!-- © Twilight Labs 2025 -->
