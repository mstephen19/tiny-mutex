# Tiny Mutex

Lightweight and simple mutexes.

## Features

- Zero dependencies. Small bundle size.
- Written in TypeScript.
- Simple to use. Modeled after Golang's [`sync.Mutex`](https://go.dev/tour/concurrency/9)
- Modern ESModules support.
- Thread-safe. Works perfectly with multithreading libraries like [Nanolith](https://www.npmjs.com/package/nanolith).

## Usage

It's dead simple. There are only three functions to know.

```TypeScript
import { newMutex, lock, unlock } from 'tiny-mutex'

// Create a mutex
const mutex = newMutex();

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
