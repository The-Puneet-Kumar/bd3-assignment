const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;
let cors = require('cors');

app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

// Endpoint 1. Add a Task to the Task List
function addToTask(tasks, tasked) {
  tasks.push(tasked);
  return tasks;
}
app.get('/tasks/add', (req, res) => {
  let result = addToTask(tasks, {
    taskId: 4,
    text: 'Fix bug #404',
    priority: 4,
  });
  res.json(result);
});

// Endpoint 2. Read All Tasks in the Task List
// Endpoint to read all tasks
app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

// Endpoint 3. Sort Tasks by Priority
app.get('/tasks/sort-by-priority', (req, res) => {
  // Create a sorted copy of the tasks array
  const tasksCopy = tasks.slice().sort((a, b) => a.priority - b.priority);

  // Respond karte hai sorted task se
  res.json({ tasks: tasksCopy });
});

// 4. Function to update a task's priority by taskId
function updateByTaskId(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
      return tasks; // Return the updated tasks array after modifying the task
    }
  }
  // return null; // Return null when task not found by taskId
}

// Endpoint to edit task priority
app.get('/tasks/edit-priority', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const priority = parseInt(req.query.priority);

  // Validate query parameters
  // if (isNaN(taskId) || isNaN(priority)) {
  //   return res
  //     .status(400)
  //     .json({ error: 'Invalid taskId or priority. Both must be integers.' });
  // }

  // Call the function to update the task's priority
  const result = updateByTaskId(tasks, taskId, priority);

  if (result) {
    res.json({ tasks: result }); // Respond with the updated task list
  } else {
    res.status(404).json({ error: 'Task not found.' }); // Respond with a 404 if task is not found
  }
});

// Function to update the text of a task by taskId
function updateTaskTextById(tasks, taskId, newText) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = newText;
      return tasks; // Return the updated tasks array after modifying the task
    }
  }
  return null;
}

// Endpoint to edit task text
app.get('/tasks/edit-text', (req, res) => {
  const taskId = parseInt(req.query.taskId);
  const newText = req.query.text;

  // Validate query parameters
  if (isNaN(taskId) || !newText) {
    return res.status(400).json({
      error:
        'Invalid taskId or text. taskId must be an integer and text must be provided.',
    });
  }

  const result = updateTaskTextById(tasks, taskId, newText);

  if (result) {
    res.json({ tasks: result }); // Respond with the updated task list
  } else {
    res.status(404).json({ error: 'Task not found.' }); // Respond with a 404 if task is not found
  }
});

// Endpoint 6. Delete a Task from the Task List
// Function to delete a task by taskId
function deleteTaskById(tasks, taskId) {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.taskId !== taskId);
  return tasks.length !== initialLength ? tasks : null;
}

// Endpoint to delete a task
app.get('/tasks/delete', (req, res) => {
  const taskId = parseInt(req.query.taskId);

  if (isNaN(taskId)) {
    return res
      .status(400)
      .json({ error: 'Invalid taskId. It must be an integer.' });
  }

  // Call the function to delete the task
  const result = deleteTaskById(tasks, taskId);

  if (result) {
    tasks = result; // Update the global tasks array with the filtered array
    res.json({ tasks: result }); // Respond with the updated task list
  } else {
    res.status(404).json({ error: 'Task not found.' });
  }
});

// Endpoint 7. Filter Tasks by Priority
// Function to filter tasks by priority
function filterTasksByPriority(tasks, priority) {
  return tasks.filter((task) => task.priority === priority);
}

// Endpoint to filter tasks by priority
app.get('/tasks/filter-by-priority', (req, res) => {
  const priority = parseInt(req.query.priority);

  // Validate query parameter
  if (isNaN(priority)) {
    return res
      .status(400)
      .json({ error: 'Invalid priority. It must be an integer.' });
  }

  // Call the function to filter tasks by priority
  const result = filterTasksByPriority(tasks, priority);

  if (result.length > 0) {
    res.json({ tasks: result });
  } else {
    res
      .status(404)
      .json({ error: 'No tasks found with the specified priority.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
