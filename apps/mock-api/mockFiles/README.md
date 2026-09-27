# Legacy mock-server compatibility

Files directly under `mockFiles/` preserve the old `apps/mock-server` route layout. Restapify exposes these files as unversioned `/api/*` routes, while `mockFiles/v1/` contains the PRD-aligned `/api/v1/*` contract.
