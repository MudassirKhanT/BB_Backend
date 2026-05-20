/**
 * Seed the React.js Complete Course.
 *
 * Run from the BB_Backend directory:
 *   npx ts-node --esm seed-reactjs.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

import Course from "./models/course.model.ts";
import Topic from "./models/topic.model.ts";
import Subtopic from "./models/subtopic.model.ts";
import User from "./models/user.model.ts";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

type Block = { type: string; data: Record<string, unknown> };

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB");

  const instructor = await User.findOne({ role: "instructor" });
  if (!instructor) {
    console.error("❌  No instructor found — run seed.ts first.");
    process.exit(1);
  }

  const existing = await Course.findOne({ slug: "reactjs-complete-course" });
  if (existing) {
    console.log("⏭  Course already exists — skipping.");
    await mongoose.disconnect();
    process.exit(0);
  }

  // ─── Create Course ────────────────────────────────────────────────────────
  const course = await Course.create({
    title: "React.js Complete Course",
    slug: "reactjs-complete-course",
    description:
      "A comprehensive guide to building modern, interactive user interfaces with React.js — from core concepts to production-ready applications. Covers components, hooks, routing, API integration, Context API, performance optimization, and deployment.",
    shortDescription:
      "Master React.js from scratch — components, hooks, routing, state management, and deployment to production.",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "React Router", "Context API", "Vite"],
    category: "Web Development",
    level: "Beginner",
    author: instructor._id,
    isPublished: true,
    price: 999,
    totalEnrollments: 0,
    rating: 0,
    totalRatings: 0,
    estimatedDuration: "45 hours",
    color: "from-cyan-500 to-blue-600",
    icon: "Layers",
    whatYouWillLearn: [
      "Understand React's component-based architecture and Virtual DOM",
      "Build dynamic UIs with props, state, and all core React Hooks",
      "Manage client-side routing with React Router v6",
      "Fetch and manage API data with fetch, axios, and async/await",
      "Share global state using the Context API without prop drilling",
      "Optimize performance with React.memo, useMemo, useCallback, and code splitting",
      "Handle runtime errors gracefully with Error Boundaries",
      "Deploy production React applications to Vercel, Netlify, and GitHub Pages",
    ],
    requirements: [
      "Basic HTML and CSS knowledge",
      "JavaScript fundamentals (ES6+): arrow functions, destructuring, promises, modules",
      "No prior React experience required",
    ],
  });

  console.log(`✅  Course created: ${course.title}`);

  // ─── Helper ───────────────────────────────────────────────────────────────
  async function createChapter(
    title: string,
    order: number,
    lessons: Array<{
      title: string;
      slug: string;
      order: number;
      isFreePreview?: boolean;
      estimatedReadTime: number;
      summary: string;
      content: Block[];
    }>,
  ) {
    const topic = await Topic.create({ title, course: course._id, order });
    for (const lesson of lessons) {
      await Subtopic.create({ ...lesson, topic: topic._id, isFreePreview: lesson.isFreePreview ?? false });
    }
    console.log(`  ✅  Chapter ${order}: ${title} (${lessons.length} lessons)`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — Introduction to React
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Introduction to React", 1, [
    {
      title: "What is React & The Virtual DOM",
      slug: "intro-to-react",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 8,
      summary: "Discover what React is, why it exists, how the Virtual DOM makes updates fast, and an overview of the React ecosystem.",
      content: [
        { type: "heading", data: { level: 2, text: "What is React?" } },
        { type: "paragraph", data: { text: "React is an open-source JavaScript library developed and maintained by Meta (formerly Facebook). First released in 2013, React has grown to become the most widely used front-end library in the world for building interactive user interfaces. It powers applications like Facebook, Instagram, Airbnb, Netflix, and thousands more." } },
        { type: "paragraph", data: { text: "React's core philosophy is simple: build UIs from small, reusable pieces called components. Instead of manipulating the DOM directly (which is slow and error-prone), React uses a Virtual DOM — a lightweight copy of the real DOM — to efficiently calculate and apply only the changes that are needed." } },
        { type: "heading", data: { level: 2, text: "Why React?" } },
        { type: "list", data: { style: "bullet", items: ["Component-based: Code is organized into isolated, reusable pieces", "Virtual DOM: Fast, efficient UI updates", "Declarative: Describe what the UI should look like, not how to build it", "Large ecosystem: Thousands of libraries and a massive community", "React Native: Write once, deploy to iOS and Android"] } },
        { type: "heading", data: { level: 2, text: "React vs Traditional JavaScript" } },
        { type: "comparison", data: { leftTitle: "Traditional JS", rightTitle: "React", items: [{ left: "Manually find & update DOM elements", right: "Declare UI as a function of state" }, { left: "Imperative: describe HOW to update", right: "Declarative: describe WHAT to show" }, { left: "Error-prone at scale", right: "Predictable, testable components" }] } },
        { type: "code", data: { language: "javascript", code: "// Traditional JS\ndocument.getElementById('count').textContent = count;\n\n// React — just describe the UI\nreturn <p>{count}</p>;" } },
        { type: "heading", data: { level: 2, text: "The Virtual DOM Explained" } },
        { type: "paragraph", data: { text: "When state changes in a React app, React creates a new Virtual DOM tree and compares it to the previous one using a process called 'diffing'. Only the differences (diffs) are applied to the real DOM. This makes React extremely performant for complex, data-heavy UIs." } },
        { type: "heading", data: { level: 2, text: "React Ecosystem Overview" } },
        { type: "list", data: { style: "bullet", items: ["React DOM: Renders React components in the browser", "React Router: Client-side routing", "Redux / Zustand / Context: State management", "Axios / React Query: Data fetching", "Styled Components / Tailwind: Styling", "Vite / CRA: Build tooling"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["React is a declarative, component-based JavaScript library for building UIs", "The Virtual DOM makes updates fast by applying only the minimal changes to the real DOM", "React uses a 'diffing' algorithm to compare old and new Virtual DOM trees", "React is maintained by Meta and powers Facebook, Instagram, and Netflix", "React's ecosystem (React Router, Redux, Axios) covers everything needed for production apps"] } },
        { type: "quiz", data: { question: "What is the Virtual DOM?", options: ["A browser plugin", "A lightweight copy of the real DOM used for efficient updates", "A database", "A CSS framework"], correctIndex: 1, explanation: "The Virtual DOM is a JavaScript object that mirrors the real DOM. React compares old and new Virtual DOM snapshots (diffing) and only applies the minimal set of changes to the real DOM, making updates fast and efficient." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — Setup — Create React App & Vite
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Setup — Create React App & Vite", 2, [
    {
      title: "Setting Up a React Project with Vite",
      slug: "react-setup-vite-cra",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 7,
      summary: "Bootstrap a React project with Vite (recommended) or CRA, understand the project structure, and install React DevTools.",
      content: [
        { type: "heading", data: { level: 2, text: "Prerequisites" } },
        { type: "code", data: { language: "bash", code: "node -v   # v16 or higher required\nnpm -v    # Check npm version" } },
        { type: "heading", data: { level: 2, text: "Vite (Recommended)" } },
        { type: "paragraph", data: { text: "Vite is a modern build tool that uses native ES modules, making it significantly faster than CRA for development. It is now the recommended way to start React projects." } },
        { type: "code", data: { language: "bash", code: "npm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev" } },
        { type: "heading", data: { level: 2, text: "Create React App (CRA)" } },
        { type: "paragraph", data: { text: "CRA is the official, zero-configuration way to start a React project. It sets up Webpack, Babel, and other tooling automatically — but it can be slow for large projects." } },
        { type: "code", data: { language: "bash", code: "npx create-react-app my-app\ncd my-app\nnpm start" } },
        { type: "comparison", data: { leftTitle: "CRA", rightTitle: "Vite", items: [{ left: "Uses Webpack (slower)", right: "Uses native ES modules (fast)" }, { left: "Cold start: ~5-10s", right: "Cold start: <1s" }, { left: "Official but legacy", right: "Community recommended" }] } },
        { type: "heading", data: { level: 2, text: "Project Structure" } },
        { type: "code", data: { language: "bash", code: "my-app/\n├── public/          # Static assets\n├── src/\n│   ├── App.jsx      # Root component\n│   ├── main.jsx     # Entry point\n│   └── assets/      # Images, fonts\n├── index.html\n├── package.json\n└── vite.config.js" } },
        { type: "heading", data: { level: 2, text: "Understanding main.jsx" } },
        { type: "paragraph", data: { text: "The entry point of any React app is where React mounts the root component to the DOM." } },
        { type: "code", data: { language: "jsx", code: "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);" } },
        { type: "tip", data: { text: "Install the React DevTools browser extension (Chrome/Firefox). It lets you inspect component trees, props, state, and hooks in real time — an essential debugging tool." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Vite is the recommended tool for new React projects — much faster than CRA", "main.jsx is the entry point — it mounts the App component into the HTML", "React.StrictMode highlights potential problems during development", "The public/ folder holds static assets; src/ holds all React code", "npm run dev starts Vite's dev server on localhost:5173"] } },
        { type: "quiz", data: { question: "What is the entry point file in a Vite React app?", options: ["App.jsx", "index.js", "main.jsx", "root.js"], correctIndex: 2, explanation: "main.jsx is the entry point. It uses ReactDOM.createRoot() to mount the root App component into the HTML element with id='root'." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — JSX
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("JSX — JavaScript XML", 3, [
    {
      title: "JSX Syntax, Expressions, Fragments & Styling",
      slug: "jsx-javascript-xml",
      order: 1,
      estimatedReadTime: 8,
      summary: "Learn JSX syntax rules, embed JavaScript expressions, use Fragments to avoid extra DOM nodes, and apply inline styles.",
      content: [
        { type: "heading", data: { level: 2, text: "What is JSX?" } },
        { type: "paragraph", data: { text: "JSX stands for JavaScript XML. It is a syntax extension for JavaScript that lets you write HTML-like code inside JavaScript files. JSX is not valid JavaScript on its own — it is transpiled to regular JavaScript by Babel or Vite before the browser runs it." } },
        { type: "code", data: { language: "jsx", code: "// JSX\nconst element = <h1>Hello, World!</h1>;\n\n// What it compiles to\nconst element = React.createElement('h1', null, 'Hello, World!');" } },
        { type: "heading", data: { level: 2, text: "JSX Rules" } },
        { type: "list", data: { style: "bullet", items: ["Every JSX expression must return a single root element", "Use className instead of class (class is a reserved JS keyword)", "Use htmlFor instead of for in label elements", "All tags must be self-closed: <img /> <br />", "JavaScript expressions go inside curly braces {}"] } },
        { type: "heading", data: { level: 2, text: "Embedding Expressions" } },
        { type: "code", data: { language: "jsx", code: "const name = 'Alice';\nconst element = <h1>Hello, {name}!</h1>;\nconst element2 = <p>2 + 2 = {2 + 2}</p>;\nconst element3 = <img src={user.avatarUrl} />;" } },
        { type: "heading", data: { level: 2, text: "Fragments" } },
        { type: "paragraph", data: { text: "When you need to return multiple elements without adding extra DOM nodes, use React Fragments." } },
        { type: "code", data: { language: "jsx", code: "return (\n  <>\n    <h1>Title</h1>\n    <p>Description</p>\n  </>\n);" } },
        { type: "heading", data: { level: 2, text: "Conditional Rendering in JSX" } },
        { type: "code", data: { language: "jsx", code: "const isLoggedIn = true;\nreturn (\n  <div>\n    {isLoggedIn ? <p>Welcome!</p> : <p>Please log in</p>}\n  </div>\n);" } },
        { type: "heading", data: { level: 2, text: "Styling in JSX" } },
        { type: "code", data: { language: "jsx", code: "// Inline styles use camelCase property names\nconst style = { backgroundColor: 'blue', fontSize: 16 };\n<div style={style}>Styled</div>\n\n// Or inline object\n<div style={{ color: 'red', marginTop: 8 }}>Styled</div>" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["JSX compiles to React.createElement() calls — it's not HTML", "Use className (not class) and htmlFor (not for) in JSX", "All tags must be closed — <img /> not <img>", "Curly braces {} embed any JavaScript expression inside JSX", "Fragments (<> </>) let you return multiple elements without extra DOM nodes"] } },
        { type: "quiz", data: { question: "What does JSX compile to?", options: ["HTML", "CSS", "React.createElement() calls", "JSON"], correctIndex: 2, explanation: "JSX is syntactic sugar that compiles to React.createElement(type, props, ...children) calls. Babel or Vite handles this transpilation step automatically." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — Components
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Components — Functional & Class", 4, [
    {
      title: "Functional Components, Class Components & Composition",
      slug: "react-components",
      order: 1,
      estimatedReadTime: 9,
      summary: "Build functional and class components, compose them together, follow naming conventions, and understand exports.",
      content: [
        { type: "heading", data: { level: 2, text: "What is a Component?" } },
        { type: "paragraph", data: { text: "Components are the building blocks of every React application. A component is a self-contained piece of UI that encapsulates its own structure (JSX), logic (JavaScript), and optionally its own state. Think of components like custom HTML elements that you define yourself." } },
        { type: "heading", data: { level: 2, text: "Functional Components" } },
        { type: "paragraph", data: { text: "Functional components are plain JavaScript functions that accept props and return JSX. Since React 16.8 and Hooks, functional components are the standard way to write React code." } },
        { type: "code", data: { language: "jsx", code: "// Function declaration\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n// Arrow function syntax\nconst Greeting = ({ name }) => <h1>Hello, {name}!</h1>;" } },
        { type: "heading", data: { level: 2, text: "Class Components" } },
        { type: "paragraph", data: { text: "Class components were the original way to manage state in React. They extend React.Component and require a render() method. While still supported, they are largely replaced by functional components with Hooks." } },
        { type: "code", data: { language: "jsx", code: "import React, { Component } from 'react';\n\nclass Greeting extends Component {\n  render() {\n    return <h1>Hello, {this.props.name}!</h1>;\n  }\n}" } },
        { type: "info", data: { title: "Prefer Functional Components", text: "For all new code, use functional components with Hooks. They are simpler, more concise, and support all React features. Class components are only needed for Error Boundaries." } },
        { type: "heading", data: { level: 2, text: "Component Composition" } },
        { type: "code", data: { language: "jsx", code: "function Header() {\n  return <header><h1>My App</h1></header>;\n}\n\nfunction Footer() {\n  return <footer><p>© 2024</p></footer>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <main>Content here</main>\n      <Footer />\n    </div>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Naming Conventions & Exports" } },
        { type: "list", data: { style: "bullet", items: ["Component names must start with an uppercase letter — React uses this to distinguish components from HTML tags", "Use PascalCase: UserCard, ProductList", "One component per file for maintainability", "Named export: export function Button() { ... }", "Default export: export default function App() { ... }"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Components are reusable, self-contained UI pieces that return JSX", "Functional components are the modern standard — use them for all new code", "Component names must start with an uppercase letter", "Composition means nesting components to build complex UIs from simple parts", "Keep components small — if it exceeds ~100 lines, split it"] } },
        { type: "quiz", data: { question: "Which is the modern recommended way to write React components?", options: ["Class components", "Functional components with Hooks", "Object literals", "Prototype components"], correctIndex: 1, explanation: "Functional components with Hooks are the modern standard since React 16.8. They are simpler, easier to test, and support all React features. Class components are only required for Error Boundaries." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Props & State
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Props & State", 5, [
    {
      title: "Props, State & Lifting State Up",
      slug: "react-props-state",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 10,
      summary: "Pass data with props, manage dynamic data with useState, understand the children prop, and lift shared state to a common ancestor.",
      content: [
        { type: "heading", data: { level: 2, text: "Understanding Props" } },
        { type: "paragraph", data: { text: "Props (short for properties) are the mechanism by which parent components pass data to child components. Props are read-only — a component must never modify its own props. This enforces unidirectional data flow, making apps predictable and easier to debug." } },
        { type: "code", data: { language: "jsx", code: "function Button({ label, color }) {\n  return <button style={{ background: color }}>{label}</button>;\n}\n\n// Usage\n<Button label='Submit' color='green' />" } },
        { type: "heading", data: { level: 3, text: "Default Props" } },
        { type: "code", data: { language: "jsx", code: "function Button({ label = 'Click Me', color = 'blue' }) {\n  return <button style={{ background: color }}>{label}</button>;\n}" } },
        { type: "heading", data: { level: 3, text: "The Children Prop" } },
        { type: "code", data: { language: "jsx", code: "function Card({ children }) {\n  return <div className='card'>{children}</div>;\n}\n\n// Usage — JSX between tags becomes children\n<Card>\n  <h2>Title</h2>\n  <p>Content</p>\n</Card>" } },
        { type: "heading", data: { level: 2, text: "Understanding State" } },
        { type: "paragraph", data: { text: "State is data that belongs to a component and can change over time. When state changes, React re-renders the component with the new data. State is managed using the useState Hook in functional components." } },
        { type: "code", data: { language: "jsx", code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Props vs State" } },
        { type: "table", data: { headers: ["", "Props", "State"], rows: [["Source", "Passed from parent", "Managed within component"], ["Mutability", "Read-only", "Mutable (via setter)"], ["Purpose", "External data", "Internal data"], ["Re-render", "Parent controls", "Triggers re-render on change"]] } },
        { type: "heading", data: { level: 2, text: "Lifting State Up" } },
        { type: "paragraph", data: { text: "When multiple components need to share state, lift it up to their closest common ancestor and pass it down via props." } },
        { type: "code", data: { language: "jsx", code: "// Cart count shared between NavBar and CartPage\nfunction App() {\n  const [cartCount, setCartCount] = useState(0);\n  return (\n    <>\n      <NavBar cartCount={cartCount} />\n      <CartPage cartCount={cartCount} onAdd={() => setCartCount(c => c + 1)} />\n    </>\n  );\n}" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Props flow down from parent to child — they are always read-only", "State is local, mutable data that triggers re-renders on change", "useState returns [value, setter] — never mutate state directly", "The children prop contains the JSX passed between component opening/closing tags", "Lift state up to the closest common ancestor when siblings need to share it"] } },
        { type: "quiz", data: { question: "What does useState return?", options: ["An object", "A function", "An array with the state value and setter function", "A Promise"], correctIndex: 2, explanation: "useState returns an array with two elements: the current state value and a setter function. Destructure it: const [count, setCount] = useState(0)." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Event Handling
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Event Handling", 6, [
    {
      title: "Handling Events, Synthetic Events & State Updates",
      slug: "react-event-handling",
      order: 1,
      estimatedReadTime: 8,
      summary: "Handle click, change, submit events with camelCase syntax, use the synthetic event object, and pass arguments in loops.",
      content: [
        { type: "heading", data: { level: 2, text: "Handling Events in React" } },
        { type: "paragraph", data: { text: "React uses a synthetic event system that wraps native browser events for cross-browser compatibility. Event handlers are passed as props to JSX elements using camelCase naming." } },
        { type: "code", data: { language: "jsx", code: "function Button() {\n  function handleClick() {\n    alert('Button clicked!');\n  }\n  return <button onClick={handleClick}>Click Me</button>;\n}" } },
        { type: "warning", data: { title: "Common Mistake", text: "Pass the function reference, not a call: onClick={handleClick} ✅ — NOT onClick={handleClick()} ❌. The second version calls the function immediately on render." } },
        { type: "heading", data: { level: 2, text: "The Event Object" } },
        { type: "code", data: { language: "jsx", code: "function handleSubmit(e) {\n  e.preventDefault(); // Prevent page reload\n  console.log(e.target.value);\n}" } },
        { type: "heading", data: { level: 2, text: "Passing Arguments to Handlers" } },
        { type: "code", data: { language: "jsx", code: "function ItemList({ items }) {\n  function handleDelete(id) {\n    console.log('Delete item', id);\n  }\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id}>\n          {item.name}\n          <button onClick={() => handleDelete(item.id)}>Delete</button>\n        </li>\n      ))}\n    </ul>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Common Events" } },
        { type: "table", data: { headers: ["Event", "When it fires"], rows: [["onClick", "Mouse click"], ["onChange", "Input value changes"], ["onSubmit", "Form submission"], ["onKeyDown / onKeyUp", "Keyboard events"], ["onFocus / onBlur", "Focus/blur events"], ["onMouseEnter / onMouseLeave", "Hover events"]] } },
        { type: "heading", data: { level: 2, text: "State Updates in Event Handlers" } },
        { type: "code", data: { language: "jsx", code: "function LikeButton() {\n  const [liked, setLiked] = useState(false);\n  return (\n    <button onClick={() => setLiked(!liked)}>\n      {liked ? '❤️ Liked' : '🤍 Like'}\n    </button>\n  );\n}" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["React events use camelCase: onClick, onChange, onSubmit", "Always pass a function reference — not a function call — to event props", "e.preventDefault() stops the browser's default behavior (e.g. form reload)", "Use inline arrow functions to pass arguments in loops: onClick={() => handler(id)}", "Name handlers with a 'handle' prefix: handleClick, handleSubmit"] } },
        { type: "quiz", data: { question: "What method prevents a form from reloading the page?", options: ["e.stopEvent()", "e.cancel()", "e.preventDefault()", "e.stop()"], correctIndex: 2, explanation: "e.preventDefault() prevents the browser's default action for the event. For form submissions, the default action is a page reload — calling preventDefault() keeps the user on the page so React can handle the submission." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Conditional Rendering
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Conditional Rendering", 7, [
    {
      title: "if/else, Ternary, && Operator & Returning null",
      slug: "react-conditional-rendering",
      order: 1,
      estimatedReadTime: 7,
      summary: "Conditionally show or hide UI with if/else, ternary operators, short-circuit &&, returning null, and switch-based rendering.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Conditional Rendering?" } },
        { type: "paragraph", data: { text: "Conditional rendering means showing or hiding parts of the UI based on some condition — just like if/else statements in JavaScript, but inside JSX." } },
        { type: "heading", data: { level: 2, text: "if/else Pattern" } },
        { type: "code", data: { language: "jsx", code: "function Greeting({ isLoggedIn }) {\n  if (isLoggedIn) {\n    return <h1>Welcome back!</h1>;\n  }\n  return <h1>Please sign in.</h1>;\n}" } },
        { type: "heading", data: { level: 2, text: "Ternary Operator" } },
        { type: "code", data: { language: "jsx", code: "return (\n  <div>\n    {isLoggedIn ? <Dashboard /> : <Login />}\n  </div>\n);" } },
        { type: "heading", data: { level: 2, text: "Short-Circuit Evaluation (&&)" } },
        { type: "paragraph", data: { text: "The && operator is perfect for rendering something only when a condition is true." } },
        { type: "code", data: { language: "jsx", code: "{isAdmin && <AdminPanel />}\n{errorMessage && <p className='error'>{errorMessage}</p>}" } },
        { type: "heading", data: { level: 2, text: "Rendering null" } },
        { type: "code", data: { language: "jsx", code: "function Alert({ show, message }) {\n  if (!show) return null; // Renders nothing\n  return <div className='alert'>{message}</div>;\n}" } },
        { type: "heading", data: { level: 2, text: "Switch-Based Rendering" } },
        { type: "code", data: { language: "jsx", code: "function StatusBadge({ status }) {\n  switch(status) {\n    case 'active':   return <span className='green'>Active</span>;\n    case 'inactive': return <span className='red'>Inactive</span>;\n    default:         return <span>Unknown</span>;\n  }\n}" } },
        { type: "tip", data: { text: "Use ternary for simple true/false rendering. Use && for 'render only if true'. Use early return for complex conditions to keep JSX clean and readable." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Conditional rendering uses standard JS patterns inside JSX", "if/else works outside JSX or as an early return", "Ternary (condition ? a : b) works inline for two-way conditional rendering", "&& is perfect for 'show only if true' — no else needed", "Return null to hide a component without removing it from the tree"] } },
        { type: "quiz", data: { question: "What renders when {false && <Component />} is evaluated?", options: ["<Component />", "'false' as text", "Nothing", "An error"], correctIndex: 2, explanation: "When the left side of && is false, JavaScript short-circuits and doesn't evaluate the right side. React renders nothing for false. Note: {0 && <Component />} would render '0' — use !!value or value > 0 to avoid this." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Lists & Keys
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Lists & Keys", 8, [
    {
      title: "Rendering Lists with .map() and Stable Keys",
      slug: "react-lists-keys",
      order: 1,
      estimatedReadTime: 8,
      summary: "Render arrays with .map(), understand why keys are required, use stable IDs as keys, and avoid the pitfalls of index keys.",
      content: [
        { type: "heading", data: { level: 2, text: "Rendering Lists" } },
        { type: "paragraph", data: { text: "React renders lists by mapping over JavaScript arrays and returning JSX for each item. The .map() method is the standard way to do this." } },
        { type: "code", data: { language: "jsx", code: "const fruits = ['Apple', 'Banana', 'Cherry'];\n\nfunction FruitList() {\n  return (\n    <ul>\n      {fruits.map((fruit, index) => (\n        <li key={index}>{fruit}</li>\n      ))}\n    </ul>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Why Keys are Required" } },
        { type: "paragraph", data: { text: "Keys help React identify which items have changed, been added, or removed. Without keys, React re-renders the entire list on every change, which is inefficient. Keys must be unique among siblings." } },
        { type: "heading", data: { level: 2, text: "Using IDs as Keys (Recommended)" } },
        { type: "code", data: { language: "jsx", code: "const users = [\n  { id: 1, name: 'Alice' },\n  { id: 2, name: 'Bob' },\n];\n\nusers.map(user => <li key={user.id}>{user.name}</li>)" } },
        { type: "warning", data: { title: "Avoid Index as Key", text: "Using array index as a key causes bugs when the list is reordered, filtered, or items are deleted. Always use a stable, unique identifier from your data (like a database ID) when possible." } },
        { type: "heading", data: { level: 2, text: "Rendering Complex List Items" } },
        { type: "code", data: { language: "jsx", code: "function ProductList({ products }) {\n  return (\n    <div>\n      {products.map(p => (\n        <div key={p.id} className='product-card'>\n          <h3>{p.name}</h3>\n          <p>${p.price}</p>\n          <button>Add to Cart</button>\n        </div>\n      ))}\n    </div>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Filtering Lists" } },
        { type: "code", data: { language: "jsx", code: "const activeUsers = users.filter(u => u.isActive);\nactiveUsers.map(u => <li key={u.id}>{u.name}</li>)" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: [".map() returns an array of JSX elements that React renders", "Every list item must have a unique key prop among its siblings", "Always use stable data IDs (database IDs) as keys — not Math.random() or index", "Index as key is only safe for static lists that never change order", ".filter() + .map() chains are common for filtered list rendering"] } },
        { type: "quiz", data: { question: "Why is using array index as a key problematic?", options: ["It's not a number", "It can cause rendering bugs when the list is reordered", "React doesn't accept numbers", "It breaks JSX"], correctIndex: 1, explanation: "When you add, remove, or reorder items, indices shift. React uses keys to track identity across renders, so shifting indices cause React to reuse the wrong component instances, leading to incorrect state and rendering bugs." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Forms & Controlled Components
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Forms & Controlled Components", 9, [
    {
      title: "Controlled Inputs, Form Submission & Validation",
      slug: "react-forms-controlled-components",
      order: 1,
      estimatedReadTime: 9,
      summary: "Build controlled forms where React owns all input values, handle multiple inputs with one handler, and validate before submission.",
      content: [
        { type: "heading", data: { level: 2, text: "Controlled vs Uncontrolled Components" } },
        { type: "paragraph", data: { text: "In React, form inputs can be controlled (React manages the value via state) or uncontrolled (the DOM manages the value via useRef). Controlled components are recommended as they give React full control over form data, enabling real-time validation." } },
        { type: "heading", data: { level: 2, text: "Basic Controlled Input" } },
        { type: "code", data: { language: "jsx", code: "function NameInput() {\n  const [name, setName] = useState('');\n  return (\n    <input\n      type='text'\n      value={name}\n      onChange={e => setName(e.target.value)}\n    />\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Handling Form Submission" } },
        { type: "code", data: { language: "jsx", code: "function LoginForm() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    console.log({ email, password });\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email'/>\n      <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>\n      <button type='submit'>Login</button>\n    </form>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Handling Multiple Inputs (Single Handler)" } },
        { type: "code", data: { language: "jsx", code: "function SignupForm() {\n  const [form, setForm] = useState({ name: '', email: '', age: '' });\n\n  function handleChange(e) {\n    setForm({ ...form, [e.target.name]: e.target.value });\n  }\n\n  return (\n    <form>\n      <input name='name'  value={form.name}  onChange={handleChange} />\n      <input name='email' value={form.email} onChange={handleChange} />\n      <input name='age'   value={form.age}   onChange={handleChange} />\n    </form>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Select, Checkbox & Textarea" } },
        { type: "code", data: { language: "jsx", code: "// Select\n<select value={selected} onChange={e => setSelected(e.target.value)}>\n  <option value='react'>React</option>\n  <option value='vue'>Vue</option>\n</select>\n\n// Checkbox — use e.target.checked\n<input\n  type='checkbox'\n  checked={agreed}\n  onChange={e => setAgreed(e.target.checked)}\n/>" } },
        { type: "tip", data: { text: "Use a single state object for forms with many fields. This avoids multiple useState calls and allows a generic handleChange function using e.target.name as the dynamic key." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Controlled components bind input value to React state — React is always the source of truth", "For checkboxes, use e.target.checked (not e.target.value)", "A single state object + e.target.name pattern handles any number of fields cleanly", "Always call e.preventDefault() on form onSubmit to prevent page reload", "Validate all fields before calling the submit API"] } },
        { type: "quiz", data: { question: "What makes an input 'controlled' in React?", options: ["It has a name attribute", "Its value is controlled by React state", "It uses useRef", "It has a label"], correctIndex: 1, explanation: "A controlled input has its value prop bound to React state, and an onChange handler that updates that state. React is always the source of truth for the input's value." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 10 — React Hooks
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("React Hooks", 10, [
    {
      title: "useState, useEffect, useRef & the Rules of Hooks",
      slug: "react-hooks-core",
      order: 1,
      estimatedReadTime: 12,
      summary: "Master the core hooks: useState for state, useEffect for side effects with cleanup, and useRef for DOM access without re-renders.",
      content: [
        { type: "heading", data: { level: 2, text: "Introduction to Hooks" } },
        { type: "paragraph", data: { text: "Hooks are functions that let functional components 'hook into' React state and lifecycle features. Introduced in React 16.8, they eliminate the need for class components. The core hooks are useState, useEffect, useContext, useRef, useMemo, and useCallback." } },
        { type: "heading", data: { level: 2, text: "useEffect" } },
        { type: "paragraph", data: { text: "useEffect performs side effects in functional components — data fetching, subscriptions, DOM manipulation, timers. It runs after every render by default, or when specified dependencies change." } },
        { type: "code", data: { language: "jsx", code: "// Run on every render when count changes\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n\n// Run once on mount (empty dependency array)\nuseEffect(() => {\n  fetchData();\n}, []);\n\n// Cleanup function — runs before next effect or on unmount\nuseEffect(() => {\n  const timer = setInterval(() => tick(), 1000);\n  return () => clearInterval(timer); // Cleanup!\n}, []);" } },
        { type: "heading", data: { level: 2, text: "useRef" } },
        { type: "paragraph", data: { text: "useRef creates a mutable reference that persists across renders without causing re-renders. Common uses: accessing DOM elements and storing values that shouldn't trigger re-renders (like timer IDs)." } },
        { type: "code", data: { language: "jsx", code: "function TextInput() {\n  const inputRef = useRef(null);\n  return (\n    <>\n      <input ref={inputRef} />\n      <button onClick={() => inputRef.current.focus()}>Focus</button>\n    </>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Rules of Hooks" } },
        { type: "list", data: { style: "bullet", items: ["Only call Hooks at the top level — not inside loops, conditions, or nested functions", "Only call Hooks from React functional components or custom hooks", "These rules ensure Hooks are called in the same order on every render"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["useEffect with [] runs once on mount — perfect for fetching initial data", "useEffect's cleanup function runs before the next effect or on unmount — always clean up timers and subscriptions", "useRef does NOT cause re-renders when .current changes — unlike useState", "Always include all dependencies in the useEffect dependency array", "Never call Hooks inside conditions or loops"] } },
        { type: "quiz", data: { question: "What is the cleanup function in useEffect used for?", options: ["To clear React cache", "To unsubscribe/clear side effects on unmount", "To reset state", "To prevent renders"], correctIndex: 1, explanation: "The cleanup function returned from useEffect runs when the component unmounts or before the next effect fires. Use it to clear intervals, cancel fetch requests, remove event listeners — any side effect that should stop when the component goes away." } },
      ],
    },
    {
      title: "useMemo, useCallback, useReducer & Custom Hooks",
      slug: "react-hooks-advanced",
      order: 2,
      estimatedReadTime: 12,
      summary: "Optimize with useMemo and useCallback, manage complex state with useReducer, and extract logic into reusable custom hooks.",
      content: [
        { type: "heading", data: { level: 2, text: "useMemo" } },
        { type: "paragraph", data: { text: "useMemo memoizes the result of an expensive computation, recalculating only when dependencies change." } },
        { type: "code", data: { language: "jsx", code: "const sortedList = useMemo(() => {\n  return [...items].sort((a, b) => a.price - b.price);\n}, [items]); // Only recalculates when items changes" } },
        { type: "heading", data: { level: 2, text: "useCallback" } },
        { type: "paragraph", data: { text: "useCallback memoizes a function reference, preventing unnecessary re-renders of child components that receive the function as a prop." } },
        { type: "code", data: { language: "jsx", code: "const handleClick = useCallback(() => {\n  doSomething(id);\n}, [id]); // Stable reference — only changes when id changes" } },
        { type: "info", data: { title: "useMemo vs useCallback", text: "useMemo caches a computed VALUE (the result of calling a function). useCallback caches a FUNCTION REFERENCE (the function itself). Both prevent unnecessary work when dependencies haven't changed." } },
        { type: "heading", data: { level: 2, text: "useReducer" } },
        { type: "paragraph", data: { text: "useReducer is an alternative to useState for complex state logic. It follows the Redux pattern: dispatch an action, the reducer returns new state." } },
        { type: "code", data: { language: "jsx", code: "function reducer(state, action) {\n  switch (action.type) {\n    case 'increment': return { count: state.count + 1 };\n    case 'decrement': return { count: state.count - 1 };\n    default: return state;\n  }\n}\n\nconst [state, dispatch] = useReducer(reducer, { count: 0 });\n\n<button onClick={() => dispatch({ type: 'increment' })}>+</button>" } },
        { type: "heading", data: { level: 2, text: "Custom Hooks" } },
        { type: "paragraph", data: { text: "Custom hooks are reusable functions that use built-in hooks. They allow you to extract component logic into reusable functions — the naming convention is to prefix with 'use'." } },
        { type: "code", data: { language: "jsx", code: "// useFetch — reusable data fetching hook\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(r => r.json())\n      .then(d => { setData(d); setLoading(false); });\n  }, [url]);\n\n  return { data, loading };\n}\n\n// Usage\nconst { data, loading } = useFetch('/api/users');" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["useMemo caches computed values — use for expensive calculations", "useCallback caches function references — use when passing handlers to memoized children", "useReducer shines for complex state with multiple actions (like a form with validation)", "Custom hooks start with 'use' and can call any built-in hook", "Don't over-optimize — add useMemo/useCallback only when profiling shows a bottleneck"] } },
        { type: "quiz", data: { question: "What is a custom hook?", options: ["A built-in React function", "A function that uses built-in hooks and encapsulates reusable logic", "A lifecycle method", "A context provider"], correctIndex: 1, explanation: "A custom hook is a regular JavaScript function whose name starts with 'use' and that calls one or more built-in React hooks. It allows you to extract and share stateful logic across multiple components." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — React Router
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("React Router", 11, [
    {
      title: "Routing, Navigation, URL Params & Protected Routes",
      slug: "react-router",
      order: 1,
      estimatedReadTime: 11,
      summary: "Set up React Router v6, navigate with Link/NavLink, read URL params, redirect programmatically, and protect routes.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Client-Side Routing?" } },
        { type: "paragraph", data: { text: "Single-Page Applications (SPAs) load one HTML page and dynamically swap content without full page reloads. React Router is the standard library for implementing client-side routing in React." } },
        { type: "code", data: { language: "bash", code: "npm install react-router-dom" } },
        { type: "heading", data: { level: 2, text: "Setting Up React Router" } },
        { type: "code", data: { language: "jsx", code: "import { BrowserRouter, Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path='/'        element={<Home />} />\n        <Route path='/about'   element={<About />} />\n        <Route path='/users/:id' element={<UserDetail />} />\n        <Route path='*'        element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Navigation with Link & NavLink" } },
        { type: "code", data: { language: "jsx", code: "import { Link, NavLink } from 'react-router-dom';\n\n<Link to='/about'>About</Link>\n\n// NavLink adds 'active' class when route matches\n<NavLink to='/about' className={({isActive}) => isActive ? 'active' : ''}>\n  About\n</NavLink>" } },
        { type: "heading", data: { level: 2, text: "useParams — Reading URL Parameters" } },
        { type: "code", data: { language: "jsx", code: "import { useParams } from 'react-router-dom';\n\nfunction UserDetail() {\n  const { id } = useParams();\n  return <h1>User ID: {id}</h1>;\n}" } },
        { type: "heading", data: { level: 2, text: "useNavigate — Programmatic Navigation" } },
        { type: "code", data: { language: "jsx", code: "import { useNavigate } from 'react-router-dom';\n\nfunction LoginPage() {\n  const navigate = useNavigate();\n  function handleLogin() {\n    // After successful login...\n    navigate('/dashboard');\n  }\n}" } },
        { type: "heading", data: { level: 2, text: "Nested Routes with Outlet" } },
        { type: "code", data: { language: "jsx", code: "<Route path='/dashboard' element={<Dashboard />}>\n  <Route path='profile'  element={<Profile />} />\n  <Route path='settings' element={<Settings />} />\n</Route>\n\n// In Dashboard component\nimport { Outlet } from 'react-router-dom';\n<Outlet /> // Renders the matched child route" } },
        { type: "heading", data: { level: 2, text: "Protected Routes" } },
        { type: "code", data: { language: "jsx", code: "import { Navigate } from 'react-router-dom';\n\nfunction ProtectedRoute({ children }) {\n  const isAuth = useAuth();\n  return isAuth ? children : <Navigate to='/login' />;\n}\n\n// Usage\n<Route path='/admin' element={\n  <ProtectedRoute><Admin /></ProtectedRoute>\n} />" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["BrowserRouter wraps the app; Routes/Route declare paths", "Link/NavLink prevent full page reloads — NavLink adds active styling", "useParams() reads dynamic URL segments like :id", "useNavigate() enables redirect after login, form submit, etc.", "Nested routes + Outlet render child routes inside a parent layout", "Protected routes redirect unauthenticated users to /login"] } },
        { type: "quiz", data: { question: "What hook enables programmatic navigation (e.g. redirect after login)?", options: ["useRedirect", "useHistory", "useNavigate", "usePush"], correctIndex: 2, explanation: "useNavigate() returns a navigate function. Call navigate('/dashboard') to redirect after login, or navigate(-1) to go back. It replaces the old useHistory hook from React Router v5." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 12 — API Integration
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("API Integration — fetch & axios", 12, [
    {
      title: "Fetching Data, axios, Async/Await & CRUD Requests",
      slug: "react-api-integration",
      order: 1,
      estimatedReadTime: 10,
      summary: "Fetch data with useEffect and the native fetch API or axios, handle loading/error states, and make POST/PUT/DELETE requests.",
      content: [
        { type: "heading", data: { level: 2, text: "Fetching Data in React" } },
        { type: "paragraph", data: { text: "Most React applications fetch data from a backend API. The two most common ways are the native fetch API and the third-party axios library. Both work with Promises. API calls always go inside useEffect." } },
        { type: "heading", data: { level: 2, text: "Using fetch with useEffect" } },
        { type: "code", data: { language: "jsx", code: "function UserList() {\n  const [users, setUsers]     = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError]     = useState(null);\n\n  useEffect(() => {\n    fetch('https://api.example.com/users')\n      .then(res => res.json())\n      .then(data => { setUsers(data); setLoading(false); })\n      .catch(err => setError(err.message));\n  }, []);\n\n  if (loading) return <p>Loading...</p>;\n  if (error)   return <p>Error: {error}</p>;\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}" } },
        { type: "heading", data: { level: 2, text: "Using axios" } },
        { type: "code", data: { language: "jsx", code: "// npm install axios\nimport axios from 'axios';\n\nuseEffect(() => {\n  axios.get('/api/users')\n    .then(res => setUsers(res.data)) // axios parses JSON automatically\n    .catch(err => setError(err.message));\n}, []);" } },
        { type: "heading", data: { level: 2, text: "Async/Await Pattern" } },
        { type: "code", data: { language: "jsx", code: "useEffect(() => {\n  async function loadData() {\n    try {\n      const res = await fetch('/api/posts');\n      const data = await res.json();\n      setPosts(data);\n    } catch (err) {\n      setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  }\n  loadData();\n}, []);" } },
        { type: "heading", data: { level: 2, text: "POST, PUT, DELETE Requests" } },
        { type: "code", data: { language: "jsx", code: "// POST request\nasync function createUser(userData) {\n  const res = await fetch('/api/users', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(userData),\n  });\n  return res.json();\n}" } },
        { type: "comparison", data: { leftTitle: "fetch", rightTitle: "axios", items: [{ left: "Built-in — no install needed", right: "npm install required" }, { left: "Requires manual res.json()", right: "Auto-parses JSON (res.data)" }, { left: "No interceptors", right: "Request/response interceptors" }, { left: "Manual error checking", right: "Throws on 4xx/5xx responses" }] } },
        { type: "tip", data: { text: "For production apps, consider React Query or SWR. They provide caching, automatic refetching, pagination, and loading/error states out of the box — eliminating most boilerplate." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Always place API calls inside useEffect with appropriate dependencies", "Always handle loading, error, and empty states for good UX", "axios auto-parses JSON and throws on error status codes — less boilerplate than fetch", "Never use async directly as the useEffect callback — define an inner async function", "Abort fetch requests in useEffect cleanup to avoid memory leaks on unmount"] } },
        { type: "quiz", data: { question: "How is response data accessed differently in fetch vs axios?", options: ["No difference", "fetch requires res.json(); axios uses res.data directly", "axios requires res.json()", "fetch uses res.data"], correctIndex: 1, explanation: "With fetch, the response body is a ReadableStream — call res.json() to parse it. axios automatically parses JSON and puts the result in res.data, reducing boilerplate." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Context API
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Context API", 13, [
    {
      title: "Solving Prop Drilling with createContext & useContext",
      slug: "react-context-api",
      order: 1,
      estimatedReadTime: 10,
      summary: "Eliminate prop drilling with Context API — createContext, Provider, useContext — and build reusable Auth and Theme contexts.",
      content: [
        { type: "heading", data: { level: 2, text: "The Problem: Prop Drilling" } },
        { type: "paragraph", data: { text: "Prop drilling occurs when data needs to be passed through multiple layers of components just to reach a deeply nested child. This makes components tightly coupled and hard to maintain." } },
        { type: "code", data: { language: "jsx", code: "// Prop drilling — user is passed through every layer\n<App user={user}>\n  <Layout user={user}>\n    <Sidebar user={user}>\n      <UserMenu user={user} /> // Only this needs it!\n    </Sidebar>\n  </Layout>\n</App>" } },
        { type: "heading", data: { level: 2, text: "Creating and Using Context" } },
        { type: "code", data: { language: "jsx", code: "import { createContext, useContext, useState } from 'react';\n\n// 1. Create context with a default value\nconst ThemeContext = createContext('light');\n\n// 2. Provide value at the top level\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Layout />\n    </ThemeContext.Provider>\n  );\n}\n\n// 3. Consume in any descendant — no prop passing needed!\nfunction Button() {\n  const { theme, setTheme } = useContext(ThemeContext);\n  return (\n    <button className={theme} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>\n      Toggle Theme\n    </button>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "Custom Context Provider Pattern" } },
        { type: "code", data: { language: "jsx", code: "// theme-context.js\nconst ThemeContext = createContext();\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\n// Custom hook for clean consumption\nexport function useTheme() {\n  return useContext(ThemeContext);\n}" } },
        { type: "heading", data: { level: 2, text: "Auth Context Example" } },
        { type: "code", data: { language: "jsx", code: "const AuthContext = createContext();\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const login  = (userData) => setUser(userData);\n  const logout = () => setUser(null);\n  return (\n    <AuthContext.Provider value={{ user, login, logout }}>\n      {children}\n    </AuthContext.Provider>\n  );\n}\n\n// In any component\nconst { user, logout } = useContext(AuthContext);" } },
        { type: "info", data: { title: "Context vs Redux", text: "Context API is built-in and ideal for low-frequency updates (auth, theme, locale). Redux/Zustand is better for high-frequency, complex state updates with many actions and optimized selective subscriptions." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Context API eliminates prop drilling — share data globally without passing through every layer", "Three parts: createContext() → Provider (supply) → useContext() (consume)", "Provider should be placed at or above the components that need the context", "Wrap context in a custom Provider component and a custom hook for a clean API", "Context causes re-renders in all consumers when the Provider value changes"] } },
        { type: "quiz", data: { question: "What are the three parts of Context API?", options: ["create, use, subscribe", "createContext, Provider, useContext", "store, reducer, dispatch", "connect, mapState, dispatch"], correctIndex: 1, explanation: "The three parts are: (1) createContext() — creates the context object, (2) Context.Provider — wraps components and supplies the value, (3) useContext() — reads the context value in any descendant component." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 14 — Performance Optimization
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Performance Optimization", 14, [
    {
      title: "React.memo, Code Splitting, Virtualization & Profiling",
      slug: "react-performance-optimization",
      order: 1,
      estimatedReadTime: 10,
      summary: "Prevent unnecessary re-renders with React.memo, split code with React.lazy/Suspense, virtualize long lists, and profile with DevTools.",
      content: [
        { type: "heading", data: { level: 2, text: "Why Performance Matters" } },
        { type: "paragraph", data: { text: "React is fast by default, but as applications grow, unnecessary re-renders can degrade performance. Understanding when and why components re-render helps you optimize strategically. Always profile before optimizing." } },
        { type: "heading", data: { level: 2, text: "React.memo" } },
        { type: "paragraph", data: { text: "React.memo is a higher-order component that prevents a component from re-rendering if its props haven't changed." } },
        { type: "code", data: { language: "jsx", code: "const ProductCard = React.memo(function ProductCard({ product }) {\n  return <div>{product.name} - ${product.price}</div>;\n});\n// Now ProductCard only re-renders when its 'product' prop actually changes" } },
        { type: "heading", data: { level: 2, text: "Stabilizing Handlers with useCallback" } },
        { type: "code", data: { language: "jsx", code: "function Parent() {\n  const [count, setCount] = useState(0);\n\n  // Without useCallback: new function reference on every render\n  // → React.memo on Child is defeated\n  const handleClick = useCallback(() => {\n    console.log('clicked');\n  }, []); // Stable reference\n\n  return <Child onClick={handleClick} />;\n}" } },
        { type: "heading", data: { level: 2, text: "Code Splitting with React.lazy" } },
        { type: "paragraph", data: { text: "Code splitting defers loading of components until they are needed, reducing the initial bundle size." } },
        { type: "code", data: { language: "jsx", code: "const Dashboard = React.lazy(() => import('./Dashboard'));\n\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <Dashboard />\n    </Suspense>\n  );\n}" } },
        { type: "heading", data: { level: 2, text: "List Virtualization" } },
        { type: "paragraph", data: { text: "For very long lists (1000+ items), use a virtualization library like react-window. It only renders items currently visible in the viewport, dramatically reducing DOM nodes." } },
        { type: "code", data: { language: "bash", code: "npm install react-window" } },
        { type: "heading", data: { level: 2, text: "Profiling with React DevTools" } },
        { type: "paragraph", data: { text: "React DevTools includes a Profiler tab that records component render times and shows which components are re-rendering. Use it to identify bottlenecks before optimizing." } },
        { type: "tip", data: { text: "Profile first — don't optimize prematurely. React.memo, useCallback, and useMemo all add overhead. Only add them where measurements show a real benefit." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["React.memo prevents re-renders when props are shallowly equal", "useCallback is needed alongside React.memo to prevent handler prop changes from busting the memo", "React.lazy + Suspense splits code by route — loads JS only when the route is visited", "react-window virtualizes long lists — only renders visible rows", "Always profile with React DevTools Profiler before adding optimizations"] } },
        { type: "quiz", data: { question: "What does React.memo do?", options: ["Memoizes hook values", "Prevents re-render if props haven't changed", "Caches API responses", "Lazy loads components"], correctIndex: 1, explanation: "React.memo wraps a component and does a shallow comparison of props before each render. If props are the same as last render, React skips re-rendering that component and reuses the last rendered output." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 15 — Error Boundaries
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Error Boundaries", 15, [
    {
      title: "Catching Runtime Errors with Error Boundaries",
      slug: "react-error-boundaries",
      order: 1,
      estimatedReadTime: 8,
      summary: "Build Error Boundary class components with getDerivedStateFromError and componentDidCatch, and use react-error-boundary for a simpler API.",
      content: [
        { type: "heading", data: { level: 2, text: "What is an Error Boundary?" } },
        { type: "paragraph", data: { text: "Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application. Error boundaries must be class components — they rely on two lifecycle methods: getDerivedStateFromError and componentDidCatch." } },
        { type: "heading", data: { level: 2, text: "Creating an Error Boundary" } },
        { type: "code", data: { language: "jsx", code: "class ErrorBoundary extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false };\n  }\n\n  static getDerivedStateFromError(error) {\n    // Update state to show fallback UI on next render\n    return { hasError: true };\n  }\n\n  componentDidCatch(error, errorInfo) {\n    // Log to an error service (Sentry, LogRocket, etc.)\n    console.error('Error:', error, errorInfo);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return <h2>Something went wrong. Please try again.</h2>;\n    }\n    return this.props.children;\n  }\n}" } },
        { type: "heading", data: { level: 2, text: "Granular Error Boundaries" } },
        { type: "code", data: { language: "jsx", code: "// Wrap individual sections — a crash in one doesn't take down the whole page\n<ErrorBoundary fallback={<p>Chart failed to load</p>}>\n  <AnalyticsChart />\n</ErrorBoundary>\n\n<ErrorBoundary fallback={<p>Comments unavailable</p>}>\n  <CommentSection />\n</ErrorBoundary>" } },
        { type: "heading", data: { level: 2, text: "What Error Boundaries Don't Catch" } },
        { type: "list", data: { style: "bullet", items: ["Errors in event handlers (use try/catch instead)", "Async errors — fetch failures (handle in try/catch)", "Errors in the error boundary itself", "Errors in server-side rendering"] } },
        { type: "heading", data: { level: 2, text: "react-error-boundary Library" } },
        { type: "code", data: { language: "jsx", code: "// npm install react-error-boundary\nimport { ErrorBoundary } from 'react-error-boundary';\n\n<ErrorBoundary fallback={<div>Something went wrong</div>}>\n  <MyComponent />\n</ErrorBoundary>" } },
        { type: "tip", data: { text: "In production, log errors to a monitoring service like Sentry inside componentDidCatch. This gives you visibility into runtime errors users encounter, along with full stack traces." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Error Boundaries catch render-time errors in child components and show a fallback UI", "They must be class components — no functional component alternative for the lifecycle methods", "getDerivedStateFromError updates state to show fallback; componentDidCatch logs the error", "Wrap individual page sections in separate Error Boundaries for isolation", "Use the react-error-boundary package for a simpler, functional-friendly API"] } },
        { type: "quiz", data: { question: "Do error boundaries catch errors in event handlers?", options: ["Yes", "No — use try/catch for event handlers", "Only in class components", "Only in production"], correctIndex: 1, explanation: "Error Boundaries only catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. Errors in event handlers must be caught manually with try/catch inside the handler function." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 16 — Project Structure & Best Practices
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Project Structure & Best Practices", 16, [
    {
      title: "Scalable Folder Structure, Naming, Env Variables & Testing",
      slug: "react-project-structure",
      order: 1,
      estimatedReadTime: 9,
      summary: "Organize large React apps with feature-based folder structures, naming conventions, absolute imports, environment variables, and testing.",
      content: [
        { type: "heading", data: { level: 2, text: "Scalable Folder Structure" } },
        { type: "code", data: { language: "bash", code: "src/\n├── components/        # Reusable UI components\n│   ├── Button/\n│   │   ├── Button.jsx\n│   │   ├── Button.css\n│   │   └── Button.test.jsx\n│   └── Modal/\n├── pages/             # Route-level components\n│   ├── Home.jsx\n│   └── Dashboard.jsx\n├── hooks/             # Custom hooks\n│   └── useFetch.js\n├── context/           # Context providers\n│   └── AuthContext.jsx\n├── services/          # API call functions\n│   └── userService.js\n├── utils/             # Helper functions\n├── assets/            # Images, fonts\n└── App.jsx" } },
        { type: "heading", data: { level: 2, text: "Naming Conventions" } },
        { type: "list", data: { style: "bullet", items: ["Components: PascalCase — UserCard, ProductList", "Files: Match component name — UserCard.jsx", "Custom Hooks: camelCase with 'use' prefix — useAuth, useFetch", "Constants: UPPER_SNAKE_CASE — API_BASE_URL, MAX_RETRIES"] } },
        { type: "heading", data: { level: 2, text: "Absolute Imports" } },
        { type: "code", data: { language: "jsx", code: "// Instead of: import Button from '../../../components/Button'\n// Configure in vite.config.js:\n// resolve: { alias: { '@': path.resolve(__dirname, './src') } }\n\nimport Button from '@/components/Button'; // Clean!" } },
        { type: "heading", data: { level: 2, text: "Environment Variables" } },
        { type: "code", data: { language: "bash", code: "# .env\nVITE_API_URL=https://api.example.com\n\n# In code (Vite prefix is VITE_)\nconst API_URL = import.meta.env.VITE_API_URL;" } },
        { type: "heading", data: { level: 2, text: "Code Splitting by Route" } },
        { type: "code", data: { language: "jsx", code: "// Lazy-load each page so only the needed code loads per route\nconst Home      = React.lazy(() => import('./pages/Home'));\nconst Dashboard = React.lazy(() => import('./pages/Dashboard'));" } },
        { type: "heading", data: { level: 2, text: "Testing" } },
        { type: "list", data: { style: "bullet", items: ["Unit test individual components with React Testing Library + Jest", "Test user interactions, not implementation details", "E2E tests with Playwright or Cypress for critical flows"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Feature-based folders colocate component, styles, and tests — move one folder to refactor", "Vite env vars must be prefixed with VITE_ to be exposed to the client bundle", "Absolute imports with @/ alias eliminate ../../.. paths", "Colocate tests next to components — not in a separate /tests directory", "Use ESLint + Prettier for consistent code style across the team"] } },
        { type: "quiz", data: { question: "How should Vite environment variables be prefixed?", options: ["REACT_APP_", "ENV_", "VITE_", "APP_"], correctIndex: 2, explanation: "Vite only exposes environment variables prefixed with VITE_ to client-side code for security. Variables without the prefix are only available server-side and won't be bundled into your app." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 17 — Deployment
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Deployment", 17, [
    {
      title: "Building for Production & Deploying to Vercel, Netlify & GitHub Pages",
      slug: "react-deployment",
      order: 1,
      estimatedReadTime: 8,
      summary: "Build with npm run build, deploy to Vercel, Netlify, or GitHub Pages, configure routing redirects, and manage environment variables.",
      content: [
        { type: "heading", data: { level: 2, text: "Building for Production" } },
        { type: "paragraph", data: { text: "Before deploying, create an optimized production build. Vite compiles, minifies, and tree-shakes your code into static files ready for hosting." } },
        { type: "code", data: { language: "bash", code: "npm run build\n# Generates a dist/ folder with index.html and bundled assets" } },
        { type: "heading", data: { level: 2, text: "Deploying to Vercel (Recommended)" } },
        { type: "list", data: { style: "ordered", items: ["Push code to GitHub", "Connect the repo at vercel.com", "Vercel auto-detects Vite/CRA and deploys on every push", "Set environment variables in Vercel's Project Settings → Environment Variables"] } },
        { type: "heading", data: { level: 2, text: "Deploying to Netlify" } },
        { type: "code", data: { language: "bash", code: "npm install -g netlify-cli\nnetlify deploy --prod --dir=dist" } },
        { type: "heading", data: { level: 2, text: "Deploying to GitHub Pages" } },
        { type: "code", data: { language: "bash", code: "npm install gh-pages\n\n# In package.json:\n# \"homepage\": \"https://username.github.io/repo-name\"\n# \"scripts\": { \"predeploy\": \"npm run build\", \"deploy\": \"gh-pages -d dist\" }\n\nnpm run deploy" } },
        { type: "heading", data: { level: 2, text: "Handling Client-Side Routing on Deploy" } },
        { type: "paragraph", data: { text: "Since React Router handles routing client-side, the server must redirect all 404s to index.html so React Router can take over." } },
        { type: "code", data: { language: "bash", code: "# Netlify — create public/_redirects file:\n/* /index.html 200\n\n# Vercel — handled automatically" } },
        { type: "heading", data: { level: 2, text: "Environment Variables in Production" } },
        { type: "list", data: { style: "bullet", items: ["Set VITE_ prefixed variables in the platform's environment settings (never in code)", "Never commit .env files with secrets to Git", "Use .env.example to document required variables for teammates"] } },
        { type: "warning", data: { title: "Never Commit Secrets to Git", text: "API keys, tokens, and passwords committed to a public GitHub repo are immediately visible and can be scraped by bots. Always use platform environment variables (Vercel dashboard, Netlify env settings) for secrets." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["npm run build creates the optimized production bundle in dist/", "Vercel auto-deploys from GitHub and handles routing redirects automatically", "Netlify requires a _redirects file with /* /index.html 200 for React Router", "Never commit .env files to Git — use platform environment variables", "Consider Next.js if your app needs SSR or SSG for SEO"] } },
        { type: "quiz", data: { question: "Why must you add redirect rules for React Router on the server?", options: ["For faster routing", "The server doesn't know about client-side routes and returns 404", "For HTTPS", "For caching"], correctIndex: 1, explanation: "React Router operates entirely in the browser. When a user navigates directly to /dashboard, the server looks for a /dashboard file — which doesn't exist. The redirect rule tells the server to always serve index.html, letting React Router handle the route." } },
      ],
    },
  ]);

  console.log("\n🎉  React.js course seeded successfully!");
  console.log(`    Chapters: 17 | Lessons: ~19`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
