function showCourseInfo(name, image, startDate, endDate, capacity, description) {
    document.getElementById('modalCourseName').textContent = name;
    document.getElementById('modalCourseImage').src = image;
    document.getElementById('modalCourseStartDate').textContent = startDate;
    document.getElementById('modalCourseEndDate').textContent = endDate;
    document.getElementById('modalCourseCapacity').textContent = capacity;
    document.getElementById('modalCourseDescription').textContent = description;
}