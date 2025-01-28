document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    // Carrega as tarefas salvas ao carregar a página
    loadTasks();

    addBtn.addEventListener('click', () => {
        addTaskFromInput();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskFromInput();
        }
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const li = e.target.closest('li');
            const taskSpan = li.querySelector('.taskText');
            if (e.target.checked) {
                li.classList.add('completed');
                taskSpan.classList.add('completed');
            } else {
                li.classList.remove('completed');
                taskSpan.classList.remove('completed');
            }
            saveTasks();
        }
    });

    function addTaskFromInput() {
        const taskText = taskInput.value;
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    }

    function addTask(task, completed = false) {
        const li = document.createElement('li');

        const taskSpan = document.createElement('span');
        taskSpan.classList.add('taskText');
        taskSpan.textContent = task;
        li.appendChild(taskSpan);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        li.appendChild(buttonContainer);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        if (completed) {
            checkbox.checked = true;
            li.classList.add('completed');
            taskSpan.classList.add('completed');
        }
        buttonContainer.appendChild(checkbox);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.classList.add('removeBtn');
        removeBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Você tem certeza?',
                text: "Esta ação não pode ser desfeita!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, remover!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    li.remove();
                    saveTasks();
                    Swal.fire(
                        'Removido!',
                        'A tarefa foi removida.',
                        'success'
                    );
                }
            });
        });
        buttonContainer.appendChild(removeBtn);

        taskList.appendChild(li);
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const taskText = li.querySelector('.taskText').textContent;
            const completed = li.classList.contains('completed');
            tasks.push({ taskText, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.taskText, task.completed));
    }
});