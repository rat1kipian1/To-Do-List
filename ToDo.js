let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // ამ ბრძანებით თუ "tasks" არის localStorage-ში, მონაცემები სწორად წაიკითხოს და მასივის სახით შემოიტანოს.თუ "tasks" არ არის, პროგრამა არ შეცდეს და ცარიელი მასივი ([]) გამოიყენოს.

let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || []; // იგივე ლოგიკა ვრცელდება deletedTasks-ზე

// აქ ხდება html ელემენტების დაკავშირება ჯავასკრიპტთან
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterInProgress = document.getElementById("filterInProgress");
const filterCompleted = document.getElementById("filterCompleted");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

addTaskBtn.addEventListener("click", function () { // როცა მომხმარებელი დააჭერს "addTaskBtn" ღილაკს, ეს ფუნქცია დაიძვრება
    const taskText = taskInput.value.trim(); // taskInput.value იღებს მომხმარებლის მიერ ჩაწერილ ტექსტს და .trim() ზედმეტ სივრცეებს აშორებს

    if (taskText) { // თუ დავალება ჩაწერილია taskText ში დავალება დაემატება 
        tasks.push({ text: taskText, status: "In Progress", time: new Date().toLocaleString() }); // აქ თასქს დაემატება სტატუსი და დრო 
        taskInput.value = ""; // თასქების დამატების შემდეგ ველი დაცარიელდება
        localStorage.setItem("tasks", JSON.stringify(tasks)); // დავალებების მასივი JSON ით შეინახება localstorage ში
        displayTasks(); // თასქების სია განახლდება
    } else {
        alert("Please enter a task!"); // თუ მომხმარებელი არ ჩაწერს თასქს, გამოჩნდება გაფრთხილება
    }
});

// ფუნქცია, რომელიც გამოაჩენს დავალებებს სიაში
function displayTasks() {
    taskList.innerHTML = ""; // ვასუფთავებთ დავალებების სიას რათა თავიდან ავირიდოთ დუბლირებული ჩანაწერები

    const showInProgress = filterInProgress.checked; // მოწმდება ჩართულია თუ არა "In Progress" ფილტრი
    const showCompleted = filterCompleted.checked; // მოწმდება ჩართულია თუ არა "Completed" ფილტრი

    tasks.forEach((task, index) => { // ვატრიალებთ tasks მასივს და თითოეულ დავალებაზე ვქმნით HTML კოდს
        if (
            (showInProgress && task.status === "In Progress") ||  // თუ "In Progress" ფილტრი აღნიშნულია და დავალების სტატუსი "In Progress" არის გამოჩნდება ის დავალებები რომლებსაც "In Progress" სტატუსი აქვთ
            (showCompleted && task.status === "Completed") ||    // თუ "Completed" ფილტრი ჩართულია და დავალების სტატუსი "Completed" არის, ანუ გამოჩნდება მხოლოდ იმ დავალებები, რომლებიც "Completed" სტადიაში არიან
            (!showInProgress && !showCompleted)  // თუ არც "In Progress", არც "Completed" ფილტრი არ არის ჩართული, ანუ ყველა დავალება (რაც სტადუსი არ აქვს მნიშვნელობა) გამოჩნდება
        ) { 
            // დავალების HTML კოდი
            const taskHTML = `
        <li>
            <input type="checkbox" ${task.status === "Completed" ? "checked" : ""} 
                   onchange="updateTaskStatus(${index}, this.checked ? 'Completed' : 'In Progress')" />
            <label>${task.text}</label>
            <span style="font-size: 12px; color: #888; margin-left: 10px;">(Uploaded: ${task.time})</span>
            <select onchange="updateTaskStatus(${index}, this.value)">
                <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
            </select>
            <button onclick="deleteTask(${index})">Delete</button>
        </li>`;
            taskList.innerHTML += taskHTML; // დავალებას ვამატებთ HTML სიაში
        }
    });

    clearAllBtn.style.display = tasks.length >= 1 ? "block" : "none"; // ვამოწმებთ უნდა გამოჩნდეს თუ არა Clear All ღილაკი
}

// ფუნქცია, რომელიც განაახლებს დავალების სტატუსს
function updateTaskStatus(index, newStatus) {
    tasks[index].status = newStatus; // დავალების სტატუსი განახლდება
    localStorage.setItem("tasks", JSON.stringify(tasks)); // დავალებები ინახება localStorage-ში
    displayTasks(); // განახლებული სია გამოჩნდება
}

// ფუნქცია, რომელიც შლის დავალებას
function deleteTask(index) {
    deletedTasks.push(tasks[index]); // დავალება გადადის წაშლილ დავალებების სიაში
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks)); // წაშლილი დავალებების სიას ინახავს localStorage-ში
    tasks.splice(index, 1); // დავალება წაიშლება tasks მასივიდან
    localStorage.setItem("tasks", JSON.stringify(tasks)); // tasks განახლდება localStorage-ში
    displayTasks(); // განახლებული სია გამოჩნდება
}

// Clear All ღილაკის ფუნქცია
clearAllBtn.addEventListener("click", function () {
    tasks = []; // ყველა დავალება წაიშლება tasks მასივიდან
    localStorage.setItem("tasks", JSON.stringify(tasks)); // tasks განახლდება localStorage-ში
    displayTasks(); // განახლებული სია გამოჩნდება
});

// ფილტრის მონიტორინგი - როცა ფილტრის მდგომარეობა იცვლება, დავალებების სიას ვაჩვენებთ
filterInProgress.addEventListener("change", displayTasks);
filterCompleted.addEventListener("change", displayTasks);

// პირველად დავალებების სიას ვაჩვენებთ
displayTasks();
