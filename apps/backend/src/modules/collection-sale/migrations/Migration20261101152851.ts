import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261101152851 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "card_sale" drop constraint if exists "card_sale_product_id_unique";`);
    this.addSql(`create table if not exists "card_sale" ("id" text not null, "product_id" text not null, "variant_id" text not null, "external_collection_id" text not null, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "card_sale_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_card_sale_product_id_unique" ON "card_sale" ("product_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_card_sale_external_collection_id" ON "card_sale" ("external_collection_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_card_sale_deleted_at" ON "card_sale" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "card_sale_item" ("id" text not null, "external_card_id" text not null, "unit_price" numeric not null, "currency_code" text not null default 'egp', "quantity_available" integer not null default 1, "condition" text check ("condition" in ('mint', 'near_mint', 'excellent', 'good', 'played')) not null default 'near_mint', "status" text check ("status" in ('active', 'inactive')) not null default 'active', "sale_id" text not null, "raw_unit_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "card_sale_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_card_sale_item_external_card_id" ON "card_sale_item" ("external_card_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_card_sale_item_sale_id" ON "card_sale_item" ("sale_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_card_sale_item_deleted_at" ON "card_sale_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "card_sale_item" add constraint "card_sale_item_sale_id_foreign" foreign key ("sale_id") references "card_sale" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "card_sale_item" drop constraint if exists "card_sale_item_sale_id_foreign";`);

    this.addSql(`drop table if exists "card_sale" cascade;`);

    this.addSql(`drop table if exists "card_sale_item" cascade;`);
  }

}
