document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const dueDateInput = document.getElementById("dueDateInput");
  const tagsInput = document.getElementById("tagsInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const searchBox = document.getElementById("searchBox");
  const toggleDarkMode = document.getElementById("toggleDarkMode");

  let isDarkMode = false;

  // Load existing tasks from localStorage
  loadTasks();

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
      const priority = prioritySelect.value;
      const dueDate = dueDateInput.value;
      const tags = tagsInput.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const task = {
        id: Date.now(),
        text,
        priority,
        dueDate,
        tags,
        completed: false,
      };

      renderTask(task);
      saveTask(task);
      taskInput.value = "";
      tagsInput.value = "";
    }
  });

  searchBox.addEventListener("input", () => {
    const searchText = searchBox.value.toLowerCase();
    document.querySelectorAll("#taskList li").forEach((li) => {
      const text = li.textContent.toLowerCase();
      li.style.display = text.includes(searchText) ? "" : "none";
    });
  });

  toggleDarkMode.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    document
      .querySelector(".container")
      .classList.toggle("dark-mode", isDarkMode);
    const icon = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    toggleDarkMode.querySelector("i").className = icon;
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.classList.add("task-item");
    li.draggable = true;
    li.innerHTML = `
          <input type="checkbox" class="completeTask" ${
            task.completed ? "checked" : ""
          }>
          ${task.text}
          <div>
              ${task.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join(" ")}
              <button class="editBtn">Edit</button>
              <button class="deleteBtn">Delete</button>
          </div>
      `;
    if (task.completed) li.classList.add("completed");
    taskList.appendChild(li);

    li.querySelector(".deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        deleteTask(task.id);
        li.remove();
      }
    });

    li.querySelector(".editBtn").addEventListener("click", () => {
      // Placeholder for edit functionality
      alert("Edit functionality is not implemented.");
    });

    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
      e.target.classList.add("dragging");
    });

    li.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
  }

  function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((t) => t.id !== task.id);
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => renderTask(task));
  }

  function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll("li:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
});
