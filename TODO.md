
# Construction Sites

# Backend / Structs

- [ ] Eternal Tasks need a `ToDatetimes(before, after)` method that returns an Array of Datetime instances for the given time range.
      Limit the latest datetime to the earliest of `after` and `task.Deadline` so that no entries beyond the deadline are generated.

# Agenda View

- [ ] Implement a toggle button that switches `Show Suggested` and `Show All`.
- [ ] `Show Suggested` shows the upcoming tasks until the end of the week.
      If there are none, recommend the task with the lowest complexity.
- [ ] `Show All` shows all tasks, sorted by deadline first, then by complexity.

# Calendar View

- [ ] Eternal Tasks are not rendered correctly. Use `ToDatetimes(first_day_of_month, end_of_month)` to get the correct Array of Datetime entries for each Task.

# Editor View

- [ ] Implement support for the `task.Interval` property, and use a `<select>` element for it.

# Gantt View

- [ ] Show Tasks in a specific order of completion, and deadlines according to whether or not
      they are blocking or were overdue.
- [ ] Implement a `Show All` and `Show Completed` button which toggles tasks by the
      `APP.selector.completed` selector.

# Journal View

The Journal View renders all completed tasks. It should implement a Histogram of Task
Duration/Estimation efficiencies, as well as an overlay for Task Complexity. It should
also feature a Search Field to be able to search for already completed tasks.

