## Docker

- Old Docker setup and docs are retired.
- New flow builds only `apps/backend`; PostgreSQL and Redis stay external.
- Backend environment lives in `apps/backend/.env`.
- Database migrations are manually run from the built backend image.
