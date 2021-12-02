/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import { fetchTask, pushTask, deleteTask, modifyTask } from './localstorage.js';

import { empty, el, compare, capitalize } from './helpers.js';


function show(part) {
  // elements that we want to hide and show
  const listOfTasks = document.querySelector('.taskList');
  const createForm = document.querySelector('.createchange');

  // we hide them all 
  listOfTasks.classList.add('hidden');
  createForm.classList.add('hidden');
  
  // and show them when needed
  switch (part) {
    case 'taskList':
      listOfTasks.classList.remove('hidden');
      break;
    case 'form':
      createForm.classList.remove('hidden');
      break;
    default:
      console.warn(`${part} óþekkt`);
  }
}

/**
 * 
 * @param {*} modify 
 * @param {*} id 
 * @returns {Event}
 */
function handleNewTaskClick(modify, id) {
  return (e) => {
    e.preventDefault();
    let warningString = '';
    const data = JSON.parse(localStorage.getItem('data'));
    const titill = document.querySelector('#titill').value;
    if(titill === '') warningString = 'Verkefnið þarf að hafa titil\n';
    const lysing = document.querySelector('#lysing').value;
    const dueDate = document.querySelector('#due').value;
    if(dueDate === '') warningString += 'Nauðsynlegt er að velja lokadagsetningu\n';
    const dueTime = document.querySelector('#dueTime').value;
    if(dueTime === '') warningString += 'Nauðsynlegt er að velja lokatíma';
    if(warningString!=='') {
      alert(warningString); // eslint-disable-line no-alert
      return;
    }
    let due = new Date(`${dueDate}T${dueTime}`);
    due = due.getTime();

    let ID;
    if (modify) ID = id;
    else ID = data.items.length + 1;
    const category = document
      .querySelector('.flokkarOptions')
      .value.toLowerCase();
    let tagString = document.querySelector('#tags').value;
    tagString = tagString.trim();
    let tagArray = [];
    if (tagString !== '') tagArray = tagString.split(' ');
    let modified = new Date();
    const ja = document.querySelector('#jaForgang').checked;
    const nei = document.querySelector('#neiForgang').checked;
    let priority = false;
    const completed = false;
    if (ja || nei) priority = ja;

    if (modify) {
      for (const tag of data.items[ID - 1].tags) {
        data.taskPerTag[tag]--;
      }
    }

    localStorage.setItem('data', JSON.stringify(data));

    modified = modified.getTime();
    const task = {
      category,
      completed,
      deleted: false,
      description: lysing,
      due,
      id: ID,
      modified,
      priority,
      tags: tagArray,
      title: titill,
    };

    if (modify) modifyTask(null, null, null, task);
    else pushTask(task);

    fetchAndRenderPage();
  };
}


function handleMenuClick(type = null, value = null) {
  return (e) => {
    e.preventDefault();
    if (type) {
      window.history.pushState({}, '', `/?${type}=${value}`);
    } else {
      window.history.pushState({}, '', '/');
    }
    renderTaskList();
    show('taskList');
  };
}


function renderCategoryList(container) {
  empty(container);
  container.innerText = 'Sæki flokka...';
  const data = JSON.parse(localStorage.getItem('data'));
  container.innerText = '';
  const keys = Object.keys(data.taskPerCat);
  for (const cat of keys) {
    // eslint-disable-next-line no-continue
    if(cat==='') continue;
    const catLI = el('li');
    catLI.classList.add('menu-item');
    catLI.id = cat;
    catLI.addEventListener('click', handleMenuClick('category', cat));
    container.appendChild(catLI);
    catLI.appendChild(el('div', capitalize(cat)));
    const fjoldi = data.taskPerCat[cat].toString();
    const catFjoldi = el('div', fjoldi);
    catFjoldi.classList.add('valfjoldi');
    catLI.appendChild(el('div', catFjoldi));
  }
}

function renderTagList(container) {
  empty(container);
  container.innerText = 'Sæki tags...';
  const data = JSON.parse(localStorage.getItem('data'));
  container.innerText = '';
  for (const [tag, value] of Object.entries(data.taskPerTag)) {
    if (value > 0) {
      const tagLI = el('li');
      tagLI.id = tag;
      tagLI.classList.add('menu-item');
      tagLI.addEventListener('click', handleMenuClick('tag', tag));
      container.appendChild(tagLI);
      tagLI.appendChild(el('div', capitalize(tag)));
      const tagFjoldi = el('div', value.toString());
      tagFjoldi.classList.add('valfjoldi');
      tagLI.appendChild(el('div', tagFjoldi));
    }
  }
}

