# Team Policy

---

## Team Roles

- **Coordinator:**  
  The coordinator checks in with team members before each meeting, reminds them of the agenda, and ensures everyone stays on task. They take meeting notes, record decisions, and track assigned work.  
  Think of the coordinator as the **team leader** who manages workflow and communication.

- **Monitor:**  
  The monitor ensures that the team is implementing functionality as planned and meeting requirements.  
  Think of the monitor as the **client representative**, focused on ensuring that the product works as intended and matches the project proposal.

- **Checker:**  
  The checker is in charge of **delivering the final solution**.  
  They ensure test cases are written and passing, verify all merge requests before deadlines, and make sure the team follows **coding standards** and **documentation rules**.  
  The checker acts as a **quality assurance specialist**, pointing out inconsistencies during code review but not fixing them personally.

---

### Our Assigned Roles

| Role | Member | Key Responsibilities |
|------|---------|----------------------|
| **Checker** | **Ryan Bui** | Ensures code follows standards, test cases run successfully, and merges are clean and complete before deadlines. |
| **Coordinator** | **Christian Graceffa** | Organizes meetings, maintains task lists, takes notes, and keeps the team aligned on project goals. |
| **Monitor** | **Haider Ahmed** | Oversees that functionality matches the proposal, verifies progress aligns with requirements, and tracks open GitLab issues. |

All members share responsibility for planning, coding, reviewing, and documenting the project.

---

## Meeting Schedule

- **Primary Team Meeting:** Every **Wednesday evening** (outside of class time)  
    - **Duration:** ~1 hour  
    - **Format:** Online (Discord VC)


- **Secondary Work Session:** Every **Saturday** (outside of class time)  
    - **Duration:** ~1 hour  
    - **Format:** (Discord VC)

- **In-Class Checkpoint:** Once per week during lab time to update the instructor on progress, challenges, and next steps.

All meetings are logged as comments under the **“Team Meetings” GitLab Issue**, using Markdown headers for:
- Date & time  
- Attendees  
- Tasks completed  
- Problems encountered  
- Plans for next steps  

---

## Communication

- **Primary Communication Tool:** GitLab Issues & Merge Requests (for all project-related discussions and task tracking)  
- **Secondary Tool:** Discord (for quick coordination and scheduling)  
- **Response Time Expectation:** within **24 hours** on GitLab or Discord messages  
- **Code Review Turnaround:** within **24 hours** of a Merge Request submission  

All important technical or design decisions made on Discord will be summarized in the appropriate GitLab Issue or Merge Request for documentation purposes.

---

## GitLab Workflow

- All feature development is done in **feature branches** created from **staging**.  
- Merge Requests must be **reviewed and approved** by at least one teammate before merging.  
- **Main branch** is protected — merges occur **only via approved MR** from **staging**.  
- Commit messages follow course conventions
- Each teammate is responsible for resolving conflicts before merging.

---

## Conflict Resolution

If disagreements occur:
1. Discuss directly and respectfully during the next meeting or over a short voice call to clarify misunderstandings.  
2. Apply the **“most generous interpretation”** principle — assume good intentions.  
3. If unresolved, the coordinator will notify the instructor.

---

## Availability and Emergencies

If a teammate cannot attend a meeting or complete assigned work due to illness or personal emergencies:
- Notify teammates and instructor as soon as possible through Discord and Mio (no personal details required).  
- The team will redistribute or adjust tasks to stay on schedule.  
- The coordinator will inform the instructor if the situation impacts deliverables or milestones.

## Review and Quality Standards

Before merging any feature:
- Code must run without **ESLint errors**.  
- All major functions must include **JSDoc comments**.  
- The user interface must render correctly on both **desktop and mobile**.  
- The **Checker (Ryan)** ensures that all merge requests are properly reviewed and documented before integration.

---

## Summary

| Category | Agreement |
|-----------|------------|
| **Main Meeting** | Wednesday evening (~1 hour) |
| **Secondary Work Session** | Saturday (~1 hour) |
| **Response Time** | ≤ 24 hours |
| **Code Review** | ≤ 24 hours |
| **Primary Communication** | GitLab Issues / Merge Requests |
| **Secondary Communication** | Discord |
| **Conflict Handling** | Discuss directly → escalate to instructor if unresolved |

---

**Signatures (Digital):**  
- **Ryan Bui** — Checker  
- **Christian Graceffa** — Coordinator  
- **Haider Ahmed** — Monitor  