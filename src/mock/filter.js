import {isTaskExpired, isTaskRepeating, isTaskExpiringToday} from "../utils.js";

const getTaskBy = (tasks, params, checkerFunction = null) => {
  let result = [];

  tasks.forEach((task) => {
    if(typeof checkerFunction === 'function' && !task.isArchive && checkerFunction[params]){
      result.push(task);
    } else if(!checkerFunction && !task.isArchive && task[params]) {
      result.push(task);
    }
  });

  return result.length;
};

const taskToFilterMap1 = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => getTaskBy(tasks, `dueDate`, isTaskExpired),
  today: (tasks) => getTaskBy(tasks, `dueDate`, isTaskExpiringToday),
  favorites: (tasks) => getTaskBy(tasks, `isFavorite`),
  repeating: (tasks) => getTaskBy(tasks, `repeating`, isTaskRepeating),
  archive: (tasks) => tasks.filter((task) => task.isArchive).length,
};

export const generateFilter = (tasks) => {
  return Object.entries(taskToFilterMap1).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(tasks),
    };
  });
};
