# @tcg/react-query

Shared React Query hooks for TCG Community web and future React Native clients. The package depends on `@tcg/api-contracts` and receives platform concerns through `TcgApiProvider`.

The host app supplies:

- the configured API client;
- authenticated-session callbacks;
- optional development fallbacks;
- optional user-facing notification callbacks.

The package does not import Zustand, browser storage, routing, translation, toast libraries, or web-only components.
