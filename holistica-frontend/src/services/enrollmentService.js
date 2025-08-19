import ApiClient from '../utils/apiClient';

class EnrollmentService extends ApiClient {
  constructor() {
    super('enrollments');
  }

  async checkEnrollmentStatus(courseId) {
    return this.get(`/check/${courseId}`);
  }

  async enrollInCourse(courseId) {
    return this.post('/', { course_id: courseId });
  }

  async getMyEnrollments() {
    return this.get('/my-enrollments');
  }

  async cancelEnrollment(enrollmentId) {
    return this.delete(`/${enrollmentId}`);
  }

  async getEnrollmentDetails(enrollmentId) {
    return this.getById(enrollmentId);
  }

  async updateProgress(enrollmentId, progress) {
    return this.put(`/${enrollmentId}/progress`, { progress });
  }
}

export default new EnrollmentService();
