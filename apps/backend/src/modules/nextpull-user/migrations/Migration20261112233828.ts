import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261112233828 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "nextpull-user" drop constraint if exists "nextpull-user_next_pull_user_id_unique";`);
    this.addSql(`create table if not exists "nextpull-user" ("id" text not null, "next_pull_user_id" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "nextpull-user_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_nextpull-user_next_pull_user_id_unique" ON "nextpull-user" ("next_pull_user_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_nextpull-user_deleted_at" ON "nextpull-user" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "nextpull-user" cascade;`);
  }

}
