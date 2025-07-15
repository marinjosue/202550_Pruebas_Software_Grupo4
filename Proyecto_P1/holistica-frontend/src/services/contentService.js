import ApiClient from '../utils/apiClient';

class ContentService extends ApiClient {
  constructor() {
    super('content');
  }

  async getContentByCourse(courseId) {
    return this.get(`/course/${courseId}`);
  }

  async createContent(contentData) {
    return this.create(contentData);
  }

  async updateContent(id, contentData) {
    return this.update(id, contentData);
  }

  async deleteContent(id) {
    return this.delete(id);
  }

  async getContentById(id) {
    return this.getById(id);
  }
}

export default new ContentService();
