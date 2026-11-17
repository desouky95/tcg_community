# TCG catalogue MCP server

Local, read-only MCP tools for the Adonis TCG catalogue and Medusa store. Requires Node 24, pnpm, running services, and a Medusa publishable API key.

From the repository root:

```sh
pnpm install
pnpm --filter @tcg/mcp build
```

Add this server to a stdio-compatible MCP client, replacing the path and key:

```json
{
  "mcpServers": {
    "tcg-catalogues": {
      "command": "node",
      "args": ["/absolute/path/to/tcg_community/apps/mcp/dist/index.js"],
      "env": {
        "TCG_API_URL": "http://localhost:3333/api/v1/",
        "MEDUSA_BACKEND_URL": "http://localhost:9000",
        "MEDUSA_PUBLISHABLE_KEY": "your-publishable-key",
        "MEDUSA_REGION_ID": "reg_your-region-id"
      }
    }
  }
}
```

`TCG_API_URL` and `MEDUSA_BACKEND_URL` default to the addresses shown. `MEDUSA_REGION_ID` is optional; without it products may not include calculated prices. Use HTTPS for any non-local TCG API URL. Configure the publishable key for the sales channel containing the products.

Call `browser_login` to open the local sign-in page before accessing checklists or cards. Sign in using an existing verified account. The server keeps the session only in memory; sign in again after a restart or session expiry. The page expires after five minutes and permits retries until successful. The server does not expose credentials or cookies as tool results. Card results follow the API's existing account and collection access rules.

The server does not modify catalogue data. Authentication itself updates account login state through the existing API. If a service is unavailable, check its URL, configuration and logs, then retry.
