# Mentor IP Dashboard

This is a comprehensive administrative dashboard for **Mentor IP**, built using modern web technologies including Next.js, React, and TypeScript. It allows the management of clients, team members, blog insights, gallery assets, and administrative configurations.

## 🚀 Key Features

- **📊 Dashboard Overview**: Visualize key metrics like article views and inquiry growth with interactive charts.
- **👥 Client Management**: Manage client lists, clientele stats, jurisdictions, and served industries.
- **✍️ Insights & Content**: Create, edit, and publish rich-text articles/insights using a built-in Tiptap editor.
- **🖼️ Gallery Asset Management**: Easily maintain a modern, responsive photo gallery.
- **🤝 Team Directory**: Keep your legal advisory team details up to date.
- **🔒 Role-Based Access Control (RBAC)**: Fine-grained admin and role management for secure accessibility.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State & Tables**: [TanStack Table](https://tanstack.com/table/v8) (Data Tables)
- **Forms & Validation**: React Hook Form + Zod
- **Rich Text Editor**: Tiptap Editor
- **Data Visualization**: Recharts

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/nurulla-hasan/mentorip_dashboard.git
cd mentorip_dashboard
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and configure your backend endpoint:
```env
NEXT_PUBLIC_BASE_API=https://mentorip.com/api/v1
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.
