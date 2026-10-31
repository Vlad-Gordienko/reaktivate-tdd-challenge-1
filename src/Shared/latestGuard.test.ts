import { createLatestGuard } from "./latestGuard";

describe("createLatestGuard", () => {
  it("marks an earlier call as stale once a later call is made", () => {
    const start = createLatestGuard();

    const firstIsStale = start();
    expect(firstIsStale()).toBe(false);

    const secondIsStale = start();
    expect(firstIsStale()).toBe(true);
    expect(secondIsStale()).toBe(false);
  });

  it("reports the most recent call as not stale", () => {
    const start = createLatestGuard();

    start();
    const latestIsStale = start();

    expect(latestIsStale()).toBe(false);
  });

  it("keeps independent guards from affecting each other", () => {
    const startA = createLatestGuard();
    const startB = createLatestGuard();

    const aFirst = startA();
    const bFirst = startB();

    startA();

    expect(aFirst()).toBe(true);
    expect(bFirst()).toBe(false);
  });
});
