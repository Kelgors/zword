export type WaitOptions = {
  signal?: AbortSignal;
};
export function wait(timeout: number, options?: WaitOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    function onAbort() {
      reject(new Error('AbortError'));
    }
    const signal = options?.signal;
    signal?.addEventListener('abort', onAbort);
    setTimeout(() => {
      if (signal) {
        if (signal.aborted) return reject(new Error('AbortError'));
        signal.removeEventListener('abort', onAbort);
      }
      resolve();
    }, timeout);
  });
}
