import type { Knex } from "knex";

/**
 * @description add constraint
 * @param knex 
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("profiles", (table) => {
    table.dropUnique(["name"], "profiles_name_unique");
    table.integer("sample_size").nullable().alter();
    table.string("country_name", 50);
    table.unique(
      ["name", "age", "country_id"],
      { indexName: "profiles_unique_identity" }
    );
  });

  await knex.raw(`
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_gender_check
    CHECK (gender IN ('male', 'female'))
  `);
}

/**
 * @description revert migration
 * @param knex 
 */
export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE profiles
    DROP CONSTRAINT IF EXISTS profiles_gender_check
  `);
  await knex.schema.alterTable("profiles", (table) => {
    table.integer("sample_size").notNullable().alter();
    table.dropColumn("country_name");
    table.dropUnique(
      ["name", "age", "country_id"],
      "profiles_unique_identity"
    );
    table.unique(["name"], { indexName: "profiles_name_unique" });
  });
}
