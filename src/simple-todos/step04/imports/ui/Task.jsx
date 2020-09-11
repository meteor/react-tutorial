import React from 'react';
import classnames from 'classnames';

export const Task = ({ task, onCheckboxClick, onDeleteClick }) => {
  const classes = classnames('task', {
    checked: !!task.isChecked,
  });
  return (
    <li className={classes}>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
      <button onClick={() => onDeleteClick(task)}>&times;</button>
    </li>
  );
};
