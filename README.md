# Tiny Mutex

[![TypeScript](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)](https://www.typescriptlang.org/) [![Install size](https://packagephobia.com/badge?p=speedwalk@latest)](https://packagephobia.com/result?p=tiny-mutex@latest)

Lightweight and simple mutexes.

## Features

- Zero dependencies. Small bundle size.
- Written in TypeScript.
- CommonJS & ESModules support.
- Thread-safe. Works with worker threads and multithreading libraries like [Piscina](https://www.npmjs.com/package/piscina).
- Simple to use. Modeled after Golang's [`sync.Mutex`](https://go.dev/tour/concurrency/9)

## Usage

```TypeScript
import { createMutex, lock, unlock } from 'tiny-mutex'

// Create a mutex, usable in a cross-thread context
const mutex = createMutex();

async function doWorkflow(shared: Uint8Array) {
    // Wait until the mutex is unlocked, then lock it.
    await lock(mutex);

    // Modify a resource normally without worrying about
    // other threads modifying it at the same time.
    shared.set([1, 2, 3])

    // Unlock the mutex once finished with modifying the
    // resource, unblocking other agents.
    unlock(mutex);
}
```
