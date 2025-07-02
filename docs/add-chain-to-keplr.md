# Connecting Keplr Wallet

> **Audience**: New users who want to interact with the Twilight exchange on Nyks test‑net.
>
> **Goal**: Install Keplr, add _Twilight Testnet_ to Keplr, and fund the wallet with NYKS test tokens via the faucet.

---

## 1 Install the Keplr browser extension

1. Open your Chromium‑based browser (Chrome, Brave, Edge, etc.).
2. Visit the official Chrome Web Store listing → [https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap).
3. Click **Add to Chrome** ▸ **Add Extension**.

<!-- ![Install Keplr](/images/keplr-logo.png) -->

> _Tip: Keplr also provides a Firefox add‑on; steps are identical._

---

## 2 Connect Keplr from the Twilight front‑end

1. Navigate to **[https://frontend.twilight.rest](https://frontend.twilight.rest)**.
2. Click **Connect Wallet** (top‑right).
3. A Keplr popup appears asking to _"Add Twilight Testnet"_.

   - Review the chain parameters (chain‑id, RPC, currency).
   - Click **Approve**.

![Approve Twilight Testnet](/images/keplr-approve-chain.png)

![Enable Twilight Chain](/images/keplr-approve-chain1.png)

> After approval Keplr automatically switches to _Twilight Chain_.

---

## 3 Verify & manage chains in Keplr

1. Open the Keplr panel (click the extension icon).
2. Click the **gear icon ⚙︎ → Settings**.
3. Select **Add & Remove Chain**.
4. In the search field type **“Twilight Testnet”**.
5. Ensure the radio button next to _Twilight Testnet_ is **checked** → click **Click**.

![Enable Twilight Chain](/images/keplr-manage-chain.png)

Your Keplr wallet is now ready to sign transactions on Twilight.

---

## 4 Fund your wallet with NYKS test tokens

1. Back on the Twilight site open **[Faucet](https://frontend.twilight.rest/faucet)**.
2. Click **Connect Wallet** if you are not already connected.
3. Press **Continue**, make sure your twilight public address in same from wallet
4. Press **Get NYKS Tokens** to request 100,000 NYKS from the faucet.
5. Now, press **Register BTC Address** to register randomly generate btc public address. Make sure not to refresh the page
6. Approve the faucet transaction in Keplr.
7. Press Get BTC Tokens

![Faucet Request](/images/nyks-faucet.png)

8. Now go to **[Wallet](https://frontend.twilight.rest/wallet)** page to check your BTC tokens. The tokens are reflected in funding account.

> Token transfers are near‑instant; your NYKS balance refreshes in seconds.

---

## 5 Next Steps

- Open a **trade ticket** and try a small inverse‑perp position.
- Provide liquidity with a **lend order** to earn funding fees. for lend order go to **[Lend Page](https://frontend.twilight.rest/lend)**

---

### Troubleshooting

| Symptom                            | Fix                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------- |
| _Keplr popup does not appear_      | Disable popup blockers & retry **Connect Wallet**.                          |
| _Twilight Testnet not listed_      | Re‑invoke **Connect Wallet**; make sure you approved the add‑chain request. |
| _Faucet says “insufficient funds”_ | The faucet has rate limits—wait 10 minutes and retry.                       |

---

© Twilight Labs 2025
