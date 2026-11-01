export async function withMinimumDuration<T>(task: Promise<T>, minDurationMs: number): Promise<T> {
  if (process.env.NODE_ENV === "test") {
    return task;
  }

  const startedAt = Date.now();
  try {
    return await task;
  } finally {
    const elapsed = Date.now() - startedAt;
    if (elapsed < minDurationMs) {
      await new Promise<void>((resolve) => setTimeout(resolve, minDurationMs - elapsed));
    }
  }
}
