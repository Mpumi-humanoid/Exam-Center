function validateForm(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === '' || password === '') {
        alert('Please fill in all fields.');
        return false;
    }

    alert('System access granted. Welcome, ' + username + '!');
    window.location.href = 'home.html';
    return true;
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

function setTodayDate() {
    const todayDate = document.getElementById('today-date');
    if (!todayDate) return;
    todayDate.textContent = formatDate(new Date());
}

function filterRows(rows, callback) {
    let visibleCount = 0;

    rows.forEach((row) => {
        if (callback(row)) {
            row.style.display = '';
            visibleCount += 1;
        } else {
            row.style.display = 'none';
        }
    });

    return visibleCount;
}

function normalizeText(text) {
    return text.trim().toLowerCase();
}

function normalizeSemester(text) {
    return normalizeText(text)
        .replace('semester', 'sem')
        .replace(/\s+/g, ' ')
        .trim();
}

function initResultsFilter() {
    const semesterFilter = document.getElementById('semester-filter');
    const moduleSearch = document.getElementById('module-search');
    const tbody = document.querySelector('.results-table tbody');
    if (!semesterFilter || !moduleSearch || !tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const noResultRow = document.createElement('tr');
    noResultRow.className = 'no-results';
    noResultRow.innerHTML = '<td colspan="6" style="padding: 18px; text-align: center; color: var(--muted);">No matching results found.</td>';
    tbody.appendChild(noResultRow);

    const updateFilter = () => {
        const semesterValue = semesterFilter.value;
        const searchValue = normalizeText(moduleSearch.value);

        const visibleCount = filterRows(rows, (row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return true;

            const moduleCode = normalizeText(cells[1].textContent || '');
            const semester = normalizeSemester(cells[2].textContent || '');

            const semesterMatches = semesterValue === 'All semesters' || normalizeSemester(semesterValue) === semester;
            const moduleMatches = moduleCode.includes(searchValue);

            return semesterMatches && moduleMatches;
        });

        noResultRow.style.display = visibleCount === 0 ? '' : 'none';
    };

    semesterFilter.addEventListener('change', updateFilter);
    moduleSearch.addEventListener('input', updateFilter);
    updateFilter();
}

function initAdminFilter() {
    const studentSearch = document.getElementById('student-search');
    const moduleFilter = document.getElementById('module-filter');
    const statusFilter = document.getElementById('status-filter');
    const tbody = document.querySelector('.results-table-wrap .results-table tbody');
    if (!studentSearch || !moduleFilter || !statusFilter || !tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    const noResultRow = document.createElement('tr');
    noResultRow.className = 'no-results';
    noResultRow.innerHTML = '<td colspan="6" style="padding: 18px; text-align: center; color: var(--muted);">No matching records found.</td>';
    tbody.appendChild(noResultRow);

    const updateFilter = () => {
        const studentValue = normalizeText(studentSearch.value);
        const moduleValue = normalizeText(moduleFilter.value);
        const statusValue = normalizeText(statusFilter.value);

        const visibleCount = filterRows(rows, (row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) return true;

            const studentCode = normalizeText(cells[0].textContent || '');
            const moduleCode = normalizeText(cells[1].textContent || '');
            const statusText = normalizeText(cells[4].textContent || '');

            const studentMatches = studentCode.includes(studentValue);
            const moduleMatches = moduleCode.includes(moduleValue);
            const statusMatches = statusValue === 'all statuses' || statusText.includes(statusValue);

            return studentMatches && moduleMatches && statusMatches;
        });

        noResultRow.style.display = visibleCount === 0 ? '' : 'none';
    };

    studentSearch.addEventListener('input', updateFilter);
    moduleFilter.addEventListener('input', updateFilter);
    statusFilter.addEventListener('change', updateFilter);
    updateFilter();
}

function initCaptureForm() {
    const captureForm = document.querySelector('.capture-form');
    if (!captureForm) return;

    captureForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const studentId = document.getElementById('student-id');
        const moduleCode = document.getElementById('module-code');
        const semester = document.getElementById('semester');
        const mark = document.getElementById('mark');

        if (!studentId || !moduleCode || !semester || !mark) {
            return;
        }

        const markValue = Number(mark.value);
        if (studentId.value.trim() === '' || moduleCode.value.trim() === '' || Number.isNaN(markValue)) {
            alert('Please complete student, module, semester, and mark fields.');
            return;
        }

        if (markValue < 0 || markValue > 100) {
            alert('Mark must be between 0 and 100.');
            return;
        }

        alert('Result captured for ' + studentId.value.trim() + ' (' + moduleCode.value.trim() + ').');
        captureForm.reset();
    });
}

function initPage() {
    setTodayDate();
    initResultsFilter();
    initAdminFilter();
    initCaptureForm();

    const loginForm = document.getElementById('login-form');
    const roleInput = document.getElementById('role');
    if (loginForm && !roleInput) {
        loginForm.addEventListener('submit', validateForm);
    }
}

document.addEventListener('DOMContentLoaded', initPage);
