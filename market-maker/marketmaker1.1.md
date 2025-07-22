---
title: Testnet MM and LP Guide
sidebar_position: 2
---

# Twilight Testnet Market Maker / Liquidity Provider Guide

_Testnet Version 1.0 · 20 Jul 2025 · For information purposes only._

---

## 1 | Motivation

This guide gives **Market Makers (MMs)/ Liquidity Providers (LPs)** the information needed to **connect, post capital, and optionally make markets** in Twilight’s **BTC-USD inverse-perpetual liquidity pool** on the **public testnet**.

It consolidates, in one place:

- **Integration & Connectivity:** Endpoints, auth, and data feeds required to monitor the pool and submit orders. (See [§8](#8--connectivity--tooling), [§9](#9--on-boarding-workflow-30-min).)
- **Capital & Guard-Rails:** Minimum deposit, utilization thresholds, and top-up expectations that keep the pool margin-solvent. (See [§4](#4--capital-commitment--guard-rails-testnet-policy).)
- **Economic Model:** Fees, funding, liquidations, and how all flows accrue to the pooled capital base. (See [§5](#5--economic-flows).)
- **Operational Practices:** Monitoring, withdrawal guidance, and risk considerations for testnet participation. (See [§6](#6--operational-protections--risk-controls), [§7](#7--risk-disclosure), [§10](#10--metrics--monitoring).)

**Participation is open and permissionless.** You may join as a **passive LP** (deposit SATS collateral and let trader activity drive returns) and/or as an **active trader / maker** (submit *limit orders* that execute against the oracle price; may qualify for fee discounts). Limit orders provide execution control (e.g., "buy if oracle mid ≤ X") but **do not create on-platform price discovery and do not increase pool collateral (TVL)**—only deposits do. See Design Primer below and [§3](#3--key-liquidity-concepts), [§5.4](#54-maker-fee-discount-program).

:::info Testnet Scope
All activity described here uses **test assets** (SATS) and **in-protocol accounting only**; no real BTC moves per trade in this environment. Parameters are *demonstration values* and will change prior to production. See §2 for details.
:::
---

:::info Twilight Execution Model – Read This First
Twilight’s perp Venue is **oracle-priced** and **BTC-collateral only**. All executions occur **against the pooled BTC collateral at an external spot reference price**—currently **Binance mid**; a **multi-source weighted index** is in development. There is **no AMM curve, no user-to-user orderbook matching, and no on-platform price discovery**.

#### Key Implications
- **No AMM Slippage / Depth Curves:** Trades that pass risk checks clear at the oracle-derived price. Size does not move price; oracle integrity does.
- **Single-Asset Pool → No Impermanent Loss:** Pool holds BTC (SATS in testnet). There is no x*y=k exposure or paired-asset divergence.
- **“Limit Orders” Are Oracle Triggers:** We keep familiar limit semantics to reduce integration friction. A buy limit fills when *oracle mid ≤ limit*; a sell when *oracle mid ≥ limit*. Limits do **not** rest in a competitive orderbook and do **not** contribute liquidity depth.
- **Liquidity = Collateral Availability:** Capacity to absorb trader exposure depends on total deposited BTC `TVL` and real-time utilization `U`, not displayed book size.
- **Funding = Skew Compensation:** Because mark = oracle spot, funding is repurposed to compensate LPs for **directional inventory imbalances** created by trader flow (penalizes heavy one-sided positioning). See [§5.2](#52-funding-transfers).
- **Units:** PnL and margin tracked in SATS (BTC units); trade notional computed in USD: `position_notional = initial_margin × leverage × mark_price_usd`. See §2.

#### Testnet Limits
To keep the demo stable, **per-order margin is capped < 0.10 BTC**. Production will support materially larger position sizes.

#### Roadmap
Upcoming releases target: (i) multi-venue price index + weightings, (ii) oracle freshness bands / circuit breakers, and (iii) a **Maker Stability Program** rewarding (1) sustained capital residency, (2) external hedge connectivity, and (3) inventory absorption at high utilization. Details forthcoming.
:::


## 2 | Platform Snapshot

**Chain / Execution**

- **Cosmos-SDK Chain (Nyks):** A Cosmos-SDK blockchain optimized for privacy-preserving, BTC-denominated DeFi applications.
- **Bulletproof-Shielded Transactions:** Twilight uses Bulletproofs to prove transaction correctness while keeping sensitive order and margin details confidential on-chain.

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

**Capacity Control.** Available capacity is measured by utilization `U = TTM / TVL` (see [§3](#3--key-liquidity-concepts)). When utilization approaches the configured cap (`U_cap`), new position opens may be throttled and participating LPs are expected to top up collateral within the Top-Up SLA (see [§4](#4--capital-commitment--guard-rails-testnet-policy).)

**Pool Accounting Flows.** Fees, skew-based funding (inventory compensation), liquidation proceeds, and any configured **haircut reserves** all accrue to or deduct from pool NAV. *Haircut* refers to a safety buffer the protocol (or relayer policy) withholds from “free” liquidity to absorb pending fees, unsettled PnL, or oracle/latency risk. Haircut parameters are **inactive / TBD** in the current testnet. Because the pool is single-asset BTC, *impermanent loss does not apply*; risk is driven by trader PnL volatility and directional skew. See [§5](#5--economic-flows) for economic flows.

---

## 3 | Key Liquidity Concepts

Twilight testnet tracks four derived pool state variables; desks should monitor these to manage inventory and avoid trading halts.

| Term                    | Symbol   | Definition                                                            | Operational Use                                 |
| ----------------------- | -------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| **Total Pool Deposit**  | TVL      | Sum of all active LP deposits (BTC units) marked at par.              | Capacity ceiling reference.                     |
| **Total Trader Margin** | `TTM`    | BTC locked to margin outstanding trader exposure the pool is backing. | Drives utilization.                             |
| **Free Liquidity**      | `L_free` | `max(TVL - TTM, 0)` after haircuts + pending fees.                    | Available for new position opens & withdrawals. |
| **Utilization**         | `U`      | `TTM / TVL` (clamped 0→1).                                            | Spread throttle; breach triggers top‑up SLA.    |

**Net Exposure (Directional):** `Δ = long_notional - short_notional` (in BTC).

---

## 4 | Capital Commitment & Guard‑Rails (Testnet Policy)

These are _testnet demonstration_ values; production numbers will change.

| Parameter                      | Value                                | Definition / Measurement                                        | Action When Breached                             | Rationale                                          |
| ------------------------------ | ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Initial Deposit**            | **0.50 BTC** (wrapped)               | Minimum capital per participating MM to bootstrap pool depth.   | Must post before quoting.                        | Ensure visible depth w/ faucet coins.              |
| **Utilization Cap** | **90%**                              | `U = TTM /TVL` Evaluated each block.                            | New opens throttled; MM top‑up SLA clock starts. | Prevents full depletion; leaves withdrawal buffer. |
| **Top‑Up SLA**                 | **≤ 5 min** from breach block time   | Add collateral _or_ reduce exposure to push `U < U_cap`.        | Desk flagged if missed; quotes may be disabled.  | Demonstrates auto‑replenish bots.                  |
|                                |                                      |                                                                 |                                                  |                                                    |
| **Capital Uptime Target**      | **≥99.5%** (best‑effort; metric TBD) | % of time pool reports `U < U_cap` _and_ API heartbeat healthy. | Informational only (v1); scoring later.          | Predictable taker depth.                           |

---

## 5 | Economic Flows

All _economic flows close into the pool_ (no separate insurance / treasury split in current testnet). Future releases may carve out dedicated insurance tranches. **Funding in Twilight compensates the pool for directional inventory skew; it does _not_ mark the contract back to spot (pricing is oracle‑sourced).**

### 5.1 Fee Model

- **Taker Fee:** Standard trade fee (bps) charged on notional; 100% flows to pool NAV.
- **Maker Fee Discount:** Makers pay a _reduced_ fee rate when quotes qualify (see [§5.4](#54-maker-fee-discount-program)). There is **no external rebate token**; the discount simply means _less fee is debited_ and therefore _more PnL retained_ by the maker. All collected fees still accrue to the pool.

### 5.2 Funding Transfers

Twilight executes at an external oracle mark; funding is therefore **not** a mark-to-spot mechanism. Instead it is a **Skew Compensation charge** that discourages one-sided positioning and offsets directional risk borne by LP capital.

**Interval:** Computed & settled **hourly** (top of hour; fixed 1h in testnet).  
**Inputs:** `L_usd` (long OI), `S_usd` (short OI), `OI_usd = L_usd + S_usd`.  
**Raw Skew:** `skew_raw = (L_usd - S_usd) / OI_usd`  (−1→+1).

**Rate (ψ governance scalar; legacy 8h normalizer):**
```text
skew_sq   = skew_raw * skew_raw
sign_dir  = sign(skew_raw)                    # +1 long-heavy; −1 short-heavy
rate_hr   = (skew_sq / (psi * 8)) * sign_dir  # decimal/hr; ψ=1 testnet; no caps
```
`psi` flattens/steepens the curve (governance‑tunable).

**Payer / Receiver:** Sign determines payer: long‑heavy ⇒ longs pay / shorts receive; short‑heavy ⇒ shorts pay / longs receive. Because notional sizes differ, residual always flows to Pool NAV (after per‑position application).

**Settlement:** Per open position at interval close:  
`funding_pos_usd = position_notional_usd * rate_hr` → convert at mark → debit/credit margin (SATS). Aggregate payer minus receiver credited (or debited) to Pool NAV. Funding is not streamed intra-interval.

See Appendix [§13.2](#132-funding-skew-compensation) for the compact formula.

### 5.3 Margin & Liquidations

**Scope:** How trader margin events impact **LP capital**. Detailed trader / relayer math (IM↔MM formulas, liquidation price derivations) will be published separately in the *Trader & Relayer Risk Math Note*.

#### Key Facts (Current Testnet)
- **Isolated Margin:** Margin is locked *per position* at open; **no post-open top-ups**.
- **Trader-Selected Leverage:** Trader chooses leverage / initial margin; relayer returns the corresponding **maintenance threshold** in the order-accept payload.
- **Trader May Close Early:** Trader can manually close (settle) any open position before liquidation.
- **Liquidation Trigger:** When the margin ratio implied by the current oracle price falls to or below the maintenance threshold, the position is **immediately liquidated** (no grace window).
- **Execution:** **Full close** at current oracle mark (Binance mid in this build).
- **Economic Outcome:** On liquidation the trader **forfeits 100% of posted margin**. Closing PnL plus seized margin flows to **Pool NAV**. If losses exceed posted margin, the **pool absorbs the deficit**.

#### Liquidation Impact Scenarios (Pool View)

| Trader Outcome at Liquidation | Margin Seized | Pool Result | Trader Result |
|---|---|---|---|
| Position had unrealized **profit** | Yes | Pool pays PnL on close but keeps margin; net impact depends on PnL vs margin. | Loses margin + unrealized profit. |
| **Loss < margin** | Yes | Pool collects trader loss *and* remaining margin. | Loses more than mark-to-market loss. |
| **Loss > margin** (blowout) | Yes (insufficient) | Pool absorbs deficit beyond margin. | Margin lost (capped). |

> Funding and trade fees apply first; table shows directional effect after those adjustments.

---
<a id="54-maker-fee-discount-program-quote-quality"></a>
### 5.4 Maker Fee Discount Program

> **Testnet v1.0:** Maker / Taker fees use a simple order-type schedule—**0.04 % taker** and **0.02 % maker**. A pool-stability-based Maker program will replace this in a future release.

#### Current Testnet Fee Logic

| Fill Type | How Determined | Fee Rate | Notes |
|---|---|---|---|
| **Taker** | Market instruction *or* limit that crosses the oracle price on entry (executes immediately). | **0.04%** (4 bps) of filled BTC notional. | Higher fee; 100% flows to pool NAV. |
| **Maker** | Limit instruction that does **not** cross when submitted and later triggers when oracle reaches your limit. | **0.02%** (2 bps) of filled BTC notional. | Discounted fee; 100% of collected fees still flow to pool NAV. |

**Fee Calculation (BTC):**  
`fee_btc = fill_size_btc * fee_rate`  
Fees are debited in **BTC (SATS)** from the account that originated the fill and credited to pool NAV. (If you prefer to work in USD, multiply fill size by execution price to get notional USD; divide by price to reconvert—result is the same BTC debited.)

---

#### Roadmap: Pool‑Stability Maker Program (Preview)

The next testnet release will shift Maker eligibility away from pure order‑type and toward **pool‑stability contribution**, reflecting Twilight’s single‑asset pooled design. Elements under consideration:

- **Capital Residency:** Maintain a minimum BTC collateral balance over rolling windows.
- **Utilization Responsiveness:** Timely top‑ups or exposure reductions when `U >= U_cap`.
- **Inventory Absorption:** Add capital or take offsetting flow during high skew / high utilization conditions.

Program details (metrics, thresholds, scoring) will be published ahead of the next cohort. Feedback welcome.

## 6 | Operational Protections & Risk Controls

| Control                    | Scope           | Current Testnet Behavior                                                                                          | Notes                                                 |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Isolated Trader Margin** | Trader accounts | Margin is locked per position at open; no post-open top-ups (close/reopen to resize). | Reduces cascading contagion; simplifies PnL.          |
| **Pool Capital Top‑Ups**   | LP deposits     | Permitted anytime; required under Top‑Up SLA after utilization breach.                                            | Distinct from trader margin (no contradiction).       |
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
- **Insurance Fund Absence:** Twilight currently has no separate insurance pool; any trader deficits are absorbed directly by pool NAV.


---

## 8 | Connectivity & Tooling

### 8.1 Endpoints (Testnet)

| Service      | Transport               | Path Sketch                                                                        | Auth                       |
| ------------ | ----------------------- | ---------------------------------------------------------------------------------- | -------------------------- |
| RPC          | JSON‑RPC 2.0 over HTTPS | [https://relayer.twilight.rest/clientapi](https://relayer.twilight.rest/clientapi) | API key header             |
|              |                         |                                                                                    |                            |
| Websocket    | WSS                     | Oracle feed, live trades, utilization stream wss://relayer.twilight.rest/ws         | API key query param        |
| REST Metrics | HTTPS                   | [https://relayer.twilight.rest/api](https://relayer.twilight.rest/api)             | Public read (rate‑limited) |

**Docs:** See **[Twilight API Docs](https://docs.twilight.rest)** for schema definitions and example payloads.

### 8.2 SDKs & Clients

| Tool | What you can do **today** | Coming in next patch |
|------|---------------------------|----------------------|
| **Client SDK (Rust)** | Build / submit / cancel shielded orders, manage private accounts. | Direct Cosmos chain queries · pool-metrics helpers · tagged release. |
| **Client Wallet (Rust wrapper)** | Generate HD keys, link a Cosmos address, wrap SDK calls. | CLI onboarding flow (fund → deposit → trade → monitor). |
| **Frontend Web App** | Faucet, deposit SATS, open/close positions, view pool stats — **all via browser, no code.** | Bulk ops · automation hooks. |

> **Need to inspect or automate right now?**  
> • Use the **Frontend** for manual LP testing.  
> • Power users can call the raw REST + WS endpoints in [§8.1](#81-endpoints-testnet).  
> • The SDK / Wallet tagged releases land within days and will unlock full scripting.

_Source repositories: `github:twilight-project/twilight-client-sdk`, `github:twilight-project/nyks-wallet`, frontend source https://github.com/kenny019/twilight-pool._

#### Which Should I Use?

- **Evaluating liquidity / manual participation:** Use the **Frontend Web App**; no code required.
- **High‑frequency / automated trading or desk integration:** Use the **Client SDK** (pin to a commit) and plan to layer the **Client Wallet** once chain/metrics reads land.
- **Direct access (power users):** You can always hit the raw **REST + WS endpoints** in [§8.1](#81-endpoints-testnet) from your own infra.

_Installation & build instructions live in the linked repos; we **do not** duplicate code snippets here to avoid drift._

### 8.3 Key Handling & Privacy (Testnet)

All official client tooling ships with an integrated wallet that generates signing keys for you and wraps every order inside an end-to-end-encrypted **shielded transaction**. Shielding hides margin, leverage, and other position specific data on-chain while still proving correctness to validators.

An enterprise signer interface (HSM / KMS) and an optional unshielded mode for ultra-low-latency use-cases are on the near-term roadmap.

---

## 9 | On‑Boarding Workflow (≈30 min)

| Onboarding Path         | Status                           | How-To / Where to Start |
|------------------------|-----------------------------------|-------------------------|
| **Frontend Web App**   | **Available Now**                 | [Quick Start](#91-quick-start) |
| **Programmatic / CLI** | **Imminent (ETA a few days)**     | [CLI/SDK Onboarding](#92-programmatic--cli-imminent) |

---

### 9.1 Quick Start

- **On‑Boarding Guide** – full walkthrough of wallet creation, funding, lending, and trading: https://user-guide.docs.twilight.rest/docs
- **Request Faucet Funds** – mint test SATS: https://frontend.twilight.rest/faucet/

### 9.2 Programmatic / CLI (Imminent)

- The **Rust Client SDK** already handles shielded order construction, submission, settlement, and cancellation. 

- The companion **Client Wallet** adds Cosmos connectivity and secure HD key management. - 

- Full CLI onboarding 
              — fund → deposit → trade → monitor —
  will be published in the next few days alongside tagged releases of both projects.

Release announcements will appear in the GitHub changelogs. Until then, LPs and MMs can explore the pool via the Frontend Quick Start.

---

## 10 | Metrics & Monitoring

> Uptime SLA scoring is **not enforced** in the current testnet; telemetry endpoints exist for experimentation.

| Metric          | Method           | Units | Notes                                           |
| --------------- | ---------------- | ----- | ------------------------------------------------|
| PoolShare price | pool_share_value | -     | number of poolshares in 1 BTC                   |
| Current Price   | btc_usd_price    | USD   | Mark price sampled every 0.5 s.                 |
| Pool Deposits   | lend_pool_info   | BTC   | Total balances locked in the pool (TVL).        |
| Funding Rate    | get_funding_rate | %/hr  | Last funding applied.                           |

> _Note:_ The lend pool info endpoint currently returns **TVL** only. Companion fields — **TTM** and real‑time utilisation **U** — will be live  with the next testnet patch and appear automatically in the same payload.

Sample pull:

```bash
curl -sS -X POST https://relayer.twilight.rest/api \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"jsonrpc":"2.0","method":"lend_pool_info","params":null,"id":123}' | jq
```

---

## 11 | Indicative Timeline (Testnet Cohort)

| Milestone | Target Date | What to Expect |
|-----------|-------------|----------------|
| **Testnet v1.0 Launch** | **20 Jul 2025** | Public faucet + LP guide live. |
| **Metrics API update** | **late Jul 2025** | `TTM` & `U` fields added to `/api`. |
| **SDK + Wallet release** | **early Aug 2025** | CLI onboarding & automation ready. |
| **v1.1 Bug-fix patch** | **mid Aug 2025** | Incorporates cohort feedback. |

---

## 12 | Contacts

| Contact Channel | Link                                   | Purpose                                        |
|-----------------|----------------------------------------|------------------------------------------------|
| Discord (Community) | https://discord.gg/z5qDWntcDE | Real‑time chat for support and onboarding Q&A |

---

## 13 | Appendix – Formal Definitions & Formulas

### 13.1 Pool Accounting (Recap)

```text
TVL    = Σ active_LP_deposits_btc
TTM    = Σ trader_margin_locked_btc
L_free = max(TVL - TTM, 0)
U      = TTM / TVL   # if TVL>0 else 0
```

### 13.2 Funding (Skew Compensation)

```text
skew_raw = (L_usd - S_usd) / (L_usd + S_usd)   # -1 .. +1
rate_hr  = (skew_raw*skew_raw) / (psi * 8)     # unsigned
rate_hr  = rate_hr * sign(skew_raw)            # apply direction
```
Hourly; per-position application; residual to Pool NAV. See §5.2.

### 13.3 Utilization Breach (Signal)

```text
if U >= U_cap:
  emit UtilizationBreach(height, U)
  start TopUpSLA_timer
```

### 13.4 Further Detail
Trader margin ladders, liquidation price derivations, and parameter functions will be published in the Trader & Relayer Risk Math Note (forthcoming).


