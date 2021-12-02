/**
 * Reads data and updates local storage
 *
 * @param {{Array, Array}} data in a data Object with two arrays
 */
export function syncData({ items, categories }) {
  let data;

  // Make a default empty data object if localStorage is empty
  if (localStorage.getItem('data') === null) {
    data = {
      items: [],
      categories,
      notDeleted: [],
      taskPerCat: {},
      taskPerTag: {},
    };
  } else {
    data = JSON.parse(localStorage.getItem('data'));
  }

  for (const item of items) {
    // Make sure we don't add items already in the storage
    if (item.id > data.items.length) {
      data.items.push(item);

      // Update tag Object with counts
      for (const tag of item.tags) {
        if (!data.taskPerTag[tag]) {
          data.taskPerTag[tag] = 1;
        } else {
          data.taskPerTag[tag]++;
        }
      }

      // If item is not marked as deleted:
      if (!item.deleted) {
        // Add it to the notDeleted list
        data.notDeleted[item.id - 1] = item.id;

        // And update category counter
        if (!data.taskPerCat[item.category]) {
          data.taskPerCat[item.category] = 1;
        } else {
          data.taskPerCat[item.category]++;
        }
      } else {
        data.notDeleted[item.id - 1] = null;
      }
    }
  }

  // Push updated data to localStorage
  localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Fetches task corresponding to the given id
 * from localStorage
 *
 * @param {Number} id task id
 * @returns task corresponding to id
 */
export function fetchTask(id) {
  const data = JSON.parse(localStorage.getItem('data'));

  // Check if id is in task object array
  if (id > data.items.length) throw new Error(`Id ${id} was not found`);
  // Throw error if not
  else return data.items[id - 1];
}

/**
 * Adds a task object to localStorage
 *
 * @param {Object} task
 *
 */
export function pushTask(task) {
  const data = JSON.parse(localStorage.getItem('data'));

  data.items.push(task);
  data.notDeleted.push(task.id);

  // Update tag Object with counts
  for (const tag of task.tags) {
    if (!data.taskPerTag[tag]) {
      data.taskPerTag[tag] = 1;
    } else {
      data.taskPerTag[tag]++;
    }
  }

  // Update category count
  if (!data.taskPerCat[task.category]) {
    data.taskPerCat[task.category] = 1;
  } else {
    data.taskPerCat[task.category]++;
  }

  // Push changes to storage
  localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Soft deletes a task from localStorage
 * corresponding to given id
 *
 * @param {Number} id task id
 */
export function deleteTask(id) {
  const data = JSON.parse(localStorage.getItem('data'));

  // Soft delete task
  data.items[id - 1].deleted = true;
  data.notDeleted[id - 1] = null;

  // Decriment categories
  data.taskPerCat[data.items[id - 1].category]--;

  // Decriment tags
  for (const tag of data.items[id - 1].tags) {
    data.taskPerTag[tag]--;
  }

  // Push changes to storage
  localStorage.setItem('data', JSON.stringify(data));
}

/**
 * Modifies a task in localStorage given a task id
 *
 * @param {Number} id
 * @param {String} key
 * @param {String | Array} value
 * @param {Object} task
 * @returns null
 */
export function modifyTask(id, key, value, task = null) {
  const data = JSON.parse(localStorage.getItem('data'));

  // Update category list by decrementing
  // old categories and incrementing new ones
  let oldCategory;
  if (task !== null) {
    oldCategory = data.items[task.id - 1].category;
    data.taskPerCat[oldCategory]--;
    data.items[task.id - 1] = task;
    for (const tag of task.tags) {
      if (!data.taskPerTag[tag]) {
        data.taskPerTag[tag] = 1;
      } else {
        data.taskPerTag[tag]++;
      }
    }
    if (!data.taskPerCat[task.category]) {
      data.taskPerCat[task.category] = 1;
    } else {
      data.taskPerCat[task.category]++;
    }
    localStorage.setItem('data', JSON.stringify(data));
    return;
  }

  if (key !== 'tags') {
    data.items[id - 1][key] = value;
  } else {
    for (const tag of value) {
      if (!data.tags.includes(tag)) {
        data.tags.push(tag);
      }
    }
  }

  localStorage.setItem('data', JSON.stringify(data));
}