function renderValstika() {
  const data = JSON.parse(localStorage.getItem('data'));
  // All, completed and uncompleted tasks
  const allTasks = document.querySelector('.Verkefni');
  let fjoldiKlaradra = 0;
  let oklarud = 0;
  for (const item of data.items) {
    if (item.completed && !item.deleted) fjoldiKlaradra++;
    else if (!item.deleted) oklarud++;
  }
  allTasks.innerText = fjoldiKlaradra + oklarud;
  const all = document.querySelector('#all-tasks');
  all.addEventListener('click', handleMenuClick());

  const finished = document.querySelector('#finished');
  finished.addEventListener('click', handleMenuClick('completed', true));
  const completedTasks = document.querySelector('.kláruðVerkefni');

  const unfinished = document.querySelector('#unfinished');
  unfinished.addEventListener('click', handleMenuClick('completed', false));
  completedTasks.innerText = fjoldiKlaradra;
  const uncompletedTasks = document.querySelector('.ókláruðVerkefni');

  uncompletedTasks.innerText = oklarud;
  // Categories
  const categories = document.querySelector('.flokkarListi');
  renderCategoryList(categories);
  // Tags
  const tags = document.querySelector('.tagListi');
  renderTagList(tags);
}

function baetaVidVerkefni(e) {
  e.preventDefault();

  document.querySelector('#titill').value = '';
  document.querySelector('#lysing').value = '';
  document.querySelector('#due').value = '';
  document.querySelector('#dueTime').value = '';
  document.querySelector('#tags').value = '';

  const buttons = document.querySelector('.comfirmDelete_buttons');
  empty(buttons);

  const confirmButton = el('button');
  confirmButton.textContent = 'Vista';
  confirmButton.classList.add('button', 'confirm');
  confirmButton.setAttribute('type', 'submit');
  confirmButton.addEventListener('click', handleNewTaskClick(false, null));
  buttons.appendChild(confirmButton);

  const cancel = el('button');
  cancel.textContent = 'Hætta við';
  cancel.classList.add('button', 'cancel');
  cancel.addEventListener('click', () => {
    show('taskList');
  });
  buttons.appendChild(cancel);

  show('form');
}

function renderTaskList(sortKey = 'due') {
  const container = document.querySelector('.verkefnalisti');
  empty(container);
  container.innerText = 'Sæki verkefnin...';
  const params = new URLSearchParams(window.location.search);
  const data = JSON.parse(localStorage.getItem('data'));
  container.innerText = '';
  let tasks;

  const menuItems = document.querySelectorAll('.menu-item');
  for(const item of menuItems) item.classList.remove('menu-item-selected');
  if (params.get('category')) {
    tasks = [];
    const catEl = document.querySelector('#' + params.get('category'));
    catEl.classList.add('menu-item-selected');
    for (const task of data.items) {
      if (task.category === params.get('category')) {
        tasks.push(task);
      }
    }
  } else if (params.get('tag')) {
    tasks = [];
    const tagEl = document.querySelector('#' + params.get('tag'));
    tagEl.classList.add('menu-item-selected');
    for (const task of data.items) {
      if (task.tags.indexOf(params.get('tag')) >= 0) {
        tasks.push(task);
      }
    }
  } else if (params.get('completed')) {
    tasks = [];
    if(params.get('completed')==='true') {
      const tagEl = document.querySelector('#finished');
      tagEl.classList.add('menu-item-selected');
    } else {
      const tagEl = document.querySelector('#unfinished');
      tagEl.classList.add('menu-item-selected');
    }
    for (const task of data.items) {
      if (`${task.completed}` === params.get('completed')) {
        tasks.push(task);
      }
    }
  } else {
    const tagEl = document.querySelector('#all-tasks');
    tagEl.classList.add('menu-item-selected');
    tasks = data.items;
  }

  tasks.sort(compare(sortKey));

  for (const task of tasks) {
    if (!task.deleted) {
      const taskElem = el('section');
      taskElem.classList.add('verkefni');

      const check = el('input');
      check.classList.add('checkbox');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('value', task.id);
      if (task.completed) {
        check.setAttribute('checked', 'true');
      }
      check.addEventListener('change', (e) => {
        modifyTask(e.target.value, 'completed', e.target.checked);
        renderValstika();
      });
      taskElem.appendChild(check);

      const infoContainer = el('div');
      infoContainer.classList.add('verkefni-container');

      const title = el('h3', task.title);
      title.classList.add('verkefnistitill');
      title.addEventListener('click', handleTaskClick(task.id));
      infoContainer.appendChild(title);

      const description = el('p', task.description);
      description.classList.add('verkefnislysing');
      infoContainer.appendChild(description);

      const details = el('div');
      details.classList.add('verkefnisflokkun');

      const d = new Date(task.due);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const date = el('span', d.toLocaleDateString('is', options));
      details.appendChild(date);

      const tags = el('div');
      tags.classList.add('taggar');
      for (const tag of task.tags) {
        const t = el('span', tag);
        t.classList.add('tag');
        tags.appendChild(t);
      }
      details.appendChild(tags);

      const category = el('div', capitalize(task.category));
      category.classList.add('task-category');
      details.appendChild(category);

      // anchor.appendChild(details);
      infoContainer.appendChild(details);
      taskElem.appendChild(infoContainer);
      container.appendChild(taskElem);
    }
  }
}

