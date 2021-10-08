export default {
  async get(pathUri: string) {
    const API = `https://api-telegramadmin.herokuapp.com/${pathUri}`;
    try {
      return await fetch(API).then((response) => response.json());
    } catch (error: any) {
      throw error.message || `Not Found`;
    }
  },

  async getUser() {
    return await this.get(`user`);
  },
};
