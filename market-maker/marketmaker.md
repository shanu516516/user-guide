---
title: Market Maker
sidebar_position: 1
---

# Twilight Testnet Market Maker / Liquidity Provider Guide

_Version 1.3 · 16 Jul 2025 · For information purposes only._

---

## 1 | Motivation

This document defines the **technical**, **operational**, and **economic** terms for desks that wish to act as **Market Makers (MMs) / Liquidity Providers (LPs)** on Twilight’s **BTC‑denominated inverse‑perpetual pool** during the public testnet.

Participation is open. Automated quoting / hedging bots are recommended; see onboarding steps below.

---

## 2 | Platform Snapshot

**Chain / Execution**

- **Cosmos‑SDK chain (Nyks):**
      > Nyks is a Cosmos-SDK-based blockchain optimized for privacy and BTC-denominated DeFi applications.
- **Bulletproof-Shielded Transactions:**  
      > Bulletproofs refer to cryptographic proofs enabling confidential and efficient validation of transactions without revealing specific order details (e.g., size or price) publicly on-chain. Twilight utilizes Bulletproof technology to shield orders, ensuring market participant privacy.

**Instrument**

- BTC‑USD _inverse_ perpetual (contract notional quoted in USD; PnL / margin tracked in BTC units).

**Collateral & Settlement**

- **Wrapped BTC (WBTC‑style Asset)** On testnet, represented by the SATS token (native Cosmos SDK asset distributed via faucet); in production, SATS will reflect BTC locked on Bitcoin via Twilight’s secure native BTC-to-Nyks bridging mechanism. 

- **All testnet settlement is in‑protocol accounting units** (no L1 BTC UTXO movement per trade during testnet).

**Liquidity Pool Model**

> Twilight's liquidity model employs a capital-backed pooled margin approach, dynamically aggregating liquidity provider deposits into a unified collateral pool. This pool efficiently backs trader positions, with liquidity availability precisely controlled through margin haircuts and utilization thresholds to robustly manage insolvency risks and ensure consistent market depth.

---

## 3 | Key Liquidity Concepts

Twilight testnet tracks four derived pool state variables; desks should monitor these to manage inventory and avoid trading halts.

| Term                    | Symbol   | Definition                                                            | Operational Use                                 |
| ----------------------- | -------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| **Total Pool Deposit**  | TVL      | Sum of all active LP deposits (BTC units) marked at par.              | Capacity ceiling reference.                     |
| **Total Trader Margin** | `TTM`    | BTC locked to margin outstanding trader exposure the pool is backing. | Drives utilization.                             |
| **Free Liquidity**      | `L_free` | `max(TVL - TTM, 0)` after haircuts + pending fees.                    | Available for new position opens & withdrawals. |
| **Utilization**         | `U`      | `TTM / TVL` (clamped 0→1).                                            | Spread throttle; breach triggers top‑up SLA.    |

**Breach Event:** `U >= U_cap` (see Guard‑Rails).\
**Net Exposure (Directional):** `Δ = long_notional - short_notional` (in BTC).

---

## 4 | Capital Commitment & Guard‑Rails (Testnet Policy)

These are _testnet demonstration_ values; production numbers will change.

