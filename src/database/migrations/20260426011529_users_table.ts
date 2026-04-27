// third-party lbiraries
import type { Knex } from "knex";

/**
 * @description creates users table
 * @param knex 
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await knex.schema.createTable("users", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .string("github_id", 50)
      .notNullable()
      .unique()
      .index();
    table.string("username", 100).notNullable();
    table.string("email", 255).index();
    table.string("avatar_url", 500);
    table
      .uuid("role_id")
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE")
      .index();
    table
      .string("role", 20)
      .notNullable()
      .index();
    table
      .boolean("is_active")
      .notNullable()
      .defaultTo(true)
      .index();
    table.timestamp("last_login_at", { useTz: true });
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.index(["role_id", "is_active"]);
    table.index(["role", "is_active"]);
  });
}

/**
 * @description reverts
 * @param knex 
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
