---
title: Market Maker 1.1
sidebar_position: 2
---

# Twilight Testnet Market Maker / Liquidity Provider Guide

_Version 1.4 · 17 Jul 2025 · For information purposes only._

---

## 1 | Motivation

This guide gives **Market Makers (MMs)/ Liquidity Providers (LPs)** the information needed to **connect, post capital, and optionally make markets** in Twilight’s **BTC-USD inverse-perpetual liquidity pool** on the **public testnet**.

It consolidates, in one place:

- **Integration & Connectivity:** Endpoints, auth, and data feeds required to monitor the pool and submit orders. (See §8, §9.)
- **Capital & Guard-Rails:** Minimum deposit, utilization thresholds, and top-up expectations that keep the pool margin-solvent. (See §4.)
- **Economic Model:** Fees, funding, liquidations, and how all flows accrue to the pooled capital base. (See §5.)
- **Operational Practices:** Monitoring, withdrawal guidance, and risk considerations for testnet participation. (See §6–§7, §10.)

**Participation is open and permissionless.** You may join as a **passive LP** (deposit SATS collateral and let trader activity drive returns) and/or as an **active trader / maker** (submit *limit orders* that execute against the oracle price; may qualify for fee discounts). Limit orders provide execution control (e.g., "buy if oracle mid ≤ X") but **do not create on-platform price discovery and do not increase pool collateral (TVL)**—only deposits do. See Design Primer below and §3, §5.4.

:::info Testnet Scope
All activity described here uses **test assets** (SATS) and **in-protocol accounting only**; no real BTC moves per trade in this environment. Parameters are *demonstration values* and will change prior to production. See §2 for details.
:::
---

:::info Twilight Execution Model – Read This First
Twilight’s perp venue is **oracle-priced** and **BTC-collateral only**. All executions occur **against the pooled BTC collateral at an external spot reference price**—currently **Binance mid**; a **multi-source weighted index** is in development. There is **no AMM curve, no user-to-user orderbook matching, and no on-platform price discovery**.

#### Key Implications
- **No AMM Slippage / Depth Curves:** Trades that pass risk checks clear at the oracle-derived price. Size does not move price; oracle integrity does.
- **Single-Asset Pool → No Impermanent Loss:** Pool holds BTC (SATS in testnet). There is no x*y=k exposure or paired-asset divergence.
- **“Limit Orders” Are Oracle Triggers:** We keep familiar limit semantics to reduce integration friction. A buy limit fills when *oracle mid ≤ limit*; a sell when *oracle mid ≥ limit*. Limits do **not** rest in a competitive orderbook and do **not** contribute liquidity depth.
- **Liquidity = Collateral Availability:** Capacity to absorb trader exposure depends on total deposited BTC `TVL` and real-time utilization `U`, not displayed book size.
- **Funding = Skew Compensation:** Because mark = oracle spot, funding is repurposed to compensate LPs for **directional inventory imbalances** created by trader flow (penalizes heavy one-sided positioning). See §5.2.
- **Units:** PnL and margin tracked in SATS (BTC units); trade notional computed in USD: `position_notional = initial_margin × leverage × mark_price_usd`. See §2.

#### Testnet Limits
To keep the demo stable, **per-order margin is capped < 0.10 BTC**. Production will support materially larger position sizes.

#### Roadmap
Upcoming releases target: (i) multi-venue price index + weightings, (ii) oracle freshness bands / circuit breakers, and (iii) a **Maker Stability Program** rewarding (1) sustained capital residency, (2) external hedge connectivity, and (3) inventory absorption at high utilization. Details forthcoming.
:::


## 2 | Platform Snapshot

**Chain / Execution**

- **Cosmos-SDK Chain (Nyks):** A Cosmos-SDK blockchain optimized for privacy-preserving, BTC-denominated DeFi applications.
- **Bulletproof-Shielded Transactions:** Twilight uses Bulletproofs to prove transaction correctness while keeping sensitive order and margin details confidential on-chain. See Security (§8.3) for the key & privacy model.

**Instrument**

- BTC‑USD _inverse_ perpetual (contract notional quoted in USD; PnL / margin tracked in BTC units).

**Collateral & Settlement**

- **Testnet Collateral: `SATS`** — BTC-denominated test asset (1 SATS = 1 satoshi = 1e-8 BTC) distributed via faucet. SATS has **no real economic value** and is **not redeemable for mainnet BTC** in this environment.
- **Accounting Units:** Pool deposits, trader margin, PnL, fees, and funding transfers are all tracked in SATS (displayed in BTC w/ 8 decimals in UI). Programmatic interfaces accept integer sats (chain denom: `sats`; see API docs §8).
- **Settlement Path (Testnet):** Trades settle entirely in protocol accounting; *no Bitcoin mainnet UTXOs or ERC-20 WBTC move when positions open/close*.
- **Production Path (Preview):** SATS is intended to map 1:1 to BTC custodied through **Boomerang**, Twilight’s native BTC→Nyks bridging architecture ([design abstract available](https://docs.twilight.org/boomerang/abstract); bridge not active in this testnet). Redemption mechanics and withdrawal timing will be specified pre-launch.
- **Per-Order Margin Cap (Testnet Soft Control):** To protect the demo pool, the relayer/API may reject orders whose posted margin exceeds **0.10 BTC equivalent**. This guard is **not protocol-enforced on chain** and will be lifted (or replaced with risk tiers) in production.


**Liquidity Pool Model**

Twilight aggregates all LP deposits into a **single BTC collateral pool**. Traders open (levered) BTC-USD inverse perp positions against that pool; required margin is locked in SATS, and the pool is the economic counterparty to trader PnL. There is **no AMM curve and no user-to-user matching**—pool solvency, not displayed depth, is the binding liquidity constraint.

**Capacity Control.** Available capacity is measured by utilization `U = TTM / TVL` (see §3). When utilization approaches the configured cap (`U_cap`), new position opens may be throttled and participating LPs are expected to top up collateral within the Top-Up SLA (see §4).

**Pool Accounting Flows.** Fees, skew-based funding (inventory compensation), liquidation proceeds, and any configured **haircut reserves** all accrue to or deduct from pool NAV. *Haircut* refers to a safety buffer the protocol (or relayer policy) withholds from “free” liquidity to absorb pending fees, unsettled PnL, or oracle/latency risk. Haircut parameters are **inactive / TBD** in the current testnet. Because the pool is single-asset BTC, *impermanent loss does not apply*; risk is driven by trader PnL volatility and directional skew. See §5 for economic flows.

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