/**
 * Calls the functions to create the side categories and the list of tasks.
 * Makes the "Bæta við verkefni" and the "order by" element responsive.
 */
export function fetchAndRenderPage() {
  const baetaVid = document.querySelector('.baetavidverkefni');
  baetaVid.addEventListener('click', baetaVidVerkefni);
  document.querySelector('#neiForgang').checked = true;
  // Page consists of valstika and task list
  const valstikan = document.querySelector('.valstika');
  renderValstika(valstikan);
  const verkefnalistinn = document.querySelector('.verkefnalisti');
  const sort = document.querySelector('.sorting');
  sort.addEventListener('change', (e) => {
    renderTaskList(e.target.value);
  });
  renderTaskList();
  show('taskList');
}

/**
 * Makes the delete button responsive and deletes the selected task 
 *@param {number} id ID of the task that is deleted
 * @returns
 */
function handleDeleteButtonClick(id) {
  return (e) => {
    e.preventDefault();
    deleteTask(id);
    show('taskList');
    const verkefnalistinn = document.querySelector('.verkefnalisti');
    const sort = document.querySelector('.sorting');
    fetchAndRenderPage();
  };
}

/**
 * Fills in the form with the information of the task we want to modify and creates the buttons to confirm, delete 
 * and leave the form.
 * @param {number} id id of the task we want to populate the form with 
 */
function populateForm(id) {
  const buttons = document.querySelector('.comfirmDelete_buttons');
  empty(buttons);

  const confirmButton = el('button');
  confirmButton.textContent = 'Vista';
  confirmButton.classList.add('button', 'confirm');
  confirmButton.setAttribute('type', 'submit');
  confirmButton.addEventListener('click', handleNewTaskClick(true, id));
  buttons.appendChild(confirmButton);

  const deleteButton = el('button');
  deleteButton.textContent = 'Eyða';
  deleteButton.classList.add('button', 'delete');
  deleteButton.addEventListener('click', handleDeleteButtonClick(id));
  buttons.appendChild(deleteButton);

  const cancel = el('button');
  cancel.textContent = 'Hætta við';
  cancel.classList.add('button', 'cancel');
  cancel.addEventListener('click', () => {
    show('taskList');
  });
  buttons.appendChild(cancel);

  const task = fetchTask(id);
  document.querySelector('#titill').value = task.title;
  document.querySelector('#lysing').value = task.description;
  const date = new Date(task.due).toISOString(true).split('T')[0];
  document.querySelector('#due').value = date;
  let time = new Date(task.due).toISOString(true).split('T')[1];
  [time] = time.split('.');
  document.querySelector('#dueTime').value = time;
  if (task.priority) document.querySelector('#jaForgang').checked = true;
  else document.querySelector('#neiForgang').checked = true;
  let cat = task.category;
  cat = capitalize(cat);
  document.querySelector('.flokkarOptions').value = cat;
  const tagTextbox = document.querySelector('#tags');
  tagTextbox.value = '';
  for (const tag of task.tags) {
    tagTextbox.value += `${tag} `;
  }
}


function handleTaskClick(id) {
  return (e) => {
    e.preventDefault();
    populateForm(id);
    show('form');
  };
}