---
title: Node Configuration Options
hide_table_of_contents: true
displayed_sidebar: runNode
---

Here are the available node configuration options, along with their default values and descriptions:

## Application-level config

| Name              | Default Value               | Description                                                                                          |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `config-file`     |                             | Loads configuration from a TOML file (cmd-line parameters take precedence)                           |
| `protected-shard` | `newSeq[ProtectedShard](0)` | Shards and its public keys to be used for message validation, shard:pubkey. Argument may be repeated |

## Log config

| Name         | Default Value            | Description                                                                                        |
| ------------ | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `log-level`  | `logging.LogLevel.INFO`  | Sets the log level for process. Supported levels: TRACE, DEBUG, INFO, NOTICE, WARN, ERROR or FATAL |
| `log-format` | `logging.LogFormat.TEXT` | Specifies what kind of logs should be written to stdout. Supported formats: TEXT, JSON             |

## General node config

| Name                  | Default Value            | Description                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cluster-id`          | `0`                      | Cluster id that the node is running in. Node in a different cluster id is disconnected                                                                                                                                                                                                          |
| `agent-string`        | `nwaku`                  | Node agent string which is used as identifier in network                                                                                                                                                                                                                                        |
| `nodekey`             |                          | P2P node private key as 64-char hex string                                                                                                                                                                                                                                                      |
| `listen-address`      | `defaultListenAddress()` | Listening address for LibP2P (and Discovery v5, if enabled) traffic                                                                                                                                                                                                                             |
| `tcp-port`            | `60000`                  | TCP listening port                                                                                                                                                                                                                                                                              |
| `ports-shift`         | `0`                      | Add a shift to all port numbers                                                                                                                                                                                                                                                                 |
| `nat`                 | any                      | Specify method to use for determining public address. Must be one of: any, none, upnp, pmp, extip:IP                                                                                                                                                                                            |
| `ext-multiaddr`       |                          | External multiaddresses to advertise to the network. Argument may be repeated                                                                                                                                                                                                                   |
| `ext-multiaddr-only`  | `false`                  | Only announce external multiaddresses                                                                                                                                                                                                                                                           |
| `max-connections`     | `50`                     | Maximum allowed number of libp2p connections                                                                                                                                                                                                                                                    |
| `relay-service-ratio` | `"60:40"`                | This percentage ratio represents the relay peers to service peers. For example, 60:40, tells that 60% of the max-connections will be used for relay protocol and the other 40% of max-connections will be reserved for other service protocols (e.g., filter, lightpush, store, metadata, etc.) |
| `peer-store-capacity` |                          | Maximum stored peers in the peerstore                                                                                                                                                                                                                                                           |
| `peer-persistence`    | `false`                  | Enable peer persistence                                                                                                                                                                                                                                                                         |

## DNS addrs config

| Name                    | Default Value            | Description                                                                          |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `dns-addrs`             | `true`                   | Enable resolution of `dnsaddr`, `dns4` or `dns6` multiaddrs                          |
| `dns-addrs-name-server` | `["1.1.1.1", "1.0.0.1"]` | DNS name server IPs to query for DNS multiaddrs resolution. Argument may be repeated |
| `dns4-domain-name`      |                          | The domain name resolving to the node's public IPv4 address                          |

## Relay config

| Name                             | Default Value                             | Description                                                                                                                       |
| -------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `relay`                          | `true`                                    | Enable relay protocol: true\|false                                                                                                |
| `relay-peer-exchange`            | `false`                                   | Enable gossipsub peer exchange in relay protocol: true\|false                                                                     |
| `rln-relay`                      | `false`                                   | Enable spam protection through rln-relay: true\|false                                                                             |
| `rln-relay-cred-path`            |                                           | The path for persisting rln-relay credential                                                                                      |
| `rln-relay-membership-index`     |                                           | The index of the onchain commitment to use                                                                                        |
| `rln-relay-dynamic`              | `false`                                   | Enable waku-rln-relay with on-chain dynamic group management: true\|false                                                         |
| `rln-relay-id-key`               |                                           | Rln relay identity secret key as a Hex string                                                                                     |
| `rln-relay-id-commitment-key`    |                                           | Rln relay identity commitment key as a Hex string                                                                                 |
| `rln-relay-eth-client-address`   | `ws://localhost:8540/`                    | WebSocket address of an Ethereum testnet client e.g., `ws://localhost:8540/`                                                      |
| `rln-relay-eth-contract-address` |                                           | Address of membership contract on an Ethereum testnet                                                                             |
| `rln-relay-eth-private-key`      |                                           | Private key for broadcasting transactions                                                                                         |
| `execute`                        | `false`                                   | Runs the registration function on-chain. By default, a dry-run will occur                                                         |
| `rln-relay-cred-password`        |                                           | Password for encrypting RLN credentials                                                                                           |
| `rln-relay-bandwidth-threshold`  | `0 # to maintain backwards compatibility` | Message rate in bytes/sec after which verification of proofs should happen                                                        |
| `staticnode`                     |                                           | Peer multiaddr to directly connect with. Argument may be repeated                                                                 |
| `keep-alive`                     | `false`                                   | Enable keep-alive for idle connections: true\|false                                                                               |
| `pubsub-topic`                   |                                           | Default pubsub topic to subscribe to. Argument may be repeated. **Deprecated!** Please use `shard` and/or `content-topic` instead |
| `shard`                          |                                           | Shard to subscribe to. Argument may be repeated                                                                                   |
| `num-shards-in-network`          |                                           | Number of shards in the network. Used to map content topics to shards when using autosharding                                     |
| `content-topic`                  |                                           | Default content topic to subscribe to. Argument may be repeated                                                                   |
| `reliability`                    | `false`                                   | Enable experimental reliability protocol true\|false                                                                              |

