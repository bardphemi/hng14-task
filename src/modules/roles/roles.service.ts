import roleDao from "./roles.dao";

const roleService = {
  async fectchRoles() { },

  /**
   * @description
   * @param roleId 
   * @returns 
   */
  async fetchRoleById(roleId: string) {
    return await roleDao.fetchRoleById(roleId)
  }
};

export default roleService;
