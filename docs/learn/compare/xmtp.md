---
title: Waku vs XMTP
hide_table_of_contents: true
displayed_sidebar: learn
---

# Waku vs XMTP

## TL;DR

**Waku** = Privacy-first, permissionless, metadata protection, ~500ms latency, higher complexity
**XMTP** = Developer-first, permissioned (5-20 nodes), fast UX, currently centralized (transitioning)

**Core Tradeoff:** Privacy & decentralization (Waku) vs Performance & ease-of-use (XMTP)

## Critical Technical Differences

### Architecture

**Waku**
- **Network:** Permissionless P2P mesh (live since Dec 2023)
- **Node Operation:** Anyone can run a node
- **Current Scale:** 8 shards, ~80K user capacity, 200K+ users (Status)
- **Privacy Model:** Metadata privacy + content encryption
- **DoS Protection:** Rate Limiting Nullifiers (zero-knowledge proofs)

**XMTP**
- **Network:** Currently centralized (all nodes = Ephemera), transitioning to 5-20 permissioned operators
- **Node Operation:** Selected operators only (XIP-54 criteria)
- **Current Scale:** 2.2M+ identities, 1B+ messages, 60+ apps
- **Privacy Model:** Content encryption only (MLS standard)
- **DoS Protection:** Conditional deliverability (planned)

### Encryption

**Waku**
- Noise Protocol Framework
- Applications must implement encryption layer
- Forward secrecy via key rotation
- No quantum resistance (requires upgrade)

**XMTP**
- IETF RFC 9420 (MLS standard)
- Automatic encryption (handled by SDK)
- Perfect forward secrecy + post-compromise security
- Hybrid post-quantum encryption (XWING/ML-KEM for Welcome messages)
- NCC Group audited (Dec 2024)

### Privacy & Anonymity

| Aspect | Waku | XMTP |
|--------|------|------|
| **Content Privacy** | ✅ Encrypted | ✅ Encrypted (stronger standard) |
| **Metadata Privacy** | ✅ Strong (no sender signatures) | ❌ Weak (centralized visibility) |
| **Sender Anonymity** | ✅ Formal proofs | ❌ Pseudonymous (wallet-based) |
| **IP Protection** | ⚠️ Better than most | ❌ Vulnerable (centralized) |
| **Censorship Resistance** | ✅ Strong | ❌ Weak (small operator set) |

### Performance

| Metric | Waku | XMTP |
|--------|------|------|
| **Latency** | 500ms average | Web2-like  |
| **Message Size** | 150KB max | 1MB max |
| **Offline Storage** | 12+ hours (Store protocol) | Reliable node storage |
| **Mobile Support** | Light protocols (SDK in dev) | Native SDKs (mature) |

### Developer Experience

**Waku**
- **Complexity:** Moderate
- **SDKs:** Nim, Go, JS (TypeScript)
- **Documentation:** Comprehensive, technical
- **Must Handle:** Encryption layer, content topics, node discovery

**XMTP**
- **Complexity:** Low
- **SDKs:** JavaScript, Kotlin, Swift, React, React Native, Dart
- **Documentation:** Excellent, developer-friendly
- **Automatic:** Encryption, cross-app messaging, wallet integration

### Economics

**Waku**
- Currently free
- RLN membership cost: ~$0.05 proposed
- Run your own infrastructure or use public nodes
- No operator fees

**XMTP**
- Currently free
- Fees coming with mainnet (amount TBD)
- Hosted infrastructure (transitioning to operator set)
- Fee model uncertain during transition

## Decision Matrix

### Choose Waku If You Need:

- **Metadata privacy** (not just content encryption)
- **Sender anonymity** (formal privacy guarantees)
- **Permissionless network** (anyone can run nodes)
- **Strong censorship resistance** (no central points of failure)
- **Privacy-critical infrastructure** (threat model includes sophisticated adversaries)

**Accept:**
- ~500ms latency
- Implementing your own encryption
- Higher integration complexity
- Running infrastructure or depending on service nodes

**Use Cases:** Private transaction coordination, anonymous voting, privacy-first social networks, MEV protection, whistleblowing platforms

### Choose XMTP If You Need:

- **Wallet-to-wallet messaging** (EVM addresses)
- **Fast time-to-market** (days not months)
- **Cross-app interoperability** (60+ apps)
- **Web2-like UX** (low latency, reliable delivery)
- **Mature mobile SDKs** (production-ready)
- **Automatic encryption** (no implementation required)

**Accept:**
- Current centralization (transitioning to 5-20 permissioned nodes)
- Weak metadata privacy
- Wallet-based pseudonymity (no anonymity)
- Fee uncertainty during transition
- EVM-only (for now)

**Use Cases:** Crypto messaging apps, DeFi notifications, NFT marketplace chat, wallet-based social features, DAO communications
