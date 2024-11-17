localStorage.clear()
document.addEventListener('DOMContentLoaded', function() {
    let container = document.querySelector('.students-container');
    let form = document.querySelector('.add-form');
    let errorMessageContainer = document.createElement('div');
    errorMessageContainer.style.color = 'red';
    form.insertBefore(errorMessageContainer, form.firstChild);
    let nameSortFlag, facultySortFlag, burthSortFlag, studySortFlag = false;
    let filterButton = document.querySelector('.filter-button');
    let updateFilterButton = document.querySelector('.update-filter-button');
    let nameFilterInput = document.querySelector('#nameFilter');
    let facultyFilterInput = document.querySelector('#facultyFilter');
    let studyStartInputFilter = document.querySelector('#studyStartFilter');
    let studyEndInputFilter = document.querySelector('#studyEndFilter');
    let nameCleanButton = document.querySelector('#nameClean');
    let facultyCleanButton = document.querySelector('#facultyClean');
    let studyStartCleanButton = document.querySelector('#studyStartClean');
    let studyEndCleanButton = document.querySelector('#studyEndClean');

    let students = JSON.parse(localStorage.getItem('students'));
    if (!Array.isArray(students)) {
        students = [
            {
                id: 0,
                firstName: 'Иван',
                secondName: 'Иванов',
                forename: 'Иванович',
                date: '2000-03-20',
                studyStartYear: '2018',
                faculty: 'ИиВТ',
            },
            {
                id: 1,
                firstName: 'Алексей',
                secondName: 'Алексеев',
                forename: 'Иванович',
                date: '2001-04-10',
                studyStartYear: '2019',
                faculty: 'ИиВТ',
            },
            {
                id: 2,
                firstName: 'Алексей',
                secondName: 'Алексеев',
                forename: 'Алексеевич',
                date: '2005-09-15',
                studyStartYear: '2023',
                faculty: 'АП',
            }
        ];
    };
    
    const createTable = () => {
        let table = document.createElement('table');
        table.classList.add('table');
        let tableHeader = document.createElement('thead');
        let headerRow = document.createElement('tr');
        let headerId = document.createElement('th');
        headerId.textContent = '#';
        let headerFullName = document.createElement('th');
        headerFullName.classList.add('name-sort-button');
        headerFullName.textContent = 'ФИО';
        let headerDate = document.createElement('th');
        headerDate.textContent = 'Дата рождения';
        headerDate.classList.add('age-sort-button');
        let headerStudyStart = document.createElement('th');
        headerStudyStart.textContent = 'Годы обучения';
        headerStudyStart.classList.add('studyStart-sort-button');
        let headerFaculty = document.createElement('th');
        headerFaculty.classList.add('faculty-sort-button');
        headerFaculty.textContent = 'Факультет';
        let headerDelete = document.createElement('th');
        headerDelete.setAttribute('scope', 'col');        
        headerId.setAttribute('scope', 'col');
        headerFullName.setAttribute('scope', 'col');
        headerDate.setAttribute('scope', 'col');
        headerStudyStart.setAttribute('scope', 'col');
        headerFaculty.setAttribute('scope', 'col');
        headerRow.appendChild(headerId);
        headerRow.appendChild(headerFullName);
        headerRow.appendChild(headerDate);
        headerRow.appendChild(headerStudyStart);
        headerRow.appendChild(headerFaculty);
        headerRow.appendChild(headerDelete);
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        let tbody = document.createElement('tbody');
        table.appendChild(tbody);
        container.appendChild(table)        
    };
    
    const updateTable = (filteredStudents = students) => {
        let tableBody = container.querySelector('tbody');
        tableBody.innerHTML = '';
        let studentCount = filteredStudents.length;
        for (let i = 0; i < studentCount; i++) {
            let tableRow = document.createElement('tr');
            let studentId = document.createElement('th');
            studentId.setAttribute('scope', 'row');
            studentId.textContent = i + 1;
            let studentName = filteredStudents[i].firstName;
            let studentSecondName = filteredStudents[i].secondName;
            let studentForeName = filteredStudents[i].forename;
            let studentFullName = document.createElement('td');
            studentFullName.textContent = studentSecondName + " " + studentName + " " + studentForeName;
            let studentDate = document.createElement('td');
            studentDate.textContent = `${filteredStudents[i].date} (${calculateAge(filteredStudents[i].date)})`;
            let studentStudyYears = document.createElement('td');
            studentStudyYears.textContent = `${filteredStudents[i].studyStartYear} - ${parseInt(filteredStudents[i].studyStartYear) + 4} (${calculateCourse(i)})`;
            let studentFaculty = document.createElement('td');
            studentFaculty.classList.add('faculty');
            studentFaculty.textContent = filteredStudents[i].faculty;
            let studentDelete = document.createElement('td');
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&#10006';
            deleteButton.classList.add('bg-white', 'student-delete__button');
            deleteButton.setAttribute('data-id', filteredStudents[i].id);
            deleteButton.addEventListener('click', () => deleteStudent(filteredStudents[i].id));

            tableRow.appendChild(studentId);
            tableRow.appendChild(studentFullName);
            tableRow.appendChild(studentDate);
            tableRow.appendChild(studentStudyYears);
            tableRow.appendChild(studentFaculty);
            studentDelete.appendChild(deleteButton);
            tableRow.appendChild(studentDelete);
            tableBody.appendChild(tableRow);
        }
    };

    const deleteStudent = (studentId) => {
        students = students.filter(student => student.id !== studentId);
        localStorage.setItem('students', JSON.stringify(students));
        updateTable();
    };

    const calculateAge = (studentDate) => {
        let studentDateParse = Date.parse(studentDate);
        let currentDate = new Date();
        let age = currentDate.getFullYear() - new Date(studentDateParse).getFullYear();
        let monthDiff = currentDate.getMonth() - new Date(studentDateParse).getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < new Date(studentDateParse).getDate())) {
            age--;
        }
        let txt;
        count = age % 100;
        if (count >= 5 && count <= 20){
            txt = 'лет';
        } 
        else {
            count = count % 10;
            if (count == 1){
                txt = 'год';
            }
            else if (count >= 2 && count <= 4){
                txt = 'года';
            }
            else {
                txt = 'лет';
            }
        }
        return age+ " " + txt; 
    };

    const calculateCourse = (id) => {
        let actualDate = new Date();
        let studyStart = parseInt(students[id].studyStartYear);
        let studyEnd = studyStart+4;
        let actualYear = actualDate.getFullYear();
        let actualMonth = actualDate.getMonth();
        if ((actualMonth >= 8 && actualYear === studyEnd) || (actualYear > studyEnd)){
            return 'Закончил';
        }
        else if(actualMonth >= 9){
            return `${actualYear - studyStart +1} курс`;
        }
        else{
            return `${actualYear - studyStart} курс`;
        }
    } 

    const addStudent = (event) => {
        event.preventDefault();
        let newStudent = {};
        let newName = document.getElementById('inputName');
        let newSecondName = document.getElementById('inputSecondName');
        let newForeName = document.getElementById('inputForeName');
        let newDate = document.getElementById('inputDate');
        let newStudyDate = document.getElementById('inputStudyDate');
        let newFaculty = document.getElementById('inputFaculty');
        if(checkForm()){
            newStudent.id = students.length;
            newStudent.firstName = newName.value;
            newStudent.secondName = newSecondName.value;
            newStudent.forename = newForeName.value;
            newStudent.date = newDate.value;
            newStudent.studyStartYear = newStudyDate.value;
            newStudent.faculty = newFaculty.value;
    
            students.push(newStudent);
            localStorage.setItem('students', JSON.stringify(students
            ));
            updateTable();
            alert(`Студент ${newStudent.firstName} добавлен`);
            cleanForm();          
        }
        else{
            alert('Пожалуйста, заполните форму корректно.')
        }

    };
    
    const cleanForm = () => {
        let formName = document.getElementById('inputName');
        let formSecondName = document.getElementById('inputSecondName');
        let formForeName = document.getElementById('inputForeName');
        let formDate = document.getElementById('inputDate');
        let formStudyDate = document.getElementById('inputStudyDate');
        let formFaculty = document.getElementById('inputFaculty');

        formName.value = "";
        formSecondName.value = "";
        formForeName.value = "";
        formDate.value = "";
        formStudyDate.value = "";
        formFaculty.value = "";
    };

    const checkForm = () => {
        let newName = document.getElementById('inputName');
        let newSecondName = document.getElementById('inputSecondName');
        let newForeName = document.getElementById('inputForeName');
        let newDate = document.getElementById('inputDate');
        let newStudyDate = document.getElementById('inputStudyDate');
        let newFaculty = document.getElementById('inputFaculty');

        let errors = [];
        let currentYear = new Date().getFullYear();

        if (!newName.value.trim() || !newSecondName.value.trim() || !newDate.value || !newStudyDate.value || !newFaculty.value.trim()) {
            errors.push("Все поля должны быть заполнены.");
        }

        else if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(newName.value)) {
            errors.push("Имя должно содержать только буквы.");
        }
        else if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(newSecondName.value)) {
            errors.push("Фамилия должна содержать только буквы.");
        }
        else if ((!/^[а-яА-ЯёЁa-zA-Z]+$/.test(newForeName.value)) && newForeName.value.trim()) {
            errors.push("Отчество (если есть) должно содержать только буквы.");
        }

        let birthDate = new Date(newDate.value);
        if (birthDate.getFullYear() < 1900 || birthDate > new Date()) {
            errors.push("Дата рождения должна быть в диапазоне от 1900 года до текущей даты.");
        }

        let studyYear = new Date(newStudyDate.value);
        if (studyYear.getFullYear() < 2000 || studyYear > new Date()) {
            errors.push("Год начала обучения должен быть в диапазоне от 2000 года до текущего года.");
        }

        if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(newFaculty.value)) {
            errors.push("Название факультета должно содержать только буквы.");
        }

        if (errors.length > 0) {
            errorMessageContainer.innerHTML = errors.join('<br>');
            return false;
        } else {
            errorMessageContainer.innerHTML = "";
            return true;
        }
    };



    const nameSort = () => {
        students.sort((a, b) => {
            let fullNameA = a.secondName + a.firstName + a.forename;
            let fullNameB = b.secondName + b.firstName + b.forename;
            return nameSortFlag ? fullNameB.localeCompare(fullNameA) : fullNameA.localeCompare(fullNameB);
        });
        
        nameSortFlag = !nameSortFlag;
        
        updateTable();
    };
    
    const facultySort = () => {
        students.sort((a, b) => {
            return facultySortFlag ? b.faculty.localeCompare(a.faculty) : a.faculty.localeCompare(b.faculty);
        });
        facultySortFlag = !facultySortFlag;
        updateTable();
    }

    const ageSort = () => {
        students.sort((a,b) => {
            return burthSortFlag ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
        });
        burthSortFlag = !burthSortFlag;
        updateTable();
    };

    const studyStartSort = () => {
        students.sort((a,b) => {
            return studySortFlag ? b.studyStartYear - a.studyStartYear : a.studyStartYear - b.studyStartYear;
        });
        studySortFlag = !studySortFlag;
        updateTable();
    };

    const nameFilter = () => {
        nameCleanButton.classList.add('actived');
        let nameFilterValue = nameFilterInput.value.toLowerCase();
        let filteredStudents = students.filter(student => {
            return student.firstName.toLowerCase().includes(nameFilterValue) ||
                   student.secondName.toLowerCase().includes(nameFilterValue) ||
                   student.forename.toLowerCase().includes(nameFilterValue);
        });
        updateTable(filteredStudents);
    };

    const facultyFilter = () => {
        facultyCleanButton.classList.add('actived');
        let facultyFilterValue = facultyFilterInput.value.toLowerCase();
        let filteredStudents = students.filter(student => {
            return student.faculty.toLowerCase().includes(facultyFilterValue);
        });
        updateTable(filteredStudents);
    }

    const studyStartFilter = () => {
        studyStartCleanButton.classList.add('actived');
        let studyStartValue = studyStartInputFilter.value;
        let filteredStudents = students.filter(student => {
            return student.studyStartYear === studyStartValue;
        });
        updateTable(filteredStudents);
    }

    
    const studyEndFilter = () => {
        studyEndCleanButton.classList.add('actived');
        let studyEndValue = parseInt(studyEndInputFilter.value);
        let filteredStudents = students.filter(student => {
            let studyEndYear = parseInt(student.studyStartYear) + 4;
            return studyEndYear === studyEndValue;
        });
        updateTable(filteredStudents);
    }



    const filter = (event) => {
        if (nameFilterInput.value.trim() === '' && 
        facultyFilterInput.value.trim() === '' && 
        studyStartInputFilter.value.trim() === '' && 
        studyEndInputFilter.value.trim() === ''){
            updateTable();
        };
        if (nameFilterInput.value.trim() !== '') nameFilter();
        if (facultyFilterInput.value.trim() !== '') facultyFilter();
        if (studyStartInputFilter.value.trim() !== '') studyStartFilter();
        if (studyEndInputFilter.value.trim() !== '') studyEndFilter();
    }
    
    const cleanFilterBlock = (event) => {
        event.preventDefault();
        nameCleanButton.addEventListener('click', nameFilterInput.value = '')
        facultyCleanButton.addEventListener('click', facultyFilterInput.value = '')
        studyStartCleanButton.addEventListener('click', studyStartInputFilter.value = '')
        studyEndCleanButton.addEventListener('click', studyEndInputFilter.value = '')
        
    }

    const cleanFilter = (event) => {
        event.preventDefault();
        nameFilterInput.value = '';
        facultyFilterInput.value = '';
        studyStartInputFilter.value = '';
        studyEndInputFilter.value = '';
        updateTable();
    }

    createTable();
    updateTable();
    form.addEventListener('submit', addStudent);
    const nameSortButton = document.querySelector('.name-sort-button');
    nameSortButton.addEventListener('click', nameSort);
    const facultySortButton = document.querySelector('.faculty-sort-button');
    facultySortButton.addEventListener('click', facultySort);
    const ageSortButton = document.querySelector('.age-sort-button');
    ageSortButton.addEventListener('click', ageSort);
    const studyStartSortButton = document.querySelector('.studyStart-sort-button');
    studyStartSortButton.addEventListener('click', studyStartSort);
    updateFilterButton.addEventListener('click', cleanFilter);
    // filterButton.addEventListener('click', filter);
    nameFilterInput.addEventListener('input', filter);
    facultyFilterInput.addEventListener('input', filter);
    studyStartInputFilter.addEventListener('input', filter);
    studyEndInputFilter.addEventListener('input', filter);
    
});