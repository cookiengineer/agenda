
# Construction Sites

# Backend

# Agenda View

- [ ] Implement a toggle button that switches `Show Suggested` and `Show All`.
- [ ] `Show Suggested` shows the upcoming tasks until the end of the week.
      If there are none, recommend the task with the lowest complexity.
- [ ] `Show All` shows all tasks, sorted by deadline first, then by complexity.

# Gantt View

- [ ] Show Tasks in a specific order of completion, and deadlines according to whether or not
      they are blocking or were overdue.
- [ ] Implement a `Show All` and `Show Completed` button which toggles tasks by the
      `APP.selector.completed` selector.

# Journal View

The Journal View renders all completed tasks. It should implement a Histogram of Task
Duration/Estimation efficiencies, as well as an overlay for Task Complexity. It should
also feature a Search Field to be able to search for already completed tasks.

