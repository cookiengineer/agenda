
# Cookie Engineer's Agenda

### Very opinionated Task Planner App

This is my attempt at creating a better Task Planner App. I don't
like any other task planner apps due to various reasons, which I
am attempting to design/create differently here.

## Opinions

**Repeating tasks are never done**

Repeating tasks reflect reoccuring tasks which consume time, but can
never be done and usually are repetitive in nature.

For example: household, groceries, sports and hobbies, meetings, cleaning etc.

**Repeating tasks are per-weekday**

Repeating tasks reflect reoccuring tasks, and they are repeating on
a specified-weekday basis, and not each specified-date-of-the-month.

For example: Every 3rd Saturday of the month at 20:00:00 or Every Monday and Wednesday.

**Color palette reflects the assigned project**

The color palette is used to reflect the assigned project of each task.
The header bar allows to refresh the current view and all of its displayed
tasks by enabling/disabling the selected project's button.

**Tasks with (external) dependencies always have a specified deadline**

Tasks that rely on other people always have a specified deadline. A deadline
is used to reflect when exactly this Task must be finished or prepared for.
This includes scheduled meeting appointments with others.

**Tasks have a complexity**

Tasks have an assumed logical complexity, and there is always a backlog
of tasks which have an assumed complexity in the planning phase. This
assumed complexity reflects the Story Points in Scrum.

**Tasks have an assumed time estimation and a measured time duration**

Tasks have an assumed time estimation, which is also measured in the
form of the time duration. If the time duration is shorter/longer than
the initial estimation, it can be inferred that the user under- or
overestimated the task complexities; and a more precise task estimation
can be suggested over time.

**Task Planner Apps should offload mental work**

While a user works on any given task, there's no need for the user to
keep track of other tasks and deadlines. The only thing that the user
needs to keep track of is when they started/stopped/resumed working on
the active task.

Everything else should be the job of the Task Planner App, especially
keeping track of the tasks of lower immediate priority that are hard
to remember over time.


## Multiple Views

The Agenda Task Planner is based on the idea that in order to understand
the timeline of a project or to understand the tasks and their time estimations
in a different context, there needs to be multiple views and projections,
at any given time, for any given set of tasks.

As of now, these are the App Views and their proposed workflows:

- [x] `Agenda` to prioritize tasks based on complexity and deadlines.
- [x] `Calendar` to batch-schedule task deadlines via drag and drop.
- [ ] `Gantt` to understand task dependencies and possible overdue times.
- [ ] `Journal` to understand the success/failure history of a project.


## Quickstart

```bash
# Run Web Server and Backend API
cd /path/to/source;
go run ./main.go development;

# Open your Web Browser
gio open http://localhost:13337;
```

CLI Parameters:

1. Use `development` parameter to use it without spawning a webview.
2. Use `production` or no parameter to use with spawning a [webview/webview](https://github.com/webview/webview).


## Installation

```bash
# Build binary
bash ./make.sh;

# Built binary contains all assets and dependencies
sudo cp ./build/linux/linux-amd64 /usr/local/bin/agenda;
sudo chmod +x /usr/local/bin/agenda;
```


## License

AGPL3

