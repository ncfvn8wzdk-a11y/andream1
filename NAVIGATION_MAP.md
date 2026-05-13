# 📍 Project Hub - Navigation Map

## Application Structure & User Flow

This document outlines the complete navigation structure of the Project Hub application, showing how users navigate between different sections and features.

---

## Main Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIDEBAR NAVIGATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📊 Dashboard (Home)                                            │
│     └─ Recent Projects                                           │
│     └─ Quick Stats                                              │
│     └─ Navigation Cards                                         │
│                                                                   │
│  📁 Progetti (Projects List)                                    │
│     └─ Filter by Status                                         │
│     └─ Search Projects                                          │
│     └─ Create New Project                                       │
│                                                                   │
│  🔍 Ricerca (Global Search)                                     │
│     └─ Text Search                                              │
│     └─ Filter by Type                                           │
│     └─ Amount & Date Filters                                    │
│                                                                   │
│  ✨ Nuovo Progetto (Quick Create)                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dashboard Home Page (`/dashboard`)

Entry point for the application with high-level overview.

### Page Components:
- **Quick Stats Cards** (5 metrics)
  - 📊 Total Projects
  - ⚡ Active Projects
  - ✓ Completed Projects
  - ⏰ Total Hours
  - 💰 Total Costs

- **Navigation Sections** (3 cards)
  - Progetti → Links to `/dashboard/projects`
  - Ricerca → Links to `/dashboard/search`
  - Nuovo Progetto → Links to `/dashboard/projects/new`

- **Recent Projects List**
  - Shows last 5 projects
  - Quick access to project overview

---

## Projects List Page (`/dashboard/projects`)

Central hub for all project management.

### Features:
- ✅ View all projects in grid layout
- 🔍 Search projects by name/commessa/description
- 📊 Filter by status:
  - Tutti (All)
  - Attivi (Active)
  - In Pausa (On Hold)
  - Completati (Completed)
  - Chiusi (Closed)
  - Archiviati (Archived)

### Navigation:
- Click project card → `/dashboard/projects/[id]/overview`
- Create button → `/dashboard/projects/new`
- Sidebar search → `/dashboard/search`

---

## Project Creation Page (`/dashboard/projects/new`)

Form to create new project with:
- Project name
- Commessa (reference code)
- Description
- Business Benefits
- Project Type
- Budget
- Team member assignments
- Start/End dates

### After Creation:
Redirects to → `/dashboard/projects/[id]/overview`

---

## Project Detail Pages

All project detail pages share a **top navigation bar** with tabs for quick access to different sections.

### Tab Navigation Bar (ProjectNavTabs Component):
```
📊 Panoramica | ⏰ Ore Lavorate | 💰 Costi | 🎯 Milestone | 📝 Punch List | 📋 Attività
```

### Each page includes:
- Breadcrumb navigation
- Project-specific navigation tabs
- Back button to projects list

---

## Project Sections

### 1. **Panoramica (Overview)** - `/dashboard/projects/[id]/overview`

Main project dashboard with:
- **Phase Tracker** - Visual progress through 10 phases
- **Quick Stats Grid**
  - Total Hours
  - Total Costs
  - Milestones (completed/total)
  - Punch List Items
- **Project Information**
  - Description
  - Business Benefits
  - Team members with roles
  - Budget info
  - Start/End dates
- **Upcoming Milestones** - Next 3 milestones
- **Critical Alerts** - Warning for critical punch items
- **Generate Report** button - Creates Word document

### Navigation:
- Click metric cards → Routes to specific section
- Phase Tracker → Still on overview
- Sidebar → Other pages
- Tabs → Different sections

---

### 2. **Ore Lavorate (Time Logs)** - `/dashboard/projects/[id]/time-logs`

Track project hours worked.

**Features:**
- **Add Time Log Form**
  - Select Team Member
  - Enter Hours
  - Select Date
  - Optional Description
  
- **Hours Summary**
  - Total hours per project
  - Hours per person table
  - Visualization of workload

**Navigation:**
- Add new entry via form
- Delete existing logs
- View hours by person
- Back to overview via breadcrumb

---

### 3. **Costi (Costs)** - `/dashboard/projects/[id]/costs`

Manage project costs and budget.

**Features:**
- **Cost Document Uploader** (Drag & Drop)
  - Document Type (Invoice/Order/Quote)
  - Vendor Name
  - Amount (€)
  - Date
  - Description
  - File upload

- **Cost Tracker Table**
  - All costs listed
  - Total costs calculation
  - Budget comparison
  - Cost breakdown

**Navigation:**
- Upload documents
- View cost history
- Back to overview

---

### 4. **Milestone** - `/dashboard/projects/[id]/milestones`

Track project milestones and phases.

**Features:**
- **Add Milestone Form**
  - Title
  - Description
  - Planned Date
  - Status (Pending/In Progress/Completed)

- **Progress Indicator**
  - Visual progress bar
  - Completed/Total count

- **Milestone List**
  - All milestones with status
  - Edit and delete options
  - Drag-to-reorder (future)

**Navigation:**
- Create new milestone
- Update existing milestones
- View progress overview

---

### 5. **Punch List** - `/dashboard/projects/[id]/punch-list`

Manage quality issues and action items.

**Features:**
- **Add Punch Item Form**
  - Title
  - Description
  - Severity (Critical/Major/Minor/Cosmetic)
  - Status (Open/In Progress/Closed)
  - Found During (FAT/SAT/Installation)
  - Due Date

