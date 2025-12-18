# OPERIS

**Operis** is a web-based workload and project management application designed to simplify collaboration for businesses and individuals. It allows users to break down projects into tasks, distribute work among team members, and track progress while maintaining a clear, comprehensive view of overall project advancement.

Operis follows a **Freemium business model**:
- **Free tier**: Core features such as managing users, projects, members, and tasks.
- **Paid tier**: Advanced features like CSV task exports based on filtering criteria.

Users can manage their accounts and switch between **Free** and **Premium** modes at any time, upgrading as needed based on budgets and feature requirements.

---

- During modification:
    - Members and tasks can be added, updated, and deleted.


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
