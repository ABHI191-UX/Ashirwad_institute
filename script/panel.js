const API_BASE = 'http://localhost:5000/api';
// Change this line from localhost to your deployed Render backend link
// const API_BASE = 'https://onrender.com';


        // Navigation
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Update nav links
            document.querySelectorAll('.sidebar-menu a').forEach(el => el.classList.remove('active'));
            event.target.closest('a').classList.add('active');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'inquiries': 'Student Inquiries',
                'courses': 'Course Management',
                'notices': 'Notices & Updates',
                'testimonials': 'Testimonials',
                'institute': 'Institute Information'
            };
            document.getElementById('page-title').textContent = titles[sectionId] || 'Dashboard';
            
            // Load section data
            loadSectionData(sectionId);
        }

        function loadSectionData(sectionId) {
            switch(sectionId) {
                case 'dashboard':
                    loadStatistics();
                    break;
                case 'inquiries':
                    loadInquiries();
                    break;
                case 'courses':
                    loadCourses();
                    break;
                case 'notices':
                    loadNotices();
                    break;
                case 'testimonials':
                    loadTestimonials();
                    break;
                case 'institute':
                    loadInstituteInfo();
                    break;
            }
        }

        // Statistics
        async function loadStatistics() {
            try {
                const response = await fetch(`${API_BASE}/admin/statistics`);
                const data = await response.json();
                
                document.getElementById('total-inquiries').textContent = data.totalInquiries || 0;
                document.getElementById('enrolled-students').textContent = data.enrolledStudents || 0;
                document.getElementById('total-courses').textContent = data.totalCourses || 0;
                
                loadRecentInquiries(data.recentInquiries);
            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        }

        function loadRecentInquiries(inquiries) {
            const tbody = document.getElementById('recent-inquiries');
            tbody.innerHTML = '';
            
            if (inquiries.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No inquiries yet</td></tr>';
                return;
            }
            
            inquiries.forEach(inquiry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${inquiry.full_name}</td>
                    <td>${inquiry.mobile}</td>
                    <td>${inquiry.course}</td>
                    <td><span class="status-badge status-${inquiry.status}">${inquiry.status}</span></td>
                    <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-success" onclick="viewInquiry(${inquiry.inquiry_id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Inquiries
        async function loadInquiries() {
            try {
                const response = await fetch(`${API_BASE}/admin/inquiries`);
                const inquiries = await response.json();
                
                const tbody = document.getElementById('all-inquiries');
                tbody.innerHTML = '';
                
                inquiries.forEach(inquiry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${inquiry.full_name}</td>
                        <td>${inquiry.mobile}</td>
                        <td>${inquiry.email || '-'}</td>
                        <td>${inquiry.course}</td>
                        <td>${inquiry.timing || '-'}</td>
                        <td><span class="status-badge status-${inquiry.status}">${inquiry.status}</span></td>
                        <td>${new Date(inquiry.created_at).toLocaleDateString()}</td>
                        <td>
                            <div class="action-buttons">
                                <select class="form-select form-select-sm" onchange="updateInquiryStatus(${inquiry.inquiry_id}, this.value)">
                                    <option value="">Update Status</option>
                                    <option value="contacted">Mark Contacted</option>
                                    <option value="enrolled">Mark Enrolled</option>
                                    <option value="rejected">Mark Rejected</option>
                                </select>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading inquiries:', error);
            }
        }

        async function updateInquiryStatus(id, status) {
            if (!status) return;
            
            try {
                const response = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                
                if (response.ok) {
                    alert('Status updated successfully');
                    loadInquiries();
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }

        // Courses
        async function loadCourses() {
            try {
                const response = await fetch(`${API_BASE}/courses`);
                const courses = await response.json();
                
                const tbody = document.getElementById('courses-list');
                tbody.innerHTML = '';

                if (courses.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No courses found</td></tr>';
                    return;
                }
                
                courses.forEach(course => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${course.course_name}</td>
                        <td>${course.course_type}</td>
                        <td>${course.level}</td>
                        <td>${course.duration_weeks} weeks</td>
                        <td>₹${course.fees}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-success"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-small btn-danger"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        }

        // Notices
        async function loadNotices() {
            try {
                const response = await fetch(`${API_BASE}/notices`);
                const notices = await response.json();
                
                const tbody = document.getElementById('notices-list');
                tbody.innerHTML = '';

                if (notices.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No notices found</td></tr>';
                    return;
                }
                
                notices.forEach(notice => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${notice.title}</td>
                        <td>${notice.category || '-'}</td>
                        <td>${new Date(notice.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-small btn-danger" onclick="deleteNotice(${notice.notice_id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading notices:', error);
            }
        }

        function createNotice(event) {
            event.preventDefault();
            // Implementation for creating notice
            alert('Notice created! (Implementation pending)');
        }

        // Testimonials
        async function loadTestimonials() {
            try {
                const response = await fetch(`${API_BASE}/testimonials`);
                const testimonials = await response.json();
                
                const tbody = document.getElementById('pending-testimonials');
                tbody.innerHTML = '';
                
                if (testimonials.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No pending testimonials</td></tr>';
                }
                
                testimonials.forEach(test => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${test.student_name}</td>
                        <td>${test.course || '-'}</td>
                        <td><i class="fas fa-star" style="color: var(--secondary-color);"></i> ${test.rating}</td>
                        <td>${test.testimonial_text.substring(0, 50)}...</td>
                        <td>
                            <button class="btn btn-small btn-success"><i class="fas fa-check"></i></button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error loading testimonials:', error);
            }
        }

        // Institute Info
        async function loadInstituteInfo() {
            try {
                const response = await fetch(`${API_BASE}/institute-info`);
                const info = await response.json();
                
                document.getElementById('institute-name').value = info.name || '';
                document.getElementById('institute-address').value = info.address || '';
                document.getElementById('institute-phone1').value = info.phone1 || '';
                document.getElementById('institute-phone2').value = info.phone2 || '';
                document.getElementById('institute-email').value = info.email || '';
                document.getElementById('institute-about').value = info.about || '';
            } catch (error) {
                console.error('Error loading institute info:', error);
            }
        }

        function updateInstituteInfo(event) {
            event.preventDefault();
            alert('Institute info updated! (Implementation pending)');
        }

        // Utility functions
        function showModal(modalId) {
            alert('Modal functionality (Implementation pending)');
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '/login.html';
            }
        }

        // Load dashboard on page load
        window.addEventListener('load', () => {
            loadStatistics();
        });