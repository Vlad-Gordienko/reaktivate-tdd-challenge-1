export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

export const flushPromises = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 0));
