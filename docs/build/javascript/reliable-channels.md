---
title: Send and Receive Messages in a Reliable Channel
hide_table_of_contents: true
displayed_sidebar: build
---

Learn how to send and receive messages with a convenient SDK that provide various reliable functionalities out-of-the-box.

:::warning
This is an experimental feature and has a number of [limitations](https://github.com/waku-org/js-waku/pull/2526).
:::

## Import Waku SDK

```shell
npm install @waku/sdk@latest
```

Or using a CDN, note this is an ESM package so `type="module"` is needed.

```html
<script type="module">
  import {
    createLightNode,
    ReliableChannel
  } from 'https://unpkg.com/@waku/sdk@latest/bundle/index.js';

  // Your code here
  
</script>
```

## Create a Waku node

Use the `createLightNode()` function to create a [Light Node](/learn/glossary#light-node) and interact with the Waku Network:

```js
import { createLightNode } from "@waku/sdk";

// Create a Light Node
const node = await createLightNode({ defaultBootstrap: true });
```

:::info
When the `defaultBootstrap` parameter is set to `true`, your node will be bootstrapped using the [default bootstrap method](/build/javascript/configure-discovery#default-bootstrap-method). Have a look at the [Bootstrap Nodes and Discover Peers](/build/javascript/configure-discovery) guide to learn more methods to bootstrap nodes.
:::

## Create encoders and decoders

Choose a [content topic](/learn/concepts/content-topics) for your application and create a message `encoder` and `decoder`:

```js
// Choose a content topic
const ct = "/my-app/1/messages/proto";

// Create a message encoder and decoder
const encoder = node.createEncoder({ contentTopic: ct });
const decoder = node.createDecoder({ contentTopic: ct });
```

You can also use [`@waku/message-encryption`](/build/javascript/message-encryption) to encrypt and decrypt messages using Waku libraries.

:::info
In this example, users send and receive messages on a shared content topic. However, real applications may have users broadcasting messages while others listen or only have 1:1 exchanges. Waku supports all these use cases.
:::

## Listen for connection status

The Waku node will emit `health` events to help you know whether the node is connected to the network.
This can be useful to give feedback to the user, or stop some action (e.g. sending messages) when offline:

```js
import { HealthStatus } from "@waku/sdk";

node.events.addEventListener("waku:health", (event) => {
    const health = event.detail;
    
    if (health === HealthStatus.SufficientlyHealthy) {
        // Show to the user they are connected
    } else if (status === HealthStatus.MinimallyHealthy) {
        // Maybe put some clue to the user that while we are connected,
        // there may be issues sending or receiving messages
    } else {
        // Show to the user they are disconnected from the network
    }
});
```

## Create a reliable channel

You need to choose a channel name: it acts as an identifier to the conversation, participants will try to ensure they all have the same
messages within a given channel.

```js
const channelName = "channel-number-15"
```

Finally, each participant need to identify themselves for reliability purposes, so they can confirm _others_ have received their messages.

It is up to you how to generate an id. Every participant **must** have a different id.

```js
const senderId = generateRandomStringId();
```

You can now create a reliable channel:

```js
import { ReliableChannel } from "@waku/sdk";

const reliableChannel = await ReliableChannel.create(node, channelName, senderId, encoder, decoder)
```

The channel will automatically start the Waku node and fetch messages.

## Create a message structure

Create your application's message structure using [Protobufjs](https://github.com/protobufjs/protobuf.js#usage):

```js
import protobuf from "protobufjs";

// Create a message structure using Protobuf
const DataPacket = new protobuf.Type("DataPacket")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));
```

:::info
Have a look at the [Protobuf installation](/build/javascript/#message-structure) guide for adding the `protobufjs` package to your project.
:::

## Listen to incoming messages

The reliable channel will emit incoming messages. To process them, simply add a listener:

```js
reliableChannel.addEventListener("message-received", (event) => {
  const wakuMessage = event.detail;
  
  // decode your payload using the protobuf object previously created
  const { timestamp, sender, message } = DataPacket.decode(wakuMessage.payload);
  
  // ... process the message as you wish
})
```

## Send messages

To send messages in the reliable channel, encode the message in a payload.

```js
// Create a new message object
const protoMessage = DataPacket.create({
  timestamp: Date.now(),
  sender: "Alice",
  message: "Hello, World!",
});

// Serialise the message using Protobuf
const serialisedMessage = DataPacket.encode(protoMessage).finish();
```

Then, send the message and setup listeners so you can know when the message:
- has been sent
- has been acknowledged by other participants in the channel
- has encountered an error

```js
// Send the message, and get the id to track events
const messageId = reliableChannel.send(payload);
        
reliableChannel.addEventListener("sending-message-irrecoverable-error", (event) => {
    if (messageId === event.detail.messageId) {
      console.error('Failed to send message:', event.detail.error);
      // Show an error to the user
    }
})

reliableChannel.addEventListener("message-sent", (event) => {
    if (messageId === event.detail) {
        // Message sent, show '✔' to the user, etc
    }
})

reliableChannel.addEventListener("message-acknowledged", (event) => {
  if (messageId === event.detail) {
    // Message acknowledged by other participants, show '✔✔' to the user, etc
  }
})
```

:::tip Congratulations!
You have successfully sent and received messages over the Waku Network using our reliable protocols such as Scalable Data Sync (SDS) and P2P Reliability.
:::