- **Statistics Cards**
  - Critical items count
  - Open items count
  - Closed items count

- **Punch Items List**
  - Color-coded by severity
  - Status indicator
  - Due date tracking
  - Edit and delete options

**Navigation:**
- Create new punch item
- Update item status
- View by severity

---

### 6. **Attività (Activity Log)** - `/dashboard/projects/[id]/activity`

View project activity history (Owner only).

**Features:**
- **Timeline View**
  - All project activities chronologically
  - Auto-logged events:
    - Hours logged
    - Costs added
    - Milestones created/updated
    - Punch items added
    - Files uploaded
    - Phase changes

- **Activity Details**
  - Icon representation
  - Description
  - Timestamp (timezone-aware)
  - Related item info

**Permissions:**
- Only project owner can view
- Shows all team activities

**Navigation:**
- View activity timeline
- Filter by activity type (future)

---

## Search Page (`/dashboard/search`)

Global search across all projects.

### Features:
- **Search Input** (500ms debounce)
  - Real-time results

- **Filter Tabs**
  - Tutti (All types)
  - Progetti (Projects)
  - Costi (Costs)
  - Milestone (Milestones)
  - Punch (Punch Items)

- **Advanced Filters**
  - Amount range (Min/Max) for costs
  - Date range for all items

- **Results Display**
  - Grouped by type
  - Direct links to items
  - Cost totals/averages
  - Quick preview info

### Navigation:
- From any cost/milestone/punch item → `Click to navigate to parent project`
- From project name → Navigate to project overview
- Filter tabs → Change result type

---

## Breadcrumb Navigation Pattern

All pages follow consistent breadcrumb pattern:

```
Dashboard / Progetti / [Project Name] / [Current Section]
```

Example:
```
Dashboard / Progetti / Website Redesign / Ore Lavorate
```

- **Dashboard** → `/dashboard`
- **Progetti** → `/dashboard/projects`
- **[Project Name]** → `/dashboard/projects/[id]/overview`
- **[Current Section]** → Current page (not clickable)

---

## URL Structure

```
/dashboard                              - Home dashboard
/dashboard/projects                     - Projects list
/dashboard/projects/new                 - Create project
/dashboard/projects/[id]                - Project redirect
/dashboard/projects/[id]/overview       - Project overview
/dashboard/projects/[id]/time-logs      - Time tracking
/dashboard/projects/[id]/costs          - Cost management
/dashboard/projects/[id]/milestones     - Milestone tracking
/dashboard/projects/[id]/punch-list     - Punch list
/dashboard/projects/[id]/activity       - Activity log
/dashboard/search                       - Global search
```

---

## User Journey Examples

### Example 1: Create & Track a New Project
```
1. Dashboard Home (/dashboard)
2. Click "+ Nuovo Progetto" or "Progetti" button
3. Projects List (/dashboard/projects)
4. Click "Nuovo Progetto"
5. Project Creation Form (/dashboard/projects/new)
6. Fill form and submit
7. Auto-redirect to Project Overview (/dashboard/projects/[id]/overview)
8. Add team members, set budget, describe project
9. Navigate tabs to:
   - Add time logs (⏰)
   - Upload costs (💰)
   - Create milestones (🎯)
10. Track progress via overview dashboard
```

### Example 2: Search for Historical Costs
```
1. Any page in sidebar → Click "Ricerca"
2. Search Page (/dashboard/search)
3. Enter keyword (e.g., "Acme Corp" vendor)
4. Filter to "Costi" tab
5. Set amount range if needed
6. Click on cost result
7. Navigate to parent project
8. View all costs in Costi section
```

### Example 3: Generate Project Report
```
1. Projects List (/dashboard/projects)
2. Click project card
3. Project Overview (/dashboard/projects/[id]/overview)
4. Click "📊 Genera Report" button
5. Word document downloads with:
   - Project summary
   - Team members
   - Hours breakdown
   - Costs summary
   - Milestone status
   - Punch list items
```

---

## Components Reused Across Pages

- **Sidebar** - Main navigation (persistent)
- **ProjectNavTabs** - Section navigation (all project detail pages)
- **Breadcrumb** - Location indicator (all project detail pages)
- **StatusBadge** - Status indicator (projects list, overview)
- **PhaseTracker** - Phase visualization (overview)
- **ProjectCard** - Project preview (projects list, dashboard)
- **CostDocumentUploader** - Drag-drop upload (costs page)
- **CostTracker** - Cost table (costs page)
- **TeamMemberSelector** - Role assignment (project creation)

---

## Navigation Design Principles

✅ **Consistent** - Same navigation patterns across all pages
✅ **Discoverable** - Multiple ways to reach same content
✅ **Contextual** - Breadcrumbs show current location
✅ **Fast** - Sidebar always accessible
✅ **Mobile-Friendly** - Responsive design (future refinement)
✅ **Timezone-Aware** - All timestamps converted to user timezone

---

## Future Navigation Enhancements

- 🔔 Notification center with activity alerts
- 🏠 Home page widgets
- ⭐ Favorites/pinned projects
- 🏷️ Project tags and filtering
- 📊 Dashboard customization
- 🔔 Smart filters saved searches
- 📱 Mobile bottom nav
- ⌨️ Keyboard shortcuts

---

**Last Updated:** May 13, 2026
