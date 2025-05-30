# StackAI Google Drive File Picker

This project is a Google Drive file picker and indexer, similar in functionality to a desktop file manager (like Finder on macOS), built with Next.js, React, and Tailwind CSS. It allows users to browse their Google Drive, select files/folders to index into a StackAI Knowledge Base, see which files are indexed, and de-index files as needed.

---

## Features

- **Browse Google Drive**: Navigate folders and files, similar to Finder on macOS.
- **Indexing**: Select files or folders to index into a StackAI Knowledge Base.
- **De-indexing**: Remove files from the knowledge base (does not delete from Google Drive).
- **Multi-select and Batch Indexing/De-indexing**: Select multiple files/folders and perform actions on all of them at once.
- **Progress/Status for Indexing Jobs**: See real-time feedback on indexing progress.
- **Sorting**: Sort files/folders by name or date.
- **Searching**: Search files/folders by name.
- **Responsive UI**: Works well on both desktop and mobile devices.
- **Modern UI**: Built with shadcn/ui, lucide-react icons, and Tailwind CSS.
- **Light and Dark Mode**: Seamless theme switching for comfortable viewing in any environment. (I am a big fan of dark mode, had to include it!)

---

## Technical Choices

- **Next.js**: For server-side rendering and modern React features.
- **TypeScript**: For type safety, cure for headache you get when props are flowing all over the app with no hint
- **React Query**: For server-state management, data fetching, caching, and mutation management.
- **Tailwind CSS**: For rapid, utility-first styling.
- **shadcn/ui**: For accessible, composable UI primitives.
- **lucide-react**: For consistent, modern icons.
- **StackAI API**: For all backend operations (listing, indexing, de-indexing, etc).

### State Management

- **React Query** is used for all resource fetching and mutations, ensuring UI stays in sync with backend state.

## How to Run Locally

### 1. Clone the repository

```sh
git clone git@github.com:saalikmubeen/stackai-technical-assignment.git
cd stackai-technical-assignment
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory similar to `.env.example` with the following (replace with your actual credentials):

```
NEXT_PUBLIC_SUPABASE_AUTH_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_EMAIL=...
NEXT_PUBLIC_SUPABASE_PASSWORD=...
NEXT_PUBLIC_STACK_AI_BACKEND_URL=
```

### 4. Run the development server

```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

- On first load, you will see a loading screen logging you in to Google Drive..
- Browse your Google Drive folders and files.
- Select files/folders and click "Index Selected" to add them to your knowledge base.
- Indexed files are visually marked.
- You can de-index files (remove from knowledge base) at any time.
- Use the search bar to filter files/folders by name.
- Sort files by name or date using the table header controls.

---

## Further Improvements

- Maintain the indexing status of documents across page reloads (would require backend support to persist and query this state in my opinion).

---
