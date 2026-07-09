# capacitor-hybrid-vnptid

monremeeting.hybrid.vnptid

## Install

```bash
npm install capacitor-hybrid-vnptid
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`signIn()`](#signin)
* [`signOut()`](#signout)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### signIn()

```typescript
signIn() => Promise<{ status: boolean; message: string; data?: string; token?: string; tokenAccess?: string; tokenRefresh?: string; }>
```

**Returns:** <code>Promise&lt;{ status: boolean; message: string; data?: string; token?: string; tokenAccess?: string; tokenRefresh?: string; }&gt;</code>

--------------------


### signOut()

```typescript
signOut() => Promise<{ status: boolean; message: string; }>
```

**Returns:** <code>Promise&lt;{ status: boolean; message: string; }&gt;</code>

--------------------

</docgen-api>
