function updateUI() {
    const tasks = document.querySelectorAll(".task");
    const emptyState = document.getElementById("emptyState");
    const taskCount = document.getElementById("taskCount");

    if (emptyState) emptyState.style.display = tasks.length === 0 ? "flex" : "none";
    if (taskCount) taskCount.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(function(task) {
        tasks.push({
            text: task.querySelector("label").textContent,
            checked: task.querySelector("input[type='checkbox']").checked
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateUI();
}

function addTask(text, checked) {
    if (!text || !text.trim()) return;

    const emptyState = document.getElementById("emptyState");
    if (emptyState) emptyState.style.display = "none";

    const task = document.createElement("div");
    task.className = "task" + (checked ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked || false;
    checkbox.addEventListener("change", function() {
        task.classList.toggle("done", checkbox.checked);
        saveTasks();
    });

    const label = document.createElement("label");
    label.textContent = text;
    label.addEventListener("click", function() {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change"));
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = "&#10005;";
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", function() {
        task.style.animation = "none";
        task.style.opacity = "0";
        task.style.transform = "translateX(10px)";
        task.style.transition = "opacity 0.15s, transform 0.15s";
        setTimeout(function() {
            task.remove();
            saveTasks();
        }, 150);
    });

    task.appendChild(checkbox);
    task.appendChild(label);
    task.appendChild(deleteBtn);
    document.getElementById("result").appendChild(task);
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        JSON.parse(saved).forEach(function(t) {
            addTask(t.text, t.checked);
        });
    }
    updateUI();
}

document.querySelector(".btn").addEventListener("click", function() {
    const input = document.getElementById("fname");
    const value = input.value.trim();
    if (!value) return;
    addTask(value, false);
    saveTasks();
    input.value = "";
    input.focus();
});

document.getElementById("fname").addEventListener("keydown", function(e) {
    if (e.key === "Enter") document.querySelector(".btn").click();
});

loadTasks();
