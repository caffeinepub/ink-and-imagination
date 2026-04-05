// Singleton backend accessor for use in async functions
import type { Identity } from "@icp-sdk/core/agent";
import type { backendInterface } from "./backend";
import { ExternalBlob } from "./backend";
import { createActorWithConfig } from "./config";

export type { Manga, UserProfile, UserRole } from "./backend";
export { ExternalBlob } from "./backend";

let _actorPromise: Promise<backendInterface> | null = null;

function getActor(): Promise<backendInterface> {
  if (!_actorPromise) {
    _actorPromise = createActorWithConfig();
  }
  return _actorPromise;
}

type AnyFn = (...args: any[]) => Promise<any>;

// Lazy proxy — all methods are auto-forwarded to the actor
export const backend: backendInterface = new Proxy({} as backendInterface, {
  get(_target, prop: string) {
    return async (...args: unknown[]) => {
      const actor = await getActor();
      const method = (actor as unknown as Record<string, AnyFn>)[prop];
      if (typeof method !== "function")
        throw new Error(`Unknown actor method: ${prop}`);
      return method.apply(actor, args);
    };
  },
});

/**
 * Creates an authenticated backend proxy that uses the given Identity
 * for all calls. This ensures the canister sees the caller's principal,
 * enabling isCallerAdmin() and other identity-gated methods to work.
 */
export function createAuthenticatedBackend(
  identity: Identity,
): backendInterface {
  let _authActorPromise: Promise<backendInterface> | null = null;

  function getAuthActor(): Promise<backendInterface> {
    if (!_authActorPromise) {
      _authActorPromise = createActorWithConfig({
        agentOptions: { identity },
      });
    }
    return _authActorPromise;
  }

  return new Proxy({} as backendInterface, {
    get(_target, prop: string) {
      return async (...args: unknown[]) => {
        const actor = await getAuthActor();
        const method = (actor as unknown as Record<string, AnyFn>)[prop];
        if (typeof method !== "function")
          throw new Error(`Unknown actor method: ${prop}`);
        return method.apply(actor, args);
      };
    },
  });
}

// suppress unused import warning
void ExternalBlob;
