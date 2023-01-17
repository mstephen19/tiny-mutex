const enum LockStatus {
    Unlocked,
    Locked,
}

export type Mutex = Int32Array;

/**
 * @returns An {@link Int32Array} to be used as a {@link Mutex}.
 */
export function newMutex(): Mutex {
    const arr = new Int32Array(new SharedArrayBuffer(4));
    arr.set([LockStatus.Unlocked]);
    return arr;
}

const lockSync = (mutex: Mutex) => {
    if (Atomics.compareExchange(mutex, 0, LockStatus.Unlocked, LockStatus.Locked) === LockStatus.Unlocked) {
        return;
    }

    Atomics.wait(mutex, 0, LockStatus.Locked, Infinity);
    lockSync(mutex);
};

/**
 * Wait until the mutex is unlocked, then lock it, blocking other
 * agents from locking it until it's unlocked again.
 *
 * @param mutex A {@link Mutex} created using `newMutex()`.
 */
export function lock(mutex: Mutex): Promise<void> {
    return new Promise((resolve) => {
        lockSync(mutex);
        resolve();
    });
}

/**
 * Unlocked a currently locked mutex. Must not be already unlocked,
 * otherwise an error will be thrown.
 *
 * @param mutex A {@link Mutex} created using `newMutex()`.
 */
export function unlock(mutex: Mutex) {
    if (Atomics.compareExchange(mutex, 0, LockStatus.Locked, LockStatus.Unlocked) !== LockStatus.Locked) {
        throw new Error('Mutex inconsistency. Cannot unlock an already unlocked mutex.');
    }
    Atomics.notify(mutex, 0, 1);
}
