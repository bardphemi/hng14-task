// third-aprty libraries
import type { Knex } from "knex";

/**
 * @description seeds db with deafault roles
 * @param knex 
 */
export async function seed(knex: Knex): Promise<void> {
  await knex("roles").del();
  await knex("roles").insert([
    {
      name: "admin",
      description: "Full access",
    },
    {
      name: "analyst",
      description: "Read-only access",
    },
  ]);
}

