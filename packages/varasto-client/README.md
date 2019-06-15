# varasto-client

Node.js client library for Varasto JSON key-value store.

## Installation

```bash
$ npm install --save varasto-client
```

## Usage

The libary exports single class, `Client`, which when instantiated can be used
to connect to Varasto server. Constructor of `Client` class takes an optional
configuration object, which supports these settings:

Property   | Default value | Description
---------- | ------------- | -----------
`hostname` | `0.0.0.0`     | Hostname of the server to which to connect to.
`port`     | `3000`        | Port of the server to which to connect to.
`secure`   | `false`       | Whether HTTPS should be used or not.

### Storing items

```TypeScript
setItem(key: string, value: Object): Promise<void>
```

Attempts to connect to the server and store an item identified by `key`.

### Retrieving items

```TypeScript
getItem(key: string): Promise<Object|undefined>
```

Attempts to connect to the server and retrieve an item identified by `key`.
Returned promise will resolve into value of the item, or `undefined` if the
item does not exist.

### Removing items

```TypeScript
removeItem(key: string): Promise<Object|undefined>
```

Attempts to connect to the server and remove an item identified by `key`.
Returned promise will resolve into value of the removed item, or `undefined` if
the item does not exist.

### Updating items

```TypeScript
updateItem(key: string, value): Promise<Object|undefined>
```

Attempts to connect to the server and perform an partial update to an item
identified by `key`. Returned promise will resolve into value of the updated
item after the update, or `undefined` if the item does not exist.
