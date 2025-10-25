---
title: Waku vs Libp2p
hide_table_of_contents: true
displayed_sidebar: learn
---

# Waku vs libp2p

## Core Distinction

**libp2p** is a general-purpose P2P networking framework providing transport, discovery, and pub/sub primitives for any decentralized application.

**Waku** is a privacy-preserving messaging protocol built on top of libp2p, extending it with metadata privacy and zero-knowledge DoS protection.

These protocols are complementary, Waku inherits libp2p's networking foundation and adds privacy-first messaging capabilities.

## Quick Comparison

| Aspect | libp2p | Waku |
|--------|--------|------|
| **Purpose** | General P2P infrastructure | Privacy-preserving messaging |
| **Metadata Privacy** | None (connection patterns visible) | Strong (no-signature relay, k-anonymity) |
| **DoS Protection** | Peer scoring only | RLN (zero-knowledge proofs) |
| **Latency** | ~10-50ms overhead | ~500ms average |
| **Message Size** | Transport-limited | 150KB max (4KB recommended) |
| **Offline Delivery** | Application layer required | Built-in Store protocol (12+ hours) |
| **Production Scale** | ETH2 (100K+ validators), IPFS | Status (200K users), RAILGUN, Waku Network (80K capacity) |
| **Maturity** | 6+ years, battle-tested | 4+ years (v2 since 2021), production-ready |
| **Implementations** | Go, Rust, JS, 10+ languages | Nim (reference), Go, JS, Rust (RLN) |

## Privacy Architecture

### libp2p Privacy Model
- Strong transport encryption (TLS 1.3, Noise)
- Forward secrecy through key rotation
- **No metadata protection**: DHT queries, connection patterns, and relay routing are visible
- GossipSub messages signed by default, exposing sender identity
- Requires application-layer privacy additions

### Waku Privacy Model
- Same transport encryption as libp2p
- **Strong metadata privacy**: no-signature policy prevents sender identification
- Content topic strategies provide k-anonymity
- **Formal privacy guarantees**: proven sender anonymity against single-node adversaries
- **Zero-knowledge DoS protection**: Rate Limiting Nullifiers (RLN) prevent spam without revealing identity
- First production P2P protocol achieving privacy-preserving DoS protection

### Privacy Threat Model

| Adversary | libp2p | Waku |
|-----------|--------|------|
| Casual eavesdropper | ✅ Protected (encryption) | ✅ Protected (encryption) |
| Network-level observer | ❌ Metadata exposed | ✅ Sender anonymity preserved |
| Compromised relay node | ❌ Can correlate traffic | ✅ Cannot identify sender |
| Global passive adversary | ❌ No protection | ⚠️ Timing correlation possible |

## When to Use Each Protocol

### Choose libp2p When:
- Building blockchain protocols or Layer 2 networks
- Creating content-addressed storage systems
- Need DHT-based peer discovery and routing
- Require maximum decentralization with no service dependencies
- Privacy is not a critical requirement
- Proven scalability at Ethereum/IPFS scale is essential
- Need deep customization of networking stack

**Best For:** Infrastructure, blockchain nodes, content distribution, general P2P systems

### Choose Waku When:
- Privacy and sender anonymity are critical
- Building censorship-resistant messaging
- Need DoS protection that preserves privacy
- Metadata protection is required (who talks to whom)
- Can accept ~500ms latency (unsuitable for real-time)
- Users can handle blockchain integration for RLN membership
- Anonymous voting or governance systems

**Best For:** Private messaging, crypto coordination, MEV protection, anonymous voting, decentralized social

### Use Both When:
- Building complex decentralized systems with infrastructure AND messaging needs
- Need libp2p for blockchain/state sync + Waku for privacy-sensitive user communication
- Want shared connection infrastructure with specialized privacy capabilities

**Example:** Use libp2p for validator communication and state sync, Waku for private user messaging and coordination

## Production Maturity

### libp2p
**Proven Deployments:**
- Ethereum 2.0 (100K+ validators)
- IPFS (tens of thousands of nodes)
- Filecoin (7.5+ petabytes)
- Polkadot/Substrate ecosystem

**Maturity Notes:**
- 6+ years in production
- Comprehensive specifications and tooling
- **Concern:** August 2025 maintenance transition for go-libp2p/js-libp2p to community maintainers
- rust-libp2p remains well-supported (Polkadot ecosystem)

### Waku
**Proven Deployments:**
- Status messenger (200K+ historical users)
- RAILGUN (privacy layer used by Vitalik for 100 ETH transfer)
- The Graph's Graphcast (indexer coordination)
- Waku Network (80K concurrent capacity across 8 shards)

**Maturity Notes:**
- v2 production-ready since 2021
- Complete rewrite from v1 (lessons learned)
- Formal specifications (RFCs) and research papers
- **Concern:** Incentivization layer incomplete (requires project-funded nodes currently)
- Active development with expected API evolution

## Key Limitations

### libp2p Limitations
- No metadata privacy (connection patterns visible)
- No built-in spam/DoS protection beyond peer scoring
- No message ordering guarantees
- Requires extensive application-layer work for messaging features
- No offline message delivery without additional storage layer
- Vulnerable to Sybil attacks without application-layer mitigations

### Waku Limitations
- ~500ms average latency (unsuitable for real-time apps like voice/video)
- 150KB message size limit (4KB recommended for performance)
- Smaller ecosystem than libp2p
- Incomplete incentivization requires running own service nodes
- Light protocols create dependencies on service nodes
- Current 80K capacity requires additional shards for significant growth
- RLN doesn't eliminate spam (attackers can create multiple memberships)

## Technical Requirements

### libp2p Integration
**Complexity:** Moderate to high
- Multiple transport configuration (TCP, QUIC, WebSocket, WebRTC)
- GossipSub tuning (20+ parameters)
- NAT traversal setup
- DHT configuration for peer discovery
- Application-layer messaging features

**Resources Required:**
- Running infrastructure nodes
- Development and maintenance costs
- Potential relay hosting costs

### Waku Integration
**Complexity:** Moderate
- Choose relay vs. light protocol strategy
- RLN membership management (~$0.05/message/epoch proposed)
- Content topic and autosharding configuration
- Service node infrastructure (if requiring reliability)

**Resources Required:**
- RLN membership costs (blockchain-based)
- Service node operation (for production reliability)
- Currently relies on altruistic or project-funded operators
