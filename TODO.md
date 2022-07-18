
# Construction Sites


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


# Editor View

- [ ] A `Delete` button needs to be implemented.


# Backend API

- [ ] A `DeleteTask` API needs to be implemented.


# Journal View

The Journal View renders all completed tasks. It should implement a Histogram of Task
Duration/Estimation efficiencies, as well as an overlay for Task Complexity. It should
also feature a Search Field to be able to search for already completed tasks.


# App Distribution

The backend has been written in golang, and in a manner that it's at least theoretically
possible to create/modify/query all tasks without having to do a network request.

This has to be integrated into the [Client](./public/source/Client.mjs) as well, so that
there might be a check similar to `if (typeof window.runtime === '...')` beforehand to
catch all network requests, and to be able to override the networked APIs in that case
with the locally called ones in the Wails runtime.