## Store and message store config

| Name                             | Default Value            | Description                                                                                                                                                                               |
| -------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `store`                          | `false`                  | Enable/disable waku store protocol                                                                                                                                                        |
| `storenode`                      |                          | Peer multiaddress to query for storage                                                                                                                                                    |
| `store-message-retention-policy` | `time:172800`            | Message store retention policy. Time retention policy: `time:<seconds>`. Capacity retention policy: `capacity:<count>`. Size retention policy: `size:<xMB/xGB>`. Set to `none` to disable |
| `store-message-db-url`           | `sqlite://store.sqlite3` | The database connection URL for persistent storage                                                                                                                                        |
| `store-message-db-vacuum`        | `false`                  | Enable database vacuuming at start. Only supported by SQLite database engine                                                                                                              |
| `store-message-db-migration`     | `true`                   | Enable database migration at start                                                                                                                                                        |

## Store Sync

| Name                      | Default Value   | Description                                                         |
| ------------------------- | --------------- | ------------------------------------------------------------------- |
| `store-sync`              | `false`         | Enable/disable waku store sync protocol                             |
| `store-sync-interval`     | `300` 5 minutes | Interval between store synchronization attempts                     |
| `store-sync-range`        | `3600` 1 hour   | Amount of time to sync                                              |
| `store-sync-relay-jitter` | `20` seconds    | Sync range offset to account for relay's message propagation jitter |

## Filter config

| Name                          | Default Value     | Description                                                                                             |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| `filter`                      | `false`           | Enable filter protocol: true\|false                                                                     |
| `filternode`                  |                   | Peer multiaddr to request content filtering of messages                                                 |
| `filter-subscription-timeout` | `300 # 5 minutes` | Timeout for filter subscription without ping or refresh it, in seconds. Only for v2 filter protocol     |
| `filter-max-peers-to-serve`   | `1000`            | Maximum number of peers to serve at a time. Only for v2 filter protocol                                 |
| `filter-max-criteria`         | `1000`            | Maximum number of pubsub and content topic combinations per peer at a time. Only for v2 filter protocol |

## Light push config

| Name            | Default Value | Description                                               |       |
| --------------- | ------------- | --------------------------------------------------------- | ----- |
| `lightpush`     | `false`       | Enable lightpush protocol: true                           | false |
| `lightpushnode` |               | Peer multiaddr to request lightpush of published messages |       |

## REST HTTP config

