export default {
  async get(pathUri: string) {
    const API = `https://api-telegramadmin.herokuapp.com/${pathUri}`;
    try {
      return await fetch(API).then((response) => response.json());
    } catch (error) {
      throw error || `Not Found`;
    }
  },

  async getUser() {
    return await this.get(`user`);
  },
  async getGroup() {
    return await this.get(`group`);
  },
  async getChannel() {
    return await this.get(`channel/all`);
  },
};
