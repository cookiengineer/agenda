
# Construction Sites

# Calendar View

- [ ] Calendar View should reflect the time schedule, with enable/disable buttons on the side for each project and/or category

# Gantt View

- [ ] Show Tasks in a specific order, and milestones/deadlines according to whether or not they are blocking.


# Agenda View

- [ ] Search field in the footer should implement a fuzzy search for `project`, `title`, `description`, `deadline`, and `repeat[]`.
- [ ] `Show Deadlines` button should only show important upcoming tasks.
- [ ] The `Start` button should start a render-interval that updates the `duration` property in the DOM, so that the seconds are counted live.
- [ ] The `Stop` button should stop the render-interval and ask whether the Task has been completed or not.
- [ ] The `Yes` button (in response to completion question) should set the `is_completed` property to true and call `Client.modify(task)` afterwards.


# App

- [ ] `APP.start(task)` should start a timer for the given task, and run an interval that
      modifies/updates the task's `duration` property and sends the updated time to the
      backend API via the `Client.modify(task)` method.

- [ ] `APP.stop(task)` should stop the timer and interval for for the given task.


# Journal View

The Journal View renders all completed tasks. It should implement a Histogram of Task
Duration/Estimation efficiencies, as well as an overlay for Task Complexity. It should
also feature a Search Field to be able to search for already completed tasks.

