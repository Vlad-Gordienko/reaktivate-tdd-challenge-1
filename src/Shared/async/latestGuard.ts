export type IsStale = () => boolean;

export function createLatestGuard(): () => IsStale {
  let currentToken = 0;

  return function start(): IsStale {
    const token = ++currentToken;
    return () => token !== currentToken;
  };
}
