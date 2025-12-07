---
title: Build a Forum
sidebar_label: Build a Forum
description: Ship decentralized forum experiences over Waku using the OpChan React SDK.
---

`@opchan/react` adds a forum-focused state layer on top of `@opchan/core`, Wagmi, and the Waku network.

## Why OpChan on Waku?

- **Relevance-based sorting** – content scores combine engagement metrics (upvotes +1, comments +0.5), verification bonuses (ENS authors +25%, wallet-connected +10%), exponential time decay, and moderation penalties to surface quality discussions.
- **Forum-first primitives** – cells, posts, comments, votes, bookmarks, and moderation helpers.
- **Identity blending** – anonymous sessions, wallet accounts, ENS verified owners, and call signs share one cache.
- **Permission reasoning** – UI gates and string reasons with zero custom role logic.
- **Delegated signing** – short-lived browser keys prevent repetitive wallet prompts while keeping signatures verifiable.
- **Local-first sync** – IndexedDB hydrates instantly while Waku relays stream live updates in the background.

## Prerequisites

- React 18+ with a modern build tool (Vite examples below).
- Node.js 18+ and a package manager (npm or yarn).
- A WalletConnect / Reown project id (`VITE_REOWN_PROJECT_ID`) so users can connect wallets.
- Basic familiarity with [Waku content topics](/learn/concepts/content-topics) and message reliability concepts.

## Quick Links

