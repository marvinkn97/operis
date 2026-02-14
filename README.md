# OPERIS

The **Operis** project aims to simplify project management for businesses and individuals
through a web application for workload management. This solution will allow for breaking
down projects into tasks, distributing them among team members, and tracking their
progress, all while offering a comprehensive overview of the overall advancement.

Operis's business model is based on the Freemium model, offering free basic features such
as the creation, modification, and deletion of projects, as well as the management of
members and tasks, among others. Advanced features, such as the CSV export of project
tasks, will be available with a paid subscription.

In addition to its functionalities, Operis offers user account management and a mechanism to
switch from free to premium mode, and vice versa. This approach will allow users to benefit
from the features necessary for their needs while having the possibility to upgrade to more
advanced features according to their requirements and budget.
---

#### 6. Task Management

Tasks contain:
- **Status**
- **History**

##### Task Statuses
- `To Do`
- `In Progress`
- `Completed`

##### History Tracking
- Captures the entire lifecycle of a task:
    - Creation timestamp.
    - All status changes and modifications.
    - Allows precise chronological tracking of task evolution.

##### Available Actions
- Add, modify, and delete tasks.
- Update task state.
- Track task statuses across projects.

---

#### 7. Project Retrieval

- Retrieve a full project view including:
    - Project details.
    - Members.
    - All associated tasks and their current states.

---

## Paid Features

### 1. CSV Export of Project Tasks

Users can export task data in CSV format using two mandatory filters:
- **Status**
- **Period**
    - `start_date`
    - `end_date`

##### Example Exports
- All tasks completed in **January 2024**.
- All tasks in progress during **2024**.

##### CSV Fields per Task
Each exported row contains:

- Task name
- Description
- Creation date
- Owner
- Date of last action
- Identity of the person who performed the last action
- Current status

---

## License

This project follows the Freemium model. Free features are available to all users, while premium features require a paid subscription.
