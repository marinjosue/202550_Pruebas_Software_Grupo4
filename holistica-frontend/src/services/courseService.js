import ApiClient from '../utils/apiClient';


class CourseService extends ApiClient {
  constructor() {
    super('courses');
  }

  async getAllCourses(params = {}) {
    const data = await this.getAll(params);
    return data;
  }

  async getCourseById(id) {
    const data = await this.getById(id);
    return data;
  }

  async createCourse(courseData) {
    return this.create(courseData);
  }

  async updateCourse(id, courseData) {
    return this.update(id, courseData);
  }

  async deleteCourse(id) {
    return this.delete(id);
  }

  async enrollCourse(courseId) {
    try {
      const enrollmentService = await import('./enrollmentService');
      return await enrollmentService.default.enrollInCourse(courseId);
    } catch (error) {
      throw new Error(error.message || 'Error al inscribirse en el curso');
    }
  }

  async getMyCourses() {
    try {
      const enrollmentService = await import('./enrollmentService');
      return await enrollmentService.default.getMyEnrollments();
    } catch (error) {
      throw new Error(error.message || 'Error al obtener mis cursos');
    }
  }
}

const courseService = new CourseService();
export default courseService;