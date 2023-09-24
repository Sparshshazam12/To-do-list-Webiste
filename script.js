document.addEventListener("DOMContentLoaded", function () {
    const add = document.getElementById("add");
    const reset = document.getElementById("reset");

    $(function () {
        $('[data-toggle="popover"]').popover();
    });

    add.addEventListener("click", () => {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDateTime = document.getElementById('dueDateTime').value;

        if (!localStorage.getItem('itemsJson')) {
            const itemsJsonArray = [];
            itemsJsonArray.push({ title: title, description: description, dueDateTime: dueDateTime });
            localStorage.setItem('itemsJson', JSON.stringify(itemsJsonArray));
        } else {
            const itemsJsonArrayStr = localStorage.getItem('itemsJson');
            const itemsJsonArray = JSON.parse(itemsJsonArrayStr);
            itemsJsonArray.push({ title: title, description: description, dueDateTime: dueDateTime });
            localStorage.setItem('itemsJson', JSON.stringify(itemsJsonArray));
        }

        // Add a class for the fade-in animation when a task is added
        displayTable(true); // Pass true to indicate an added task
    });

    reset.addEventListener("click", () => {
        if (confirm("This will clear your whole to-do list. Are you sure?")) {
            localStorage.removeItem('itemsJson');
            // Add a class for the fade-in animation when resetting the list
            displayTable(false); // Pass false to indicate a reset
        }
    });

    function displayTable(isAddedTask) {
        let tableBody = document.getElementById("tableBody");
        let str = "";
        const itemsJsonArray = JSON.parse(localStorage.getItem('itemsJson') || '[]');
        itemsJsonArray.forEach((element, index) => {
            str += `
            <tr class="${isAddedTask ? 'added-task' : (isAddedTask === false ? 'updated-task' : '')}">
                <th scope="row">${index + 1}</th>
                <td>${element.title}</td>
                <td>${element.description}</td>
                <td>${element.dueDateTime || 'Not set'}</td>
                <td><button class="btn btn-sm btn-secondary edit" data-index="${index}">Edit</button></td>
                <td><button class="btn btn-sm btn-danger delete" data-index="${index}">Delete</button></td>
            </tr>`;
        });
        tableBody.innerHTML = str;

        const deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToDelete = e.target.getAttribute("data-index");
                deleteItem(indexToDelete);
            });
        });

        const editButtons = document.querySelectorAll(".edit");
        editButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const indexToEdit = e.target.getAttribute("data-index");
                editItem(indexToEdit);
            });
        });
    }

    function deleteItem(index) {
        const itemsJsonArray = JSON.parse(localStorage.getItem('itemsJson') || '[]');
        itemsJsonArray.splice(index, 1);
        localStorage.setItem('itemsJson', JSON.stringify(itemsJsonArray));
        // Add a class for the fade-in animation when a task is updated (deleted)
        displayTable(false); // Pass false to indicate a deleted task
    }

    function editItem(index) {
        const itemsJsonArray = JSON.parse(localStorage.getItem('itemsJson') || '[]');
        const updatedDueDateTime = prompt("Enter the updated due date and time (optional):");
        itemsJsonArray[index].dueDateTime = updatedDueDateTime;
        localStorage.setItem('itemsJson', JSON.stringify(itemsJsonArray));
        // Add a class for the fade-in animation when a task is updated (edited)
        displayTable(false); // Pass false to indicate an edited task
    }

    // Initially display the task table when the page loads with no animation
    displayTable(null);
});