- [Install the SDKs](#install-the-sdks)
- [Bootstrap the provider](#1-bootstrap-the-provider)
- [Hook surface overview](#2-understand-the-hook-surface)
- [Common UI patterns](#3-compose-ux-patterns)
- [Authentication flows](#4-authentication-flows)
- [Reference app (collapsible)](#6-reference-layout)
- [Troubleshooting](#8-troubleshooting)

## Install the SDKs

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Tabs groupId="pkg-manager">
<TabItem value="npm" label="npm">

```bash
npm install @opchan/react react react-dom buffer
```

</TabItem>
<TabItem value="yarn" label="Yarn">

```bash
yarn add @opchan/react react react-dom buffer
```

</TabItem>
</Tabs>

For Vite + TypeScript projects also install `@vitejs/plugin-react`, `typescript`, and `@types/react`.

## 1. Bootstrap the provider

Add the Buffer polyfill (still required by many crypto libraries) and wrap your tree with `OpChanProvider`. The provider internally wires Wagmi, React Query, and the OpChan client to the Waku relay layer. Configure it with the content topic you want to publish under plus the reliable channel id you use for the [Waku Reliable Message Channel](https://specs.vac.dev/specs/waku/waku-reliable-message-delivery/).

**Pick your own identifiers.** The content topic and reliable channel ID form the address of your forum data. The sample values below point to the public `https://opchan.app/` deployment; leave them as-is only if you want to read/write the shared data graph. For a separate app, use two unique values (for example `/myapp/1/forum/proto` and `myapp-forum`) and reuse them everywhere you run the OpChan SDK so all clients join the same silo.

```tsx title="src/main.tsx"
import { createRoot } from 'react-dom/client';
import { OpChanProvider } from '@opchan/react';
import { Buffer } from 'buffer';
import App from './App';

if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

const config = {
  // These defaults stream from the hosted https://opchan.app/ deployment;
  // change both values to point the SDK at your own isolated data silo.
  wakuConfig: {
    contentTopic: '/opchan/1/messages/proto',
    reliableChannelId: 'opchan-messages',
  },
  reownProjectId: import.meta.env.VITE_REOWN_PROJECT_ID,
};

createRoot(document.getElementById('root')!).render(
  <OpChanProvider config={config}>
    <App />
  </OpChanProvider>,
);
```

**Understanding `reownProjectId`:**

The `reownProjectId` is required by WalletConnect/Reown (formerly WalletConnect) to identify your application when users connect their wallets. Here's how it works:

- **Why it's needed:** WalletConnect/Reown uses project IDs to manage application registrations, track usage, and provide secure wallet connection services. Without a valid project ID, wallet connection attempts will fail.

- **How the value flows:** 
  1. Set `VITE_REOWN_PROJECT_ID` in your `.env` file (e.g., `VITE_REOWN_PROJECT_ID=your-project-id-here`)
  2. Vite injects it at build time via `import.meta.env.VITE_REOWN_PROJECT_ID`
  3. The value is passed to `OpChanProvider`'s `config` object
  4. `OpChanProvider` internally forwards it to Wagmi's configuration, which initializes WalletConnect/Reown connectors
  5. When users click "Connect Wallet", WalletConnect/Reown uses this project ID to establish the connection

- **Getting a project ID:** Register your application at [cloud.reown.com](https://cloud.reown.com) to receive a free project ID. This ID uniquely identifies your app in the WalletConnect network.

:::tip
Keep secrets out of the bundle: reference the Reown id via an environment variable (`VITE_REOWN_PROJECT_ID`) rather than hard-coding it.
:::

## 2. Understand the hook surface

Most apps can reach for the high-level `useForum()` hook and destructure the four core stores it exposes.

```tsx title="src/App.tsx"
import { useForum } from '@opchan/react';

const { user, content, permissions, network } = useForum();
```

### Advanced: Fine-Grained Hook Reference

For more customized or advanced needs, you can work directly with the individual hooks that power OpChan.

| **Hook**                         | **Purpose**                                                             | **Common Methods/Values**                                  |
|-----------------------------------|-------------------------------------------------------------------------|------------------------------------------------------------|
| `useAuth()`                      | User authentication, call signs, session & identity management           | `connect()`, `startAnonymous()`, `delegate('7days')`, `updateProfile()` |
| `useContent()`                   | Read and write data: cells, posts, comments, votes, bookmarks            | `createPost()`, `vote()`, `moderate.post()`, `pending.isPending(id)` |
| `usePermissions()`               | Check what the user can or can't do, with detailed reasons               | `canCreateCell`, `canModerate(cellId)`, `check('canPost')` |
| `useNetwork()`                   | Network state, Waku connectivity, and hydration cycle                    | `isConnected`, `statusMessage`, `refresh()`                |
| `useUserDisplay(address)`        | Get ENS & call-sign profile info about any Ethereum address              | `displayName`, `ensAvatar`, `verificationStatus`           |
| `useUIState(key, defaultValue, category?)` | Persist UI/user state in IndexedDB                                  | `[value, setValue]` (React state pair)                     |
| `useEthereumWallet()`<br/>`useClient()` | Power-user hooks for direct access to Wagmi or the OpChanClient     | `signMessage()`, direct client/database calls              |

_Note: These hooks can be combined with the high-level `useForum()` API or used independently where your app structure requires._

### Sample snippets

```tsx title="AuthButton.tsx"
import { useAuth } from '@opchan/react';

export function AuthButton() {
  const { currentUser, connect, startAnonymous, disconnect } = useAuth();

  if (currentUser) return <button onClick={disconnect}>Disconnect</button>;

  return (
    <div className="space-y-2">
      <button onClick={connect}>Connect Wallet</button>
      <button onClick={startAnonymous}>Continue Anonymously</button>
    </div>
  );
}
```

```tsx title="CreatePostForm.tsx"
import { useContent } from '@opchan/react';

export function CreatePostForm({ cellId }: { cellId: string }) {
  const { createPost, pending } = useContent();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async () => {
    const post = await createPost({ cellId, title, content: body });
    if (post) {
      setTitle('');
      setBody('');
    }
  };

  return (
    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <textarea value={body} onChange={(event) => setBody(event.target.value)} />
      <button type="submit" disabled={pending.isPending(cellId)}>
        {pending.isPending(cellId) ? 'Syncing…' : 'Publish'}
      </button>
    </form>
  );
}
```

```tsx title="PostActions.tsx"
import { usePermissions } from '@opchan/react';

export function PostActions() {
  const permissions = usePermissions();

  return (
    <div className="space-y-2">
      <button disabled={!permissions.canVote}>
        {permissions.canVote ? 'Upvote' : permissions.reasons.vote}
      </button>
      {!permissions.canCreateCell && (
        <p className="text-sm text-gray-500">{permissions.reasons.createCell}</p>
      )}
    </div>
  );
}
```

```tsx title="NetworkIndicator.tsx"
import { useNetwork } from '@opchan/react';

export function NetworkIndicator() {
  const { isConnected, statusMessage, refresh } = useNetwork();

  return (
    <div className="flex items-center gap-2">
      <span>{statusMessage}</span>
      {!isConnected && <button onClick={refresh}>Reconnect</button>}
    </div>
  );
}
```

```tsx title="AuthorBadge.tsx"
import { useUserDisplay } from '@opchan/react';

export function AuthorBadge({ author }: { author: string }) {
  const { displayName, callSign, ensName, verificationStatus } = useUserDisplay(author);

  return (
    <span>
      {displayName}
      {callSign && ` (#${callSign})`}
      {ensName && ` (${ensName})`}
      {verificationStatus === 'ens-verified' && ' ✅'}
    </span>
  );
}
```

## 3. Compose UX patterns

### Anonymous-first onboarding

```tsx
function PostPage() {
  const { user, permissions } = useForum();

  return (
    <>
      {!user.currentUser && (
        <div className="space-x-2">
          <button onClick={user.connect}>Connect Wallet</button>
          <button onClick={user.startAnonymous}>Continue Anonymously</button>
        </div>
      )}

      {permissions.canComment && <CommentForm />}

      {user.verificationStatus === 'anonymous' && !user.currentUser?.callSign && (
        <CallSignPrompt />
      )}
    </>
  );
}
```

### Permission-gated cells

```tsx
function CellActions() {
  const { permissions } = useForum();
  const check = permissions.check('canCreateCell');

  return check.allowed ? <CreateCellButton /> : <p>{check.reason}</p>;
}
```

Additional reusable patterns:

- **Real-time lists** – `postsByCell` + `pending.isPending(id)` to show optimistic badges.
- **Identity chips** – `useUserDisplay(address)` for ENS/call-sign aware avatars.
- **Pending badges elsewhere** – subscribe to `pending.onChange()` to reflect sync status in any component.

## 4. Authentication flows

### Anonymous path

1. `await startAnonymous()`
2. Immediately interact (posts, comments, votes).
3. Optional: `updateProfile({ callSign: 'my-handle' })`.
4. Later call `connect()` to attach a wallet without losing history.

### Wallet + ENS path

1. `await connect()`.
2. `await verifyOwnership()` to upgrade to an ENS verified user.
3. `await delegate('7days')` or `'30days'` to mint a browser key.
4. Use the full forum surface (create cells, moderate, vote).

## 5. Types and configuration

```ts
type User = {
  address: string; // wallet 0x… or anonymous session UUID
  displayName: string;
  displayPreference: EDisplayPreference;
  verificationStatus: EVerificationStatus;
  callSign?: string;
  ensName?: string;
  ensAvatar?: string;
  lastChecked?: number;
};

enum EVerificationStatus {
  ANONYMOUS = 'anonymous',
  WALLET_UNCONNECTED = 'wallet-unconnected',
  WALLET_CONNECTED = 'wallet-connected',
  ENS_VERIFIED = 'ens-verified',
}

interface OpChanProviderProps {
  config: {
    wakuConfig?: {
      contentTopic?: string;
      reliableChannelId?: string;
    };
    reownProjectId?: string;
  };
  children: React.ReactNode;
}
```

## 6. Reference layout

<details>
<summary>View the end-to-end example</summary>
<br />

The following snippets combine the concepts above into a minimal but complete app shell.

```tsx title="src/main.tsx"
import { createRoot } from 'react-dom/client';
import { OpChanProvider } from '@opchan/react';
import { Buffer } from 'buffer';
import App from './App';

if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

createRoot(document.getElementById('root')!).render(
  <OpChanProvider config={{
    wakuConfig: {
      contentTopic: '/opchan/1/messages/proto',
      reliableChannelId: 'opchan-messages',
    },
    reownProjectId: import.meta.env.VITE_REOWN_PROJECT_ID || 'demo-project-id',
  }}>
    <App />
  </OpChanProvider>
);
```

```tsx title="src/App.tsx"
import { useForum } from '@opchan/react';

export default function App() {
  const { user, network } = useForum();

  if (!network.isHydrated) {
    return <div>Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto p-4">
        {!user.currentUser ? <AuthPrompt /> : <ForumInterface />}
      </main>
    </div>
  );
}
```

```tsx title="src/components/AuthPrompt.tsx"
import { useAuth } from '@opchan/react';

export function AuthPrompt() {
  const { connect, startAnonymous } = useAuth();

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold">Welcome to OpChan</h1>
      <p className="text-gray-400">Choose how you would like to participate:</p>
      <div className="space-y-2">
        <button onClick={connect} className="w-full rounded bg-blue-600 px-4 py-2">Connect Wallet</button>
        <button onClick={startAnonymous} className="w-full rounded bg-gray-600 px-4 py-2">Continue Anonymously</button>
      </div>
    </div>
  );
}
```

```tsx title="src/components/Header.tsx"
import { useAuth } from '@opchan/react';

export function Header() {
  const { currentUser, disconnect, verificationStatus } = useAuth();

  return (
    <header className="bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">OpChan</h1>
        {currentUser && (
          <div className="flex items-center gap-4 text-sm">
            <span>
              {currentUser.displayName}
              {verificationStatus === 'anonymous' && ' (Anonymous)'}
              {verificationStatus === 'ens-verified' && ' (ENS)'}
            </span>
            <button onClick={disconnect} className="text-gray-400 hover:text-white">Disconnect</button>
          </div>
        )}
      </div>
    </header>
  );
}
```

```tsx title="src/components/ForumInterface.tsx"
import { useContent, usePermissions } from '@opchan/react';

export function ForumInterface() {
  const { cells, posts, createPost } = useContent();
  const { canPost, canCreateCell } = usePermissions();

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cells</h2>
          {canCreateCell && <button className="rounded bg-green-600 px-4 py-2">Create Cell</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <CellCard key={cell.id} cell={cell} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Recent Posts</h3>
        <div className="space-y-2">
          {posts.slice(0, 10).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {canPost && cells[0] && (
        <button
          onClick={() => createPost({ cellId: cells[0].id, title: 'Hello', content: 'World' })}
          className="rounded bg-blue-600 px-4 py-2"
        >
          Create Post in first cell
        </button>
      )}
    </div>
  );
}
```

```tsx title="src/components/CellCard.tsx"
import { useContent } from '@opchan/react';

export function CellCard({ cell }) {
  const { postsByCell } = useContent();
  const cellPosts = postsByCell[cell.id] || [];

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h3 className="font-semibold">{cell.name}</h3>
      <p className="mb-2 text-sm text-gray-400">{cell.description}</p>
      <div className="text-xs text-gray-500">{cellPosts.length} posts</div>
    </div>
  );
}
```

```tsx title="src/components/PostCard.tsx"
import { useUserDisplay } from '@opchan/react';

export function PostCard({ post }) {
  const { displayName, callSign, ensName } = useUserDisplay(post.author);

  return (
    <div className="rounded bg-gray-800 p-3">
      <div className="mb-2 flex items-start justify-between text-sm">
        <span>
          {displayName}
          {callSign && ` (#${callSign})`}
          {ensName && ` (${ensName})`}
        </span>
        <span className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</span>
      </div>
      <h4 className="font-medium">{post.title}</h4>
      <p className="mt-1 text-sm text-gray-400">{post.content}</p>
    </div>
  );
}
```

</details>


## 7. Troubleshooting
### "useClient must be used within ClientProvider"

Hooks must live under `<OpChanProvider>`.

```tsx
function App() {
  return (
    <OpChanProvider config={config}>
      <MainApp />
    </OpChanProvider>
  );
}

function MainApp() {
  const { currentUser } = useAuth();
  return <div>Hello</div>;
}
```

### Wallet connection fails

Set `reownProjectId` inside the provider config (WalletConnect / Reown requires a project id).

### `Buffer is not defined`

Add the Buffer polyfill snippet before rendering (see step 1).

### Anonymous users lose permissions after setting a call sign

Ensure your helpers map the `ANONYMOUS` status correctly and that `updateProfile` preserves the existing `verificationStatus`.

### Wallet disconnect clears anonymous sessions

Check that your disconnect UX only clears browser keys for the current mode.

## 9. Quick reference checklist

1. Install `@opchan/react` + `@opchan/core`.
2. Polyfill `Buffer`, wrap the tree with `OpChanProvider`, and pass `wakuConfig` + `reownProjectId`.
3. Use `useForum()` for day-to-day UI; drop down to other hooks when necessary.
4. Gate every action through `usePermissions()` (surface `reasons` in the UI).
5. Render identities through `useUserDisplay()` so ENS + call signs stay in sync.
6. Monitor `network.isHydrated` before rendering expensive components.
7. Show optimistic UI feedback via `pending.isPending(id)` hooks.

## License

MIT — Built with ❤️ for decentralized communities.
