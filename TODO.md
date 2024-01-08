
# Construction Sites

# Agenda View

- [ ] Implement a `Show Suggested` button which toggles to `Show All`. This button should
      show all immediate tasks which are scheduled for the next upcoming days (until the end
      of the week), and if there are none, recommend the next unscheduled task with the lowest
      complexity.
- [ ] Implement a `Start` button that starts a given task and sets the `APP.active` task to
      the selected one. There can be only one active task, and it should be stickied to the top
      and animated while the time duration counter increases. Save the active task to the Profile
      so that the Agenda App can be closed and re-opened later.
- [ ] Implement a `Stop` button that stops a given task and sets the `APP.active` task to `null`,
      while storing the measured `time duration` on the stopped task. After the Stop button is
      clicked, there should be a displayed dialog that asks whether or not the task is completed.

# Calendar View

- [ ] Implement a Drag and Drop feature that drags `<article>` elements from the `<aside>`
      to the table's `<td>` cells. This leads to the `task.deadline` property being set to
      that cell's `data-date` property. The `time` property should be `23:59:59` by default.

# Gantt View

- [ ] Show Tasks in a specific order of completion, and deadlines according to whether or not
      they are blocking or were overdue.
- [ ] Implement a `Show All` and `Show Completed` button which toggles tasks by the
      `APP.selector.completed` selector.

# Journal View

The Journal View renders all completed tasks. It should implement a Histogram of Task
Duration/Estimation efficiencies, as well as an overlay for Task Complexity. It should
also feature a Search Field to be able to search for already completed tasks.

