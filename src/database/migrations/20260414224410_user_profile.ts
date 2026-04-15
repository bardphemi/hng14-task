// third-party libraries
import type { Knex } from "knex";

/**
 * @description migration for creating the profiles table
 * @param knex 
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("profiles", (table) => {
    table.uuid("id").primary();
    table.string("name", 255).notNullable().unique(); 
    table.string("gender", 10).notNullable();
    table.decimal("gender_probability", 3, 2).notNullable();
    table.integer("sample_size").notNullable();
    table.integer("age").notNullable();
    table.string("age_group").notNullable();
    table.string("country_id", 10).notNullable();
    table.decimal("country_probability", 3, 2).notNullable();
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).nullable();
    table.timestamp("deleted_at", { useTz: true }).nullable();
    table.index(["name"]);
    table.index(["country_id"]);
  });
}

/**
 * @description drop table if exists
 * @param knex 
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("profiles");
};