| Name                        | Default Value | Description                                                                                                                                                                                                                                                                                                                                  |
| --------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rest`                      | `false`       | Enable Waku REST HTTP server: true\|false                                                                                                                                                                                                                                                                                                    |
| `rest-address`              | `127.0.0.1`   | Listening address of the REST HTTP server                                                                                                                                                                                                                                                                                                    |
| `rest-port`                 | `8645`        | Listening port of the REST HTTP server                                                                                                                                                                                                                                                                                                       |
| `rest-relay-cache-capacity` | `30`          | Capacity of the Relay REST API message cache                                                                                                                                                                                                                                                                                                 |
| `rest-admin`                | `false`       | Enable access to REST HTTP Admin API: true\|false                                                                                                                                                                                                                                                                                            |
| `rest-allow-origin`         |               | Allow cross-origin requests from the specified origin. When using the REST API in a browser, specify the origin host to get a valid response from the node REST HTTP server. This option may be repeated and can contain wildcards (?,\*) for defining URLs and ports such as `localhost:*`, `127.0.0.1:8080`, or allow any website with `*` |

## Metrics config

| Name                     | Default Value | Description                               |
| ------------------------ | ------------- | ----------------------------------------- |
| `metrics-server`         | `false`       | Enable the metrics server: true\|false    |
| `metrics-server-address` | `127.0.0.1`   | Listening address of the metrics server   |
| `metrics-server-port`    | `8008`        | Listening HTTP port of the metrics server |
| `metrics-logging`        | `true`        | Enable metrics logging: true\|false       |

## DNS discovery config

| Name                        | Default Value            | Description                                                  |
| --------------------------- | ------------------------ | ------------------------------------------------------------ |
| `dns-discovery`             | `false`                  | Enable discovering nodes via DNS                             |
| `dns-discovery-url`         |                          | URL for DNS node list in format `'enrtree://<key\>@<fqdn\>'` |
| `dns-discovery-name-server` | `["1.1.1.1", "1.0.0.1"]` | DNS name server IPs to query. Argument may be repeated       |
| `rendezvous`                | `true`                   | Enable waku rendezvous discovery server                      |

## Discv5 config

| Name                     | Default Value | Description                                                                                        |
| ------------------------ | ------------- | -------------------------------------------------------------------------------------------------- |
| `discv5-discovery`       | `false`       | Enable discovering nodes via Node Discovery v5                                                     |
| `discv5-udp-port`        | `9000`        | Listening UDP port for Node Discovery v5                                                           |
| `discv5-bootstrap-node`  |               | Text-encoded ENR for bootstrap node. Used when connecting to the network. Argument may be repeated |
| `discv5-enr-auto-update` | `false`       | Discovery can automatically update its ENR with the IP address                                     |
| `discv5-table-ip-limit`  | `10`          | Maximum amount of nodes with the same IP in discv5 routing tables                                  |
| `discv5-bucket-ip-limit` | `2`           | Maximum amount of nodes with the same IP in discv5 routing table buckets                           |
| `discv5-bits-per-hop`    | `1`           | Kademlia's b variable, increase for less hops per lookup                                           |

## Waku peer exchange config

| Name                 | Default Value | Description                                                                                       |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `peer-exchange`      | `false`       | Enable waku peer exchange protocol (responder side): true\|false                                  |
| `peer-exchange-node` |               | Peer multiaddr to send peer exchange requests to. (enables peer exchange protocol requester side) |

## WebSocket config

| Name                         | Default Value | Description                                            |
| ---------------------------- | ------------- | ------------------------------------------------------ |
| `websocket-support`          | `false`       | Enable websocket: true\|false                          |
| `websocket-port`             | `8000`        | WebSocket listening port                               |
| `websocket-secure-support`   | `false`       | Enable secure websocket: true\|false                   |
| `websocket-secure-key-path`  |               | Secure websocket key path: '/path/to/key.txt'          |
| `websocket-secure-cert-path` |               | Secure websocket Certificate path: '/path/to/cert.txt' |

## Non-relay, request-response protocol DOS protection configuration

| Name         | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rate-limit` |               | This is a repeatable option. Each can describe a specific rate limit configuration for a particular protocol.<br />Formatted as:`<protocol>:volume/period<time-unit>`<br />- if protocol is not given, settings will be taken as default for un-set protocols. Ex: `80/2s`<br />-Supported protocols are: `lightpush`\|`filter`\|`px`\|`store`\|`storev2`\|`storev3`<br />-volume must be an integer value, representing number of requests over the period of time allowed.<br />-period\<time-unit\> must be an integer with defined unit as one of `h`\|`m`\|`s`\|`ms`<br />- `storev2` and `storev3` takes precedence over `store` which can easy set both store protocols at once.<br />- In case of multiple set of the same protocol limit, last one will take place.<br />- if config is not set, - which is the default - means unlimited requests are allowed.<br />-filter has a bit different approach. It has a default setting applied if not overridden. Rate limit setting for filter will be applied per subscriber-peers, not globally - it must be considered when changing the setting.<br /><br />Examples:<br />`--rate-limit="100/1s"` - default for all protocols if not set otherwise.<br />`--rate-limit="lightpush:0/0s"` - lightpush protocol will not be rate-limited.<br />`--rate-limit="store:130/1500ms"` - both store-v3 and store-v2 will apply 130 request per each 1500ms separately.<br />`--rate-limit="px:10/1h"` PeerExchange will serve only 10 requests every hour.<br />`--rate-limit="filter:8/5m"` - will allow 8 subs/unsubs/ping requests for each subscriber within every 5 min. |

:::tip
To configure your node using the provided configuration options, have a look at the [Node Configuration Methods](/run-node/config-methods) guide.
:::
