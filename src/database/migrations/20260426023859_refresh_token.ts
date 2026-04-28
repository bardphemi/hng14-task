// third-party libraries
import type { Knex } from "knex";

/**
 * @description creates token table
 * @param knex 
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await knex.schema.createTable("refresh_tokens", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")
      .index();
    table.text("token_hash").notNullable().unique();
    table
      .timestamp("expires_at", { useTz: true })
      .notNullable()
      .index();
    table
      .boolean("is_revoked")
      .notNullable()
      .defaultTo(false)
      .index();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.index(["user_id", "is_revoked"]);
    table.index(["user_id", "expires_at"]);
  });
}

/**
 * @description drops table
 * @param knex 
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("refresh_tokens");
}
