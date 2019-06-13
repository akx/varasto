# varasto-storage

Low level API for the Varasto JSON key-value store.

## Installation

```bash
$ npm install --save varasto-storage
```

## Usage

The package provides class called `Storage`, which provides an API very similar
to [Web Storage API].

Basic usage of the `Storage` class looks like this:

```TypeScript
import { Storage } from 'varasto-storage';

const storage = new Storage({ dir: './data' });
```

The constructor takes an optional configuration object, which supports these
settings:

Property   | Default value | Description
---------- | ------------- | -----------
`dir`      | `./data`      | Directory where the items will be persisted into.
`encoding` | `utf-8`       | Character encoding to use when items are stored onto the disk.

If `dir` does not exist, it will be created when an item is stored into the
storage.

### Storing items

```TypeScript
setItem(key: string, value: Object): Promise<void>
```

Attempts to store an item identified by `key`. Returned promise will fail if an
I/O error occurs while storing the item.

### Retrieving items

```TypeScript
getItem(key: string): Promise<Object|undefined>
```

Attempts to retrieve an item identified by `key`. Returned promise will either
resolve into the value, or `undefined` if item with the given identifier does
not exist. The promise will fail if an I/O error occurs while retrieving the
item.

### Removing items

```TypeScript
removeItem(key: string): Promise<boolean>
```

Attempts to remove an item identified by `key`. Returned promise will resolve
into a boolean value which tells whether an value with the given identifier
existed or not. The promise will fail if an I/O error occurs while removing the
item.

[Web Storage API]: https://developer.mozilla.org/en-US/docs/Web/API/Storage
