const enum LockStatus {
    Unlocked,
    Locked,
}

export type Mutex = Int32Array;

/**
 * @returns An {@link Int32Array} to be used as a {@link Mutex}.
 */
export const createMutex = (): Mutex => {
    const arr = new Int32Array(new SharedArrayBuffer(4));
    arr.set([LockStatus.Unlocked]);
    return arr;
};

/**
 * @deprecated
 * Use {@link createMutex} instead.
 */
export const newMutex = createMutex;

/**
 * Unlocked a currently locked mutex. Must not be already unlocked,
 * otherwise an error will be thrown.
 *
 * @param mutex A {@link Mutex} created using `newMutex()`.
 */
export const unlock = (mutex: Mutex) => {
    if (Atomics.compareExchange(mutex, 0, LockStatus.Locked, LockStatus.Unlocked) !== LockStatus.Locked) {
        throw new Error('Mutex inconsistency. Cannot unlock an already unlocked mutex.');
    }
    Atomics.notify(mutex, 0, 1);
};

/**
 * Wait until the mutex is unlocked, then lock it, blocking other
 * agents from locking it until it's unlocked again.
 *
 * @param mutex A {@link Mutex} created using `createMutex()`.
 */
export const lockSync = (mutex: Mutex) => {
    // Spin until the mutex is unlocked & can be re-locked.
    while (Atomics.compareExchange(mutex, 0, LockStatus.Unlocked, LockStatus.Locked) !== LockStatus.Unlocked) {
        // If locked, wait for a notification.
        Atomics.wait(mutex, 0, LockStatus.Locked, Infinity);
    }

    return {
        [Symbol.dispose]: () => unlock(mutex),
    };
};

/**
 * Wait until the mutex is unlocked, then lock it, blocking other
 * agents from locking it until it's unlocked again.
 *
 * @param mutex A {@link Mutex} created using `createMutex()`.
 */
export const lock = async (mutex: Mutex) => {
    // Spin until the mutex is unlocked & can be re-locked.
    while (Atomics.compareExchange(mutex, 0, LockStatus.Unlocked, LockStatus.Locked) !== LockStatus.Unlocked) {
        // If locked, wait for a notification.
        await Atomics.waitAsync(mutex, 0, LockStatus.Locked, Infinity).value;
    }

    return {
        [Symbol.dispose]: () => unlock(mutex),
    };
};
