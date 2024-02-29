const taskIDDOM = document.querySelector('.task-edit-id')
const taskNameDOM = document.querySelector('.task-edit-name')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName
// Add this to the beginning of your edit-task.js
const themeSwitchCheckbox = document.querySelector('.theme-switch__checkbox');

// Function to set dark mode state
function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  themeSwitchCheckbox.checked = enabled;
}

// Function to get dark mode state
function getDarkMode() {
  return localStorage.getItem('darkMode') === 'true';
}

// Event listener for theme switch checkbox
themeSwitchCheckbox.addEventListener('change', () => {
  const darkModeEnabled = themeSwitchCheckbox.checked;
  setDarkMode(darkModeEnabled);
  localStorage.setItem('darkMode', darkModeEnabled);
});

// Set initial dark mode state on page load
setDarkMode(getDarkMode());
const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`)
    const { _id: taskID, completed, name } = task

    //taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }
  } catch (error) {
    console.log(error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const taskName = taskNameDOM.value
    const taskCompleted = taskCompletedDOM.checked

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    })

    const { _id: taskID, completed, name } = task

    //taskIDDOM.textContent = taskID
    taskNameDOM.value = name
    tempName = name
    if (completed) {
      taskCompletedDOM.checked = true
    }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
