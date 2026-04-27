import type { Knex } from "knex";


/**
 * @description roles table
 * @param knex 
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  await knex.schema.createTable("roles", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .string("name")
      .notNullable()
      .unique();
    table.text("description");
    table
      .timestamp("created_at", { useTz: true })
      .defaultTo(knex.fn.now());
  });
}

/**
 * @description revert
 * @param knex 
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("roles");
}