| Parameter                      | Value                                | Definition / Measurement                                        | Action When Breached                             | Rationale                                          |
| ------------------------------ | ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Initial Deposit**            | **0.50 BTC** (wrapped)               | Minimum capital per participating MM to bootstrap pool depth.   | Must post before quoting.                        | Ensure visible depth w/ faucet coins.              |
| **Utilization Cap (**\`\`**)** | **90%**                              | `U = TTM /TVL` Evaluated each block.                            | New opens throttled; MM top‑up SLA clock starts. | Prevents full depletion; leaves withdrawal buffer. |
| **Top‑Up SLA**                 | **≤ 5 min** from breach block time   | Add collateral _or_ reduce exposure to push `U < U_cap`.        | Desk flagged if missed; quotes may be disabled.  | Demonstrates auto‑replenish bots.                  |
|                                |                                      |                                                                 |                                                  |                                                    |
| **Capital Uptime Target**      | **≥99.5%** (best‑effort; metric TBD) | % of time pool reports `U < U_cap` _and_ API heartbeat healthy. | Informational only (v1); scoring later.          | Predictable taker depth.                           |

> **Note:** “Capital uptime” telemetry is not enforced in current testnet build; metrics API placeholder only (see §10).

---

## 5 | Economic Flows

All _economic flows close into the pool_ (no separate insurance / treasury split in current testnet). Future releases may carve out dedicated insurance tranches.

### 5.1 Fee Model

- **Taker Fee:** Standard trade fee (bps) charged on notional; 100% flows to pool NAV.
- **Maker Fee Discount:** Makers pay a _reduced_ fee rate when quotes qualify (see §5.4). There is **no external rebate token**; the discount simply means _less fee is debited_ and therefore _more PnL retained_ by the maker. All collected fees still accrue to the pool.

### 5.2 Funding Transfers

Funding aligns pool mark to external index and rebalances directional inventory pressure.

Let:

- `skew = ((long_notional - short_notional) / total_open_notional)²` (signed, −1→+1).
- `psy` = funding coefficient (per‑hour scalar; testnet default 1).
- **Hourly Funding Rate** = `rate =skew/(psy*8)`

**Positive rate ⇒ Longs pay Shorts/Pool.**
**Negative rate ⇒ Shorts pay Longs/Pool.**

Payments are accrued each funding interval (default hourly) and settled in wrapped BTC against trader margin balances; net effect adjusts pool NAV.

### 5.3 Liquidations

- Under‑margined trader positions are liquidated by protocol keepers / external actors.

- If the market price reaches a trader's liquidation price, their positions will be automatically liquidated by protocol keepers.

- **Liquidation proceeds accrue 100% to the pool.**


### 5.4 Maker Fee Discount Program (Quote Quality)

Makers receive discounted fees on filled size that meets **all** of the following at the _time of quote entry_:

1. **Inside Spread:** Quote price within ±0.25% of current oracle mid.

2. **Resting Latency:** Quote must remain live ≥200ms before cancel/replace to be eligible (anti‑flicker).

3. **Eligible Sides:** Both bid and ask count independently; one‑sided quoting permitted but only filled eligible orders receive discount.

---

## 6 | Operational Protections & Risk Controls

| Control                    | Scope           | Current Testnet Behavior                                                                                          | Notes                                                 |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Isolated Trader Margin** | Trader accounts | Individual positions cannot be topped up _post_ margin breach auto‑liquidation event (isolation once opened).     | Reduces cascading contagion; simplifies PnL.          |
| **Pool Capital Top‑Ups**   | LP deposits     | Permitted anytime; required under Top‑Up SLA after utilization breach.                                            | Distinct from trader margin (no contradiction).       |
|                            |                 |                                                                                                                   |                                                       |
| **Withdrawal Notice**      | LP exits        | 24h notice recommended (not enforced yet) to stage orderly release.                                               | Prevents liquidity cliffs if large LP exits suddenly. |
| **Oracle Integrity**       | Pricing         | Binance mid‑price w/ 0.5s tick in current build; production will migrate to multi‑venue index + confidence bands. | Single‑venue risk acknowledged.                       |

---

## 7 | Risk Disclosure

Participants should consider the following risks:

- **Smart Contract Risks:** Potential vulnerabilities in deployed code.
- **Liquidity Risk:** Pool liquidity constraints affecting order fulfillment.
- **Settlement Risks:** Issues in finalizing trades or withdrawals.
- **Oracle Risks:** Single-source dependency on Binance mid-price (current build).
- **Liquidation Risks:** Positions risk liquidation due to volatility and margin management.
- **Technical & Operational Risk:** Risk of downtime and network instability on testnet.


---

## 8 | Connectivity & Tooling

### 8.1 Endpoints (Testnet)

>

| Service      | Transport               | Path Sketch                                                                        | Auth                       |
| ------------ | ----------------------- | ---------------------------------------------------------------------------------- | -------------------------- |
| RPC          | JSON‑RPC 2.0 over HTTPS | [https://relayer.twilight.rest/clientapi](https://relayer.twilight.rest/clientapi) | API key header             |
|              |                         |                                                                                    |                            |
| Websocket    | WSS                     | Oracle feed, live trades, utilization stream wss\://relayer.twilight.rest/ws       | API key query param        |
| REST Metrics | HTTPS                   | [https://relayer.twilight.rest/api](https://relayer.twilight.rest/api)             | Public read (rate‑limited) |

**Docs:** See _Twilight API Docs_ for schema definitions and example payloads. (Reference: `docs.twilight.rest`).

### 8.2 SDKs & Clients

- **Rust**: [`twilight_client_sdk`](https://github.com/twilight-project/twilight-client-sdk.git) (async; feature‑gated for signing).
- **TypeScript**: Lightweight client; browser + Node builds.
- **Rust**: Reference MM bot demonstrating: quote placement using [`twilight_client_sdk`](https://github.com/twilight-project/twilight-client-sdk/tree/agent-bot)

### 8.3 Security & Key Management

- Key Scheme: secp256k1 is used for transaction signing (Cosmos SDK standard), while Curve25519 underpins the cryptographic operations behind Bulletproofs, such as encrypting/decrypting margin positions. Support for HSM/KMS integration via an external signer interface will be added in a future release.&#x20;
- Order Confidentiality: Bulletproof-shielded order submission is enabled by default for maximum privacy.&#x20;
- A user-selectable toggle at the session handshake to disable shielding will be introduced in a subsequent update.&#x20;

---

## 9 | On‑Boarding Workflow (≈30 min)

1. **Request Faucet Funds** – [https://frontend.twilight.rest](https://frontend.twilight.rest)
2. **On-Boardind Guide** - [https://user-guide.docs.twilight.rest/docs](https://user-guide.docs.twilight.rest/docs)

---

## 10 | Metrics & Monitoring

> Uptime SLA scoring is **not enforced** in the current testnet; telemetry endpoints exist for experimentation.

| Metric          | Method           | Units | Notes                                          |
| --------------- | ---------------- | ----- | ---------------------------------------------- |
| PoolShare price | pool_share_value | -     | poolshares in 1 BTC                            |
| Current Price   | btc_usd_price    | USD   |                                                |
| Pool Deposits   | lend_pool_info   | BTC   | Total Locked Value(total_locked_value) in pool |
| Funding Rate    | get_funding_rate | %/hr  | Next interval projection.                      |

Sample pull:

```bash
curl -sS -X POST https://relayer.twilight.rest/api \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"jsonrpc":"2.0","method":"lend_pool_info","params":null,"id":123}' | jq
```

---

## 11 | Indicative Timeline (Testnet Cohort)

| Milestone               | Target     | Notes                                   |
| ----------------------- | ---------- | --------------------------------------- |
| Testnet v1.0.0 Launched | **Day 0**  |                                         |
| Connectivity check      | **Day 1**  | Confirm RPC / WS streaming.             |
| KPI dry‑run review      | **Day 5**  | Validate quoting, utilization behavior. |
| Feedback                | **Day 10** | Collect MM feedback                     |
| Testnet v1.1.0          | **Day 20** | issues and feedback incorporated        |
|                         |            |                                         |

---

## 12 | Contacts

| Role              | Contact | Notes                        |
| ----------------- | ------- | ---------------------------- |
| Programme Lead    | _TBD_   | Coordination, capital ops.   |
| Technical Support | _TBD_   | API, integration, debugging. |
|                   |         |                              |

---

## 13 | Appendix – Formal Definitions & Formulas

### 13.1 Pool Accounting

```
D  = Σ active_LP_deposits_btc
M_enc = Σ margin_locked_for_open_positions_btc
L_free = max(D - M_enc, 0)
U = M_enc / D              # if D > 0 else 0
```

### 13.2 Breach Logic

```
if U >= U_cap:
    emit UtilisationBreach(breach_block_height, U)
    start TopUpSLA_timer
```

```

```

### 13.3 Funding

```
skew = ((long_notional - short_notional) / total_open_notional))^2
rate = skew/(psy*8)      # per hour
sign = Long>short ->+ve Short>long ->-ve
payment = rate * position_notional * (sign)
# +ve rate: longs pay; -ve: shorts pay.
```

