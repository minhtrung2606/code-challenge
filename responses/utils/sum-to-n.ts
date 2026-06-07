/**
 * Sum to n using equation
 * @param n
 * @returns
 */
export function sumFromOneToNByEquation(n: bigint): bigint {
  return (n * (n + 1n)) / 2n;
}

/**
 * Sum to n using a loop
 * @param n
 * @returns
 */
export function sumFromOneToNByLoop(n: bigint): bigint {
  let sum = 0n;

  for (let i = 1n; i <= n; i++) {
    sum += i;
  }

  return sum;
}

/**
 * Sum to n using recursion
 * @param n
 * @returns
 */
export function sumFromOneToNByRecursion(n: bigint): bigint {
  if (n <= 0n) {
    return 0n;
  }

  return n + sumFromOneToNByRecursion(n - 1n);
}

function sumFromOneToNInWorker(value: string, computationMethod: string) {
  return new Promise<string>((resolve, reject) => {
    const workerCode = `
      self.onmessage = function (event) {
        try {
          const eventData = JSON.parse(event.data)

          const n = BigInt(eventData.value);

          function sumFromOneToNByEquation(n) {
            return (n * (n + 1n)) / 2n;
          }
          
          function sumFromOneToNByLoop(n) {
            let sum = 0n;
          
            for (let i = 1n; i <= n; i++) {
              sum += i;
            }
          
            return sum;
          }
          
          function sumFromOneToNByRecursion(n) {
            if (n <= 0n) {
              return 0n;
            }
          
            return n + sumFromOneToNByRecursion(n - 1n);
          }
          
          function sumFromOneToN(n, method) {
            if (method === "equation") {
              return sumFromOneToNByEquation(n);
            }
          
            if (method === "loop") {
              return sumFromOneToNByLoop(n);
            }
          
            return sumFromOneToNByRecursion(n);
          }

          const result = sumFromOneToN(n, eventData.method);

          self.postMessage({
            result: result.toString(),
          });
        } catch (error) {
          self.postMessage({
            error: error instanceof Error ? error.message : "Calculation failed.",
          });
        }
      };
    `;

    const blob = new Blob([workerCode], {
      type: "text/javascript",
    });

    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    function cleanup() {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    }

    worker.onmessage = (event) => {
      cleanup();

      const data = event.data as {
        result?: string;
        error?: string;
      };

      if (data.error) {
        reject(new Error(data.error));
        return;
      }

      if (!data.result) {
        reject(new Error("Calculation returned no result."));
        return;
      }

      resolve(data.result);
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message));
    };

    worker.postMessage(JSON.stringify({ value, method: computationMethod }));
  });
}

export async function sumToN(value: string, computationMethod: string) {
  return await sumFromOneToNInWorker(value, computationMethod);
}
