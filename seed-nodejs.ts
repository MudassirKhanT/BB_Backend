/**
 * Seed the Node.js + Express.js Complete Developer Course.
 *
 * Run from the BB_Backend directory:
 *   npx ts-node --esm seed-nodejs.ts
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

  // Reuse existing instructor (created by seed.ts)
  const instructor = await User.findOne({ role: "instructor" });
  if (!instructor) {
    console.error("❌  No instructor found — run seed.ts first.");
    process.exit(1);
  }

  const existing = await Course.findOne({ slug: "nodejs-expressjs" });
  if (existing) {
    console.log("⏭  Course already exists — skipping.");
    await mongoose.disconnect();
    process.exit(0);
  }

  // ─── Create Course ────────────────────────────────────────────────────────
  const course = await Course.create({
    title: "Node.js + Express.js Complete Course",
    slug: "nodejs-expressjs",
    description:
      "A comprehensive guide to building fast, scalable, and production-ready backend applications using Node.js and Express.js. Covers Node.js internals, async programming, REST API design, authentication with JWT, MongoDB integration, and deployment.",
    shortDescription:
      "Master backend development with Node.js & Express.js — from first server to production deployment.",
    tags: ["Node.js", "Express.js", "Backend", "REST API", "MongoDB", "JWT", "MVC"],
    category: "Web Development",
    level: "Beginner",
    author: instructor._id,
    isPublished: true,
    price: 999,
    totalEnrollments: 0,
    rating: 0,
    totalRatings: 0,
    estimatedDuration: "40 hours",
    color: "from-green-500 to-emerald-600",
    icon: "Globe",
    whatYouWillLearn: [
      "Understand Node.js internals: Event Loop, V8 engine, and libuv",
      "Build RESTful APIs with Express.js following MVC architecture",
      "Implement JWT authentication and role-based authorization",
      "Connect to MongoDB using Mongoose with proper schemas, models, and CRUD",
      "Handle errors professionally, validate requests, and upload files",
      "Deploy Node.js apps to cloud platforms and manage processes with PM2",
    ],
    requirements: [
      "Basic JavaScript knowledge (variables, functions, arrays, objects)",
      "Familiarity with command line / terminal",
      "No prior Node.js or backend experience required",
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
  // CHAPTER 1 — Introduction to Node.js
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Introduction to Node.js", 1, [
    {
      title: "What is Node.js & Why Use It",
      slug: "what-is-nodejs",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 8,
      summary: "Discover what Node.js is, how it works, and why companies like Netflix and Uber rely on it.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Node.js?" } },
        { type: "paragraph", data: { text: "Node.js is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 JavaScript engine. Created by Ryan Dahl in 2009, it allows developers to execute JavaScript on the server side — outside the browser — enabling full-stack JavaScript development." } },
        { type: "info", data: { title: "The Big Idea", text: "Before Node.js, JavaScript was browser-only. Node.js changed that: one language, both frontend and backend. Today it powers Netflix, Uber, LinkedIn, PayPal, and NASA." } },
        { type: "heading", data: { level: 2, text: "Why Node.js?" } },
        { type: "list", data: { style: "bullet", items: ["Single Language: JavaScript on both frontend and backend", "High Performance: V8 engine compiles JS directly to native machine code", "Non-blocking I/O: Handles thousands of concurrent connections on one thread", "Vast Ecosystem: npm has over 2 million open-source packages", "Real-time Applications: Ideal for chat apps, live notifications, streaming"] } },
        { type: "heading", data: { level: 2, text: "Node.js vs Traditional Servers" } },
        { type: "table", data: { headers: ["Feature", "Node.js", "Traditional (PHP/Java)"], rows: [["Thread Model", "Single-threaded, event loop", "Multi-threaded (one per request)"], ["I/O Model", "Non-blocking, async", "Blocking, synchronous"], ["Language", "JavaScript", "PHP, Java, Python, Ruby"], ["Scalability", "Highly scalable, horizontal", "Limited by thread count"]] } },
        { type: "heading", data: { level: 2, text: "Real-World Use Cases" } },
        { type: "list", data: { style: "bullet", items: ["Netflix: Handles millions of streaming requests", "LinkedIn: Switched from Ruby on Rails — 2× performance improvement", "Uber: Real-time ride-matching and location tracking", "PayPal: Reduced response time by 35% after switching to Node.js", "NASA: Uses Node.js for astronaut suit data pipelines"] } },
        { type: "keyPoints", data: { title: "Chapter 1 Key Takeaways", points: ["Node.js runs JavaScript on the server, powered by Chrome's V8 engine", "Event-driven and non-blocking — perfect for scalable, data-intensive apps", "npm provides access to 2M+ packages", "Use LTS (Long-Term Support) version in production", "Modularize code, use environment variables, and always handle errors"] } },
        { type: "quiz", data: { question: "Who created Node.js and in which year?", options: ["Brendan Eich, 2005", "Ryan Dahl, 2009", "Linus Torvalds, 2012", "Douglas Crockford, 2007"], correctIndex: 1, explanation: "Ryan Dahl created Node.js in 2009, building it on Chrome's V8 JavaScript engine to enable server-side JavaScript execution." } },
      ],
    },
    {
      title: "Node.js Architecture – Event Loop & Non-blocking I/O",
      slug: "nodejs-event-loop",
      order: 2,
      estimatedReadTime: 10,
      summary: "Deep dive into the event loop, call stack, callback queue, and why Node.js never blocks.",
      content: [
        { type: "heading", data: { level: 2, text: "How Node.js Works Internally" } },
        { type: "paragraph", data: { text: "Node.js uses a single-threaded event loop architecture. When an I/O operation is initiated, it is handed off to the OS via libuv — Node.js continues processing other tasks and handles the result when the operation completes." } },
        { type: "heading", data: { level: 2, text: "The Event Loop Phases" } },
        { type: "list", data: { style: "ordered", items: ["Timers: Executes setTimeout() and setInterval() callbacks", "I/O Callbacks: Processes most I/O callbacks (file, network, database)", "Idle / Prepare: Used internally by Node.js", "Poll: Retrieves new I/O events; executes I/O-related callbacks", "Check: Executes setImmediate() callbacks", "Close Callbacks: Handles close events (e.g., socket.on('close', ...))"] } },
        { type: "heading", data: { level: 2, text: "Blocking vs Non-blocking" } },
        { type: "code", data: { language: "javascript", title: "Blocking — Bad for Performance", code: "const fs = require('fs');\n// BLOCKING — halts execution until file is read\nconst data = fs.readFileSync('file.txt', 'utf8');\nconsole.log(data);\nconsole.log('This runs AFTER the file is read');" } },
        { type: "code", data: { language: "javascript", title: "Non-blocking — The Right Way", code: "const fs = require('fs');\n// NON-BLOCKING — continues while file is being read\nfs.readFile('file.txt', 'utf8', (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\nconsole.log('This runs BEFORE the file read completes');" } },
        { type: "heading", data: { level: 2, text: "Call Stack, Callback Queue & Event Loop" } },
        { type: "code", data: { language: "javascript", title: "Event Loop Visualization", code: "console.log('Start');\nsetTimeout(() => {\n  console.log('Timeout callback');\n}, 0);\nconsole.log('End');\n// Output:\n// Start\n// End\n// Timeout callback\n// Even 0ms delay goes through the event loop!" } },
        { type: "info", data: { title: "libuv Thread Pool", text: "While Node.js is single-threaded for JavaScript, libuv uses a thread pool (default 4 threads) for heavy operations: file system I/O, DNS lookups, crypto, and compression." } },
        { type: "warning", data: { title: "Never Block the Event Loop", text: "Using fs.readFileSync(), complex synchronous computations, or tight loops in request handlers freezes all other requests. Use async versions of all I/O operations in production." } },
        { type: "quiz", data: { question: "Which library provides the event loop in Node.js?", options: ["V8", "libuv", "openssl", "zlib"], correctIndex: 1, explanation: "libuv is the C library that implements the event loop and thread pool in Node.js. V8 is the JavaScript engine that executes JS code." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — Installation & Setup
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Installation & Setup", 2, [
    {
      title: "Installing Node.js & Your First Program",
      slug: "installing-nodejs",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 6,
      summary: "Install Node.js with nvm, write your first program, and understand the project setup.",
      content: [
        { type: "heading", data: { level: 2, text: "Installing Node.js" } },
        { type: "list", data: { style: "ordered", items: ["Method 1 (Recommended for beginners): Download LTS from https://nodejs.org", "Method 2 (Best for developers): Use nvm (Node Version Manager) to switch between versions", "Method 3 (macOS): brew install node | (Ubuntu): sudo apt install nodejs npm"] } },
        { type: "code", data: { language: "javascript", title: "Install via nvm (macOS/Linux)", code: "# Install nvm\ncurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash\n\n# Install & use LTS\nnvm install --lts\nnvm use --lts\n\n# Verify installation\nnode --version\nnpm --version" } },
        { type: "heading", data: { level: 2, text: "Your First Node.js Program" } },
        { type: "code", data: { language: "javascript", title: "app.js — Hello Node.js", code: "// app.js\nconsole.log('Hello, Node.js!');\nconsole.log('Node version:', process.version);\n\n// Run it:\n// node app.js\n// Output:\n// Hello, Node.js!\n// Node version: v18.17.0" } },
        { type: "heading", data: { level: 2, text: "Setting Up a Project" } },
        { type: "code", data: { language: "javascript", title: "Initialize a Node.js Project", code: "mkdir my-node-project\ncd my-node-project\nnpm init -y\n\n# Creates package.json:\n# {\n#   \"name\": \"my-node-project\",\n#   \"version\": \"1.0.0\",\n#   \"main\": \"index.js\",\n#   \"scripts\": { \"test\": \"...\" },\n#   \"license\": \"ISC\"\n# }" } },
        { type: "info", data: { title: "The Node.js REPL", text: "Type node in your terminal to open the REPL (Read-Eval-Print Loop) — an interactive JavaScript shell. Great for quick experiments. Type .exit to quit." } },
        { type: "keyPoints", data: { title: "Setup Best Practices", points: ["Use nvm to manage multiple Node.js versions", "Always commit package.json and package-lock.json to version control", "Add node_modules/ to .gitignore — never commit it", "Use npm init -y for quick project setup", "Use LTS versions in production"] } },
        { type: "quiz", data: { question: "What command initializes a new Node.js project with default settings?", options: ["npm start", "npm install", "npm init -y", "node init"], correctIndex: 2, explanation: "npm init -y creates a package.json file with default values. The -y flag (yes) skips the interactive prompts and accepts all defaults." } },
      ],
    },
    {
      title: "Understanding package.json & NPM",
      slug: "package-json-npm",
      order: 2,
      estimatedReadTime: 8,
      summary: "Master package.json fields, semantic versioning, npm commands, and nodemon for development.",
      content: [
        { type: "heading", data: { level: 2, text: "Understanding package.json" } },
        { type: "table", data: { headers: ["Field", "Purpose"], rows: [["name", "Project name (lowercase, no spaces)"], ["version", "Follows semantic versioning (major.minor.patch)"], ["main", "Entry point of the application"], ["scripts", "Custom commands (start, test, dev, build)"], ["dependencies", "Packages required to run the app in production"], ["devDependencies", "Packages needed only during development"]] } },
        { type: "heading", data: { level: 2, text: "Semantic Versioning (SemVer)" } },
        { type: "info", data: { title: "MAJOR.MINOR.PATCH — e.g. 4.18.2", text: "MAJOR: Breaking changes. MINOR: New features (backward-compatible). PATCH: Bug fixes. In package.json: ^4.18.2 allows minor+patch updates; ~4.18.2 allows only patch; 4.18.2 is exact." } },
        { type: "heading", data: { level: 2, text: "Essential NPM Commands" } },
        { type: "code", data: { language: "javascript", title: "NPM Command Reference", code: "npm install express          # Install as dependency\nnpm install -D nodemon       # Install as devDependency\nnpm install -g nodemon       # Install globally (CLI tool)\nnpm uninstall express        # Remove a package\nnpm update express           # Update to latest\nnpm list                     # List installed packages\nnpm audit                    # Check for security vulnerabilities\nnpm run dev                  # Run a script from package.json" } },
        { type: "heading", data: { level: 2, text: "Nodemon — Auto-restart on Changes" } },
        { type: "code", data: { language: "javascript", title: "Setup Nodemon for Development", code: "npm install -D nodemon\n\n// package.json\n{\n  \"scripts\": {\n    \"start\": \"node index.js\",\n    \"dev\": \"nodemon index.js\"\n  }\n}\n\n// Run development server:\nnpm run dev" } },
        { type: "tip", data: { text: "Always commit package-lock.json to ensure reproducible builds. It records the exact version of every installed package so every developer installs the same thing." } },
        { type: "quiz", data: { question: "What does the ^ symbol before a version mean in package.json?", options: ["Install exact version only", "Install only patch updates", "Install compatible minor and patch updates", "Install any version"], correctIndex: 2, explanation: "The ^ (caret) allows npm to install newer minor and patch versions but not major ones. ^4.18.2 can install 4.19.0 or 4.18.3 but NOT 5.0.0." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — Core Modules
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Core Modules (fs, http, path, os, events)", 3, [
    {
      title: "File System & HTTP Modules",
      slug: "fs-http-modules",
      order: 1,
      estimatedReadTime: 10,
      summary: "Read/write files with the fs module and build your first HTTP server with the http module.",
      content: [
        { type: "heading", data: { level: 2, text: "Core Modules Overview" } },
        { type: "paragraph", data: { text: "Core modules ship with Node.js and require no installation. Import with require() without specifying a path: const fs = require('fs')." } },
        { type: "heading", data: { level: 2, text: "The fs Module (File System)" } },
        { type: "code", data: { language: "javascript", title: "Reading & Writing Files", code: "const fs = require('fs');\n\n// Async read (preferred)\nfs.readFile('example.txt', 'utf8', (err, data) => {\n  if (err) { console.error('Error:', err); return; }\n  console.log('Content:', data);\n});\n\n// Async write\nfs.writeFile('output.txt', 'Hello World!', (err) => {\n  if (err) throw err;\n  console.log('File written!');\n});\n\n// Append to file\nfs.appendFile('log.txt', 'New entry\\n', (err) => {\n  if (err) throw err;\n});\n\n// List directory\nfs.readdir('./', (err, files) => {\n  console.log('Files:', files);\n});" } },
        { type: "heading", data: { level: 2, text: "The http Module" } },
        { type: "code", data: { language: "javascript", title: "Your First HTTP Server", code: "const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  if (req.method === 'GET' && req.url === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/plain' });\n    res.end('Hello from Node.js!');\n  } else {\n    res.writeHead(404, { 'Content-Type': 'text/plain' });\n    res.end('404 Not Found');\n  }\n});\n\nserver.listen(3000, () => {\n  console.log('Server running at http://localhost:3000');\n});" } },
        { type: "warning", data: { title: "Use Express in Practice", text: "The http module is too low-level for real applications. We use Express.js (built on top of it) for routing, middleware, and cleaner request handling — covered in Chapter 7." } },
        { type: "quiz", data: { question: "Which core module is used to read and write files?", options: ["http", "path", "fs", "os"], correctIndex: 2, explanation: "The fs (File System) module provides functions to interact with the file system — reading, writing, appending, and deleting files and directories." } },
      ],
    },
    {
      title: "path, os & events Modules",
      slug: "path-os-events-modules",
      order: 2,
      estimatedReadTime: 8,
      summary: "Use path for cross-platform file paths, os for system info, and events for custom event emitters.",
      content: [
        { type: "heading", data: { level: 2, text: "The path Module" } },
        { type: "code", data: { language: "javascript", title: "Path Utilities", code: "const path = require('path');\n\n// Join path segments (cross-platform)\nconsole.log(path.join('/users', 'john', 'file.txt'));\n// /users/john/file.txt\n\n// Get file extension\nconsole.log(path.extname('index.html'));   // .html\n\n// Get filename without extension\nconsole.log(path.basename('file.txt', '.txt'));  // file\n\n// Get directory name\nconsole.log(path.dirname('/users/john/file.txt'));  // /users/john\n\n// Resolve absolute path\nconsole.log(path.resolve('src', 'app.js'));  // /absolute/path/src/app.js" } },
        { type: "heading", data: { level: 2, text: "The os Module" } },
        { type: "code", data: { language: "javascript", title: "OS Information", code: "const os = require('os');\n\nconsole.log('Platform:', os.platform());      // linux, darwin, win32\nconsole.log('CPU cores:', os.cpus().length);  // 8\nconsole.log('Total RAM:', os.totalmem());     // bytes\nconsole.log('Free RAM:', os.freemem());       // bytes\nconsole.log('Home dir:', os.homedir());       // /home/user" } },
        { type: "heading", data: { level: 2, text: "The events Module — EventEmitter" } },
        { type: "code", data: { language: "javascript", title: "Custom Event Emitter", code: "const EventEmitter = require('events');\nconst emitter = new EventEmitter();\n\n// Register listener\nemitter.on('greet', (name) => {\n  console.log(`Hello, ${name}!`);\n});\n\n// One-time listener\nemitter.once('connect', () => {\n  console.log('Connected!');\n});\n\n// Emit events\nemitter.emit('greet', 'Alice');   // Hello, Alice!\nemitter.emit('connect');          // Connected!\nemitter.emit('connect');          // (nothing — once() fired already)" } },
        { type: "info", data: { title: "EventEmitter is Everywhere", text: "The http server, file streams, and almost every Node.js module extends EventEmitter. Understanding it is key to understanding Node.js architecture." } },
        { type: "keyPoints", data: { title: "Core Modules Summary", points: ["fs — file system: read, write, append, delete files and directories", "http — create HTTP servers without any framework", "path — cross-platform path manipulation (always use this, not string concatenation!)", "os — query system info: platform, CPUs, memory, home directory", "events — EventEmitter: the foundation of Node.js's event-driven architecture"] } },
        { type: "quiz", data: { question: "What does EventEmitter's .once() method do?", options: ["Registers a listener that fires every time", "Fires the event once immediately", "Registers a listener that fires only on the first occurrence, then removes itself", "Creates a persistent connection"], correctIndex: 2, explanation: ".once() registers a one-time listener. After the event fires for the first time, the listener is automatically removed — perfect for connection events." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — Asynchronous Programming
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Asynchronous Programming", 4, [
    {
      title: "Callbacks & The Callback Hell Problem",
      slug: "callbacks-callback-hell",
      order: 1,
      estimatedReadTime: 7,
      summary: "Understand how callbacks work and why deeply nested callbacks become unmanageable.",
      content: [
        { type: "heading", data: { level: 2, text: "Why Asynchronous Programming?" } },
        { type: "paragraph", data: { text: "JavaScript is single-threaded. Without async patterns, time-consuming operations (file I/O, DB queries, HTTP requests) would freeze the entire application. Async programming solves this." } },
        { type: "heading", data: { level: 2, text: "Callbacks" } },
        { type: "code", data: { language: "javascript", title: "Simple Callback Pattern", code: "const fs = require('fs');\n\nfs.readFile('data.txt', 'utf8', function(err, data) {\n  if (err) {\n    console.error('Error reading file:', err);\n    return;\n  }\n  console.log('File data:', data);\n});\n\nconsole.log('This runs immediately — not blocked!');" } },
        { type: "heading", data: { level: 2, text: "The Callback Hell Problem" } },
        { type: "code", data: { language: "javascript", title: "Deeply Nested Callbacks (Avoid This!)", code: "// This is 'Callback Hell' — hard to read, debug, and maintain\nfs.readFile('file1.txt', 'utf8', (err, data1) => {\n  if (err) return console.error(err);\n  fs.readFile('file2.txt', 'utf8', (err, data2) => {\n    if (err) return console.error(err);\n    fs.readFile('file3.txt', 'utf8', (err, data3) => {\n      if (err) return console.error(err);\n      fs.writeFile('output.txt', data1 + data2 + data3, (err) => {\n        if (err) return console.error(err);\n        console.log('Done! (finally...)');\n      });\n    });\n  });\n});" } },
        { type: "warning", data: { title: "Callback Hell Signs", text: "Heavy indentation, error handling repeated at each level, impossible to test individual steps, and code that reads outside-in instead of top-to-bottom. Promises and async/await solve this." } },
        { type: "quiz", data: { question: "What is the main problem with 'callback hell'?", options: ["Performance is poor", "Deeply nested callbacks are hard to read and maintain", "Callbacks don't handle errors", "Callbacks are deprecated in Node.js"], correctIndex: 1, explanation: "Callback hell refers to deeply nested callback functions that become difficult to read, debug, and maintain. The code indents further with each async operation." } },
      ],
    },
    {
      title: "Promises & Async/Await",
      slug: "promises-async-await",
      order: 2,
      estimatedReadTime: 10,
      summary: "Solve callback hell with Promises and write clean async code using the modern async/await syntax.",
      content: [
        { type: "heading", data: { level: 2, text: "Promises" } },
        { type: "info", data: { title: "Promise States", text: "A Promise has three states: pending (initial), fulfilled (resolved with a value), and rejected (failed with a reason). Use .then() for fulfilled and .catch() for rejected." } },
        { type: "code", data: { language: "javascript", title: "Promises — Chaining & Parallel", code: "const fs = require('fs').promises;\n\n// Sequential with chaining\nfs.readFile('data.txt', 'utf8')\n  .then(data => {\n    console.log('Data:', data);\n    return fs.readFile('data2.txt', 'utf8');\n  })\n  .then(data2 => console.log('Data2:', data2))\n  .catch(err => console.error('Error:', err));\n\n// Parallel execution (much faster)\nPromise.all([\n  fs.readFile('file1.txt', 'utf8'),\n  fs.readFile('file2.txt', 'utf8'),\n  fs.readFile('file3.txt', 'utf8'),\n]).then(([d1, d2, d3]) => {\n  console.log('All files read simultaneously!');\n});" } },
        { type: "heading", data: { level: 2, text: "Async/Await — The Modern Standard" } },
        { type: "code", data: { language: "javascript", title: "Async/Await — Clean & Readable", code: "const fs = require('fs').promises;\n\n// Sequential reads\nasync function readFiles() {\n  try {\n    const data1 = await fs.readFile('file1.txt', 'utf8');\n    const data2 = await fs.readFile('file2.txt', 'utf8');\n    console.log(data1, data2);\n  } catch (err) {\n    console.error('Error:', err);\n  }\n}\n\n// Parallel reads (faster — runs simultaneously)\nasync function readInParallel() {\n  const [d1, d2] = await Promise.all([\n    fs.readFile('file1.txt', 'utf8'),\n    fs.readFile('file2.txt', 'utf8'),\n  ]);\n  console.log(d1, d2);\n}\n\nreadFiles();" } },
        { type: "tip", data: { text: "Use sequential awaits only when each operation depends on the previous result. For independent operations, use Promise.all() — it runs them in parallel and can be significantly faster." } },
        { type: "keyPoints", data: { title: "Async Patterns Summary", points: ["Callbacks: original pattern, leads to callback hell for complex flows", "Promises: chainable, better error handling, enables Promise.all() for parallel ops", "Async/Await (ES2017): syntactic sugar over promises — reads like synchronous code", "Always use try/catch with async/await", "Prefer async/await in new Node.js code"] } },
        { type: "quiz", data: { question: "When should you use Promise.all() instead of sequential awaits?", options: ["When operations must run in order", "When operations are independent and can run simultaneously", "When you need error handling", "When operations take different amounts of time"], correctIndex: 1, explanation: "Promise.all() runs multiple promises in parallel. Use it when operations are independent. Sequential awaits (await a; await b) run one at a time, wasting time if they don't depend on each other." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Introduction to Express.js
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Introduction to Express.js", 5, [
    {
      title: "Express Basics & Your First Server",
      slug: "express-basics-first-server",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 8,
      summary: "Install Express, build your first web server, and understand the app object and routing basics.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Express.js?" } },
        { type: "paragraph", data: { text: "Express.js is a minimal, fast, and flexible Node.js web framework. It provides routing, middleware, and request/response utilities without obscuring Node.js features. It is the 'E' in the MEAN/MERN stack and the most popular Node.js framework with hundreds of millions of downloads per month." } },
        { type: "heading", data: { level: 2, text: "Installing Express" } },
        { type: "code", data: { language: "javascript", title: "Setup Express Project", code: "mkdir express-app\ncd express-app\nnpm init -y\nnpm install express\n\n// Optional but recommended\nnpm install -D nodemon" } },
        { type: "heading", data: { level: 2, text: "Your First Express Server" } },
        { type: "code", data: { language: "javascript", title: "index.js — Hello Express", code: "const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Route handlers\napp.get('/', (req, res) => {\n  res.send('Hello from Express!');\n});\n\napp.get('/about', (req, res) => {\n  res.json({ name: 'My App', version: '1.0.0' });\n});\n\n// 404 handler\napp.use((req, res) => {\n  res.status(404).json({ error: 'Route not found' });\n});\n\napp.listen(PORT, () => {\n  console.log(`Server running on http://localhost:${PORT}`);\n});" } },
        { type: "heading", data: { level: 2, text: "Request & Response Objects" } },
        { type: "code", data: { language: "javascript", title: "req and res — Key Properties", code: "app.get('/user/:id', (req, res) => {\n  // Request\n  console.log(req.params);   // { id: '123' } — route params\n  console.log(req.query);    // { page: '2' } — query string\n  console.log(req.body);     // POST/PUT body data\n  console.log(req.headers);  // HTTP headers\n  console.log(req.method);   // 'GET'\n  console.log(req.ip);       // client IP\n\n  // Response\n  res.status(200).json({ userId: req.params.id });\n  // OR: res.send('text response');\n  // OR: res.redirect('/new-path');\n  // OR: res.sendFile('/path/to/file.html');\n});" } },
        { type: "info", data: { title: "Parsing JSON Bodies", text: "To read req.body from POST/PUT requests, add app.use(express.json()) before your routes. Without it, req.body will be undefined." } },
        { type: "quiz", data: { question: "What middleware is needed to parse JSON request bodies in Express?", options: ["bodyParser.json()", "express.parse()", "express.json()", "json.parser()"], correctIndex: 2, explanation: "express.json() is built into Express 4.16+ and parses incoming JSON request bodies, making the data available on req.body." } },
      ],
    },
    {
      title: "Static Files, JSON Parsing & Template Engines",
      slug: "express-static-json-templates",
      order: 2,
      estimatedReadTime: 7,
      summary: "Serve static files, handle JSON bodies, and use EJS as a template engine.",
      content: [
        { type: "heading", data: { level: 2, text: "Serving Static Files" } },
        { type: "code", data: { language: "javascript", title: "Serve Static Files with express.static()", code: "// Serve all files from the 'public' folder\napp.use(express.static('public'));\n// GET /index.html → serves public/index.html\n// GET /styles.css → serves public/styles.css\n\n// Serve files under a virtual path prefix\napp.use('/assets', express.static('public'));\n// GET /assets/logo.png → serves public/logo.png" } },
        { type: "heading", data: { level: 2, text: "Handling JSON & URL-Encoded Bodies" } },
        { type: "code", data: { language: "javascript", title: "Parsing Request Bodies", code: "app.use(express.json());                        // Parse JSON\napp.use(express.urlencoded({ extended: true })); // Parse form data\n\napp.post('/users', (req, res) => {\n  const { name, email } = req.body;\n  if (!name || !email) {\n    return res.status(400).json({ error: 'Name and email required' });\n  }\n  res.status(201).json({ message: 'User created', name, email });\n});" } },
        { type: "heading", data: { level: 2, text: "Template Engines (EJS)" } },
        { type: "code", data: { language: "javascript", title: "Server-Side Rendering with EJS", code: "// npm install ejs\napp.set('view engine', 'ejs');\napp.set('views', './views');\n\n// Route renders views/home.ejs\napp.get('/home', (req, res) => {\n  res.render('home', {\n    title: 'My App',\n    user: { name: 'Alice' },\n  });\n});\n\n// views/home.ejs:\n// <h1><%= title %></h1>\n// <p>Welcome, <%= user.name %>!</p>" } },
        { type: "tip", data: { text: "For modern web development, you'll typically build REST APIs with Express (sending JSON) and a separate React/Vue frontend. Template engines like EJS are used for traditional server-rendered apps." } },
        { type: "quiz", data: { question: "What does res.status(201).json({...}) do?", options: ["Sends an HTML response with status 201", "Sends a JSON response with HTTP status 201 Created", "Redirects with status 201", "Caches the response"], correctIndex: 1, explanation: "res.status(201) sets the HTTP status code to 201 Created. .json({...}) serializes the object as JSON and sends it as the response body with Content-Type: application/json." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Routing & Middleware
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Routing & Middleware", 6, [
    {
      title: "Routing with Express Router",
      slug: "express-routing",
      order: 1,
      estimatedReadTime: 9,
      summary: "Define routes for all HTTP methods, use Express Router for modular code, and handle query strings.",
      content: [
        { type: "heading", data: { level: 2, text: "HTTP Methods & Route Parameters" } },
        { type: "code", data: { language: "javascript", title: "Routes for All HTTP Methods", code: "app.get('/products', (req, res) => res.json({ action: 'list all' }));\napp.post('/products', (req, res) => res.json({ action: 'create' }));\napp.put('/products/:id', (req, res) => res.json({ action: 'full update' }));\napp.patch('/products/:id', (req, res) => res.json({ action: 'partial update' }));\napp.delete('/products/:id', (req, res) => res.json({ action: 'delete' }));\n\n// Multiple route parameters\napp.get('/users/:userId/posts/:postId', (req, res) => {\n  const { userId, postId } = req.params;\n  res.json({ userId, postId });\n});" } },
        { type: "heading", data: { level: 2, text: "Express Router — Modular Routes" } },
        { type: "code", data: { language: "javascript", title: "routes/users.js", code: "const express = require('express');\nconst router = express.Router();\n\nrouter.get('/', (req, res) => res.json({ users: [] }));\nrouter.post('/', (req, res) => res.status(201).json({ message: 'User created' }));\nrouter.get('/:id', (req, res) => res.json({ userId: req.params.id }));\nrouter.delete('/:id', (req, res) => res.json({ message: 'User deleted' }));\n\nmodule.exports = router;" } },
        { type: "code", data: { language: "javascript", title: "app.js — Mount the Router", code: "const usersRouter = require('./routes/users');\n\n// Mount at /api/users — all routes in the router\n// are prefixed with /api/users\napp.use('/api/users', usersRouter);\n// GET /api/users     → router's GET /\n// GET /api/users/123 → router's GET /:id" } },
        { type: "heading", data: { level: 2, text: "Query String Parameters" } },
        { type: "code", data: { language: "javascript", title: "Reading Query Strings", code: "// GET /products?category=electronics&sort=price&page=2\napp.get('/products', (req, res) => {\n  const { category, sort, page = 1 } = req.query;\n  res.json({ category, sort, page: parseInt(page) });\n});" } },
        { type: "quiz", data: { question: "What is express.Router() used for?", options: ["Parsing request bodies", "Creating modular, mountable route handlers", "Handling static files", "Managing sessions"], correctIndex: 1, explanation: "express.Router() creates mini-applications (modular route handlers) that can be mounted on paths in your main app. This keeps your routing code organized." } },
      ],
    },
    {
      title: "Middleware In-Depth",
      slug: "express-middleware",
      order: 2,
      estimatedReadTime: 9,
      summary: "Master application, route-level, error-handling, and third-party middleware like morgan and cors.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Middleware?" } },
        { type: "paragraph", data: { text: "Middleware functions have access to req, res, and the next() function. They can execute code, modify req/res, end the request, or pass to the next middleware." } },
        { type: "code", data: { language: "javascript", title: "Custom Logging Middleware", code: "// Middleware must call next() or end the response\nfunction logger(req, res, next) {\n  console.log(`${req.method} ${req.url} — ${new Date().toISOString()}`);\n  next(); // CRITICAL: pass control to the next middleware\n}\n\napp.use(logger); // Apply to ALL routes globally" } },
        { type: "heading", data: { level: 2, text: "Types of Middleware" } },
        { type: "code", data: { language: "javascript", title: "Route-level Auth Middleware", code: "// Only runs for routes it is applied to\nfunction authCheck(req, res, next) {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ error: 'Unauthorized' });\n  }\n  next();\n}\n\n// Apply to specific route only\napp.get('/profile', authCheck, (req, res) => {\n  res.json({ message: 'Protected route — authenticated!' });\n});" } },
        { type: "code", data: { language: "javascript", title: "Error-handling Middleware (4 params — MUST be last)", code: "// Error handling middleware — ALWAYS has 4 parameters\napp.use((err, req, res, next) => {\n  console.error('Error:', err.message);\n  res.status(err.status || 500).json({\n    error: err.message || 'Internal Server Error',\n  });\n});" } },
        { type: "heading", data: { level: 2, text: "Third-party Middleware" } },
        { type: "code", data: { language: "javascript", title: "morgan, cors & helmet", code: "// npm install morgan cors helmet\nconst morgan = require('morgan');\nconst cors = require('cors');\nconst helmet = require('helmet');\n\napp.use(morgan('dev'));    // HTTP request logger\napp.use(cors());          // Allow cross-origin requests\napp.use(helmet());        // Security headers (XSS, HSTS, etc.)" } },
        { type: "keyPoints", data: { title: "Middleware Best Practices", points: ["Global middleware (logging, security, CORS) goes BEFORE routes", "Route-specific middleware (auth, validation) is applied per route", "Error-handling middleware (4 params) goes LAST — after all routes", "ALWAYS call next() unless you end the response", "cors() is required when your frontend and API are on different domains"] } },
        { type: "quiz", data: { question: "How many parameters does Express error-handling middleware have?", options: ["2 (req, res)", "3 (req, res, next)", "4 (err, req, res, next)", "1 (err)"], correctIndex: 2, explanation: "Error-handling middleware MUST have exactly 4 parameters: (err, req, res, next). Express recognizes it as error-handling middleware based on this signature." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — REST API Development
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("REST API Development", 7, [
    {
      title: "REST Principles & API Design",
      slug: "rest-principles-api-design",
      order: 1,
      estimatedReadTime: 8,
      summary: "Understand REST architecture, HTTP methods, status codes, and URL design conventions.",
      content: [
        { type: "heading", data: { level: 2, text: "What is a REST API?" } },
        { type: "paragraph", data: { text: "REST (Representational State Transfer) is an architectural style for networked applications. A REST API uses HTTP to perform CRUD operations on resources — following predictable URL patterns and HTTP verbs." } },
        { type: "heading", data: { level: 2, text: "REST Design Conventions" } },
        { type: "table", data: { headers: ["Method", "URL", "Action", "Status Code"], rows: [["GET", "/api/users", "Get all users", "200 OK"], ["GET", "/api/users/:id", "Get user by ID", "200 / 404"], ["POST", "/api/users", "Create new user", "201 Created"], ["PUT", "/api/users/:id", "Update user (all fields)", "200 / 404"], ["PATCH", "/api/users/:id", "Update user (partial)", "200 / 404"], ["DELETE", "/api/users/:id", "Delete user", "200 / 204"]] } },
        { type: "heading", data: { level: 2, text: "HTTP Status Codes You Must Know" } },
        { type: "list", data: { style: "bullet", items: ["200 OK — successful GET, PUT, PATCH", "201 Created — successful POST", "204 No Content — successful DELETE (no body)", "400 Bad Request — invalid input or missing fields", "401 Unauthorized — authentication required", "403 Forbidden — authenticated but not authorized", "404 Not Found — resource does not exist", "500 Internal Server Error — server-side error"] } },
        { type: "heading", data: { level: 2, text: "REST Principles" } },
        { type: "list", data: { style: "bullet", items: ["Stateless: each request contains all information needed — server stores no client session", "Uniform Interface: consistent URLs and HTTP methods", "Resource-Based: everything is a resource (users, products, orders) at a URL", "JSON: the most common data format"] } },
        { type: "quiz", data: { question: "What HTTP status code indicates a resource was successfully CREATED?", options: ["200", "204", "201", "301"], correctIndex: 2, explanation: "201 Created is the correct status code for a successful POST that creates a new resource. 200 OK is for successful GETs, PUTs, and PATCHes." } },
      ],
    },
    {
      title: "Building a Complete REST API",
      slug: "building-complete-rest-api",
      order: 2,
      estimatedReadTime: 12,
      summary: "Build a full CRUD REST API with proper status codes, error handling, and API versioning.",
      content: [
        { type: "heading", data: { level: 2, text: "Complete Users CRUD API" } },
        { type: "code", data: { language: "javascript", title: "Full Users REST API", code: "const express = require('express');\nconst app = express();\napp.use(express.json());\n\nlet users = [\n  { id: 1, name: 'Alice', email: 'alice@example.com' },\n  { id: 2, name: 'Bob',   email: 'bob@example.com' },\n];\nlet nextId = 3;\n\n// GET all\napp.get('/api/users', (req, res) => {\n  res.json({ success: true, count: users.length, data: users });\n});\n\n// GET one\napp.get('/api/users/:id', (req, res) => {\n  const user = users.find(u => u.id === parseInt(req.params.id));\n  if (!user) return res.status(404).json({ error: 'User not found' });\n  res.json({ success: true, data: user });\n});\n\n// POST create\napp.post('/api/users', (req, res) => {\n  const { name, email } = req.body;\n  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });\n  const user = { id: nextId++, name, email };\n  users.push(user);\n  res.status(201).json({ success: true, data: user });\n});\n\n// PUT update\napp.put('/api/users/:id', (req, res) => {\n  const index = users.findIndex(u => u.id === parseInt(req.params.id));\n  if (index === -1) return res.status(404).json({ error: 'User not found' });\n  users[index] = { ...users[index], ...req.body, id: users[index].id };\n  res.json({ success: true, data: users[index] });\n});\n\n// DELETE\napp.delete('/api/users/:id', (req, res) => {\n  const index = users.findIndex(u => u.id === parseInt(req.params.id));\n  if (index === -1) return res.status(404).json({ error: 'User not found' });\n  users.splice(index, 1);\n  res.json({ success: true, message: 'User deleted' });\n});\n\napp.listen(3000, () => console.log('API running on port 3000'));" } },
        { type: "heading", data: { level: 2, text: "API Versioning" } },
        { type: "code", data: { language: "javascript", title: "Version Your API URLs", code: "// Version in URL path — most common approach\napp.use('/api/v1/users', usersV1Router);\napp.use('/api/v2/users', usersV2Router);\n\n// Clients using v1 are unaffected when v2 is released" } },
        { type: "tip", data: { text: "PUT replaces the ENTIRE resource. PATCH updates only the specified fields. Always validate required fields on POST and return 400 with a helpful error message if they are missing." } },
        { type: "quiz", data: { question: "What is the difference between PUT and PATCH?", options: ["PUT creates, PATCH updates", "PUT replaces the full resource; PATCH updates only specified fields", "They are identical", "PATCH is deprecated"], correctIndex: 1, explanation: "PUT replaces the entire resource with the new data — any fields not sent are removed. PATCH only updates the specified fields, leaving others unchanged. PATCH is more efficient for partial updates." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Error Handling
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Error Handling", 8, [
    {
      title: "Handling Errors in Express",
      slug: "error-handling-express",
      order: 1,
      estimatedReadTime: 9,
      summary: "Handle sync and async errors, create custom AppError classes, and catch process-level failures.",
      content: [
        { type: "heading", data: { level: 2, text: "Why Error Handling Matters" } },
        { type: "paragraph", data: { text: "Unhandled errors crash your Node.js process. Good error handling prevents crashes, provides meaningful responses to clients, and helps you debug issues in production." } },
        { type: "heading", data: { level: 2, text: "Synchronous Errors" } },
        { type: "code", data: { language: "javascript", title: "Sync Error → next(err)", code: "app.get('/divide', (req, res, next) => {\n  try {\n    const { a, b } = req.query;\n    if (b == 0) throw new Error('Division by zero');\n    res.json({ result: a / b });\n  } catch (err) {\n    next(err); // Pass to error-handling middleware\n  }\n});" } },
        { type: "heading", data: { level: 2, text: "Async Errors — asyncHandler Pattern" } },
        { type: "code", data: { language: "javascript", title: "asyncHandler Wrapper (eliminates try/catch boilerplate)", code: "// Define once, reuse everywhere\nconst asyncHandler = fn => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\n// Routes are much cleaner!\napp.get('/users/:id', asyncHandler(async (req, res) => {\n  const user = await User.findById(req.params.id);\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json(user);\n}));" } },
        { type: "heading", data: { level: 2, text: "Custom AppError Class" } },
        { type: "code", data: { language: "javascript", title: "AppError + Global Error Handler", code: "// AppError class\nclass AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';\n    Error.captureStackTrace(this, this.constructor);\n  }\n}\n\n// Global error handling middleware (app.js — LAST middleware)\napp.use((err, req, res, next) => {\n  const { statusCode = 500, message = 'Internal Server Error' } = err;\n  res.status(statusCode).json({\n    status: err.status || 'error',\n    // Hide details in production\n    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,\n  });\n});\n\n// Usage: throw new AppError('User not found', 404);" } },
        { type: "heading", data: { level: 2, text: "Process-level Error Handlers" } },
        { type: "code", data: { language: "javascript", title: "Catch Anything That Slips Through", code: "// Unhandled promise rejections\nprocess.on('unhandledRejection', (err) => {\n  console.error('Unhandled Rejection:', err);\n  process.exit(1); // Graceful shutdown\n});\n\n// Uncaught synchronous exceptions\nprocess.on('uncaughtException', (err) => {\n  console.error('Uncaught Exception:', err);\n  process.exit(1);\n});" } },
        { type: "keyPoints", data: { title: "Error Handling Checklist", points: ["Always pass errors to next(err) — never swallow them silently", "Use asyncHandler wrapper to eliminate repetitive try/catch", "Create a custom AppError class with statusCode for structured errors", "Global error middleware has 4 params and must be defined LAST", "Hide detailed errors in production — log them server-side only", "Always add process.on handlers to catch anything that escapes"] } },
        { type: "quiz", data: { question: "How do you pass an error to Express's error-handling middleware?", options: ["throw error", "return error", "next(error)", "res.error(error)"], correctIndex: 2, explanation: "Calling next(err) with an error argument tells Express to skip remaining route handlers and jump directly to the nearest error-handling middleware (the one with 4 params)." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Authentication with JWT
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Authentication with JWT", 9, [
    {
      title: "JWT Fundamentals & Password Hashing",
      slug: "jwt-fundamentals-bcrypt",
      order: 1,
      estimatedReadTime: 9,
      summary: "Understand JWT structure, hash passwords with bcrypt, and implement user registration.",
      content: [
        { type: "heading", data: { level: 2, text: "What is JWT?" } },
        { type: "info", data: { title: "JWT Structure: Header.Payload.Signature", text: "A JWT has three base64-encoded parts separated by dots. Header: algorithm (HS256) and type (JWT). Payload: claims (userId, role, expiry). Signature: HMAC-SHA256 of header + payload + secret — prevents tampering." } },
        { type: "heading", data: { level: 2, text: "Hashing Passwords with bcrypt" } },
        { type: "code", data: { language: "javascript", title: "User Registration with bcrypt", code: "// npm install bcryptjs jsonwebtoken\nconst bcrypt = require('bcryptjs');\n\napp.post('/api/auth/register', async (req, res, next) => {\n  try {\n    const { name, email, password } = req.body;\n\n    // Check if email already exists\n    const existingUser = await User.findOne({ email });\n    if (existingUser) {\n      return res.status(400).json({ error: 'Email already registered' });\n    }\n\n    // Hash password (10 = salt rounds — higher = slower but more secure)\n    const hashedPassword = await bcrypt.hash(password, 10);\n\n    const user = await User.create({ name, email, password: hashedPassword });\n    res.status(201).json({ message: 'User registered', userId: user._id });\n  } catch (err) {\n    next(err);\n  }\n});" } },
        { type: "warning", data: { title: "Never Store Plain-text Passwords", text: "If your database is breached, plain-text passwords expose all users immediately. bcrypt hashes are computationally infeasible to reverse. Always hash with at least 10 salt rounds." } },
        { type: "quiz", data: { question: "What does bcrypt.hash(password, 10) do?", options: ["Encrypts the password with AES-256", "Hashes the password using bcrypt with 10 salt rounds", "Generates a JWT token", "Compares two passwords"], correctIndex: 1, explanation: "bcrypt.hash() creates a one-way hash of the password. The second argument (10) is the number of salt rounds — more rounds = more secure but slower. 10-12 is typical for production." } },
      ],
    },
    {
      title: "JWT Login, Auth Middleware & Role-Based Access",
      slug: "jwt-login-auth-middleware",
      order: 2,
      estimatedReadTime: 11,
      summary: "Implement login with JWT generation, protect routes with auth middleware, and add role-based authorization.",
      content: [
        { type: "heading", data: { level: 2, text: "Login & JWT Generation" } },
        { type: "code", data: { language: "javascript", title: "Login Route — Generate JWT", code: "const jwt = require('jsonwebtoken');\n\napp.post('/api/auth/login', async (req, res, next) => {\n  try {\n    const { email, password } = req.body;\n    const user = await User.findOne({ email });\n\n    // Consistent error for security (don't reveal if email exists)\n    if (!user) return res.status(401).json({ error: 'Invalid credentials' });\n\n    const isMatch = await bcrypt.compare(password, user.password);\n    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });\n\n    // Sign token — expires in 7 days\n    const token = jwt.sign(\n      { userId: user._id, role: user.role },\n      process.env.JWT_SECRET,\n      { expiresIn: '7d' }\n    );\n\n    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });\n  } catch (err) { next(err); }\n});" } },
        { type: "heading", data: { level: 2, text: "Auth Middleware — Protecting Routes" } },
        { type: "code", data: { language: "javascript", title: "JWT Verification Middleware", code: "const protect = async (req, res, next) => {\n  try {\n    let token = req.headers.authorization;\n    if (!token || !token.startsWith('Bearer ')) {\n      return res.status(401).json({ error: 'No token provided' });\n    }\n    token = token.split(' ')[1]; // Extract after 'Bearer '\n\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = await User.findById(decoded.userId).select('-password');\n    next();\n  } catch (err) {\n    res.status(401).json({ error: 'Token invalid or expired' });\n  }\n};\n\n// Protect a route:\napp.get('/api/profile', protect, (req, res) => {\n  res.json({ user: req.user }); // req.user set by middleware\n});" } },
        { type: "heading", data: { level: 2, text: "Role-Based Authorization" } },
        { type: "code", data: { language: "javascript", title: "Restrict Routes to Specific Roles", code: "const authorize = (...roles) => (req, res, next) => {\n  if (!roles.includes(req.user.role)) {\n    return res.status(403).json({ error: 'Access denied: insufficient permissions' });\n  }\n  next();\n};\n\n// Admin-only: requires both authentication AND admin role\napp.delete('/api/users/:id', protect, authorize('admin'), async (req, res) => {\n  await User.findByIdAndDelete(req.params.id);\n  res.json({ message: 'User deleted' });\n});" } },
        { type: "keyPoints", data: { title: "JWT Auth Best Practices", points: ["Store JWT_SECRET in environment variables — never in source code", "Use short expiry times (15min–7d) and implement refresh token rotation for sensitive apps", "Send token in Authorization header: 'Bearer <token>'", "Use bcrypt with 10+ salt rounds for password hashing", "Authentication = who you are (JWT). Authorization = what you can do (roles).", "Always return 401 for missing/invalid tokens, 403 for valid token but insufficient permissions"] } },
        { type: "quiz", data: { question: "What HTTP status should you return when a valid user lacks permission?", options: ["401", "400", "403", "404"], correctIndex: 2, explanation: "401 Unauthorized means not authenticated (no/invalid token). 403 Forbidden means authenticated but not authorized — the user is valid but lacks permission for this resource." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 10 — MVC Architecture
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("MVC Architecture", 10, [
    {
      title: "MVC Pattern & Folder Structure",
      slug: "mvc-pattern-folder-structure",
      order: 1,
      estimatedReadTime: 8,
      summary: "Understand Model-View-Controller, why it matters, and how to organize a Node.js project.",
      content: [
        { type: "heading", data: { level: 2, text: "What is MVC?" } },
        { type: "paragraph", data: { text: "MVC (Model-View-Controller) separates an application into three components. Model: data and business logic. View: presentation (JSON responses in REST APIs). Controller: handles requests, calls the model, and returns responses. This separation makes code maintainable, testable, and scalable." } },
        { type: "heading", data: { level: 2, text: "Recommended Folder Structure" } },
        { type: "code", data: { language: "javascript", title: "Express MVC Project Structure", code: "project/\n├── controllers/\n│   ├── authController.js    # Auth logic (register, login)\n│   └── userController.js   # User CRUD logic\n├── models/\n│   └── User.js             # Mongoose schema + model\n├── routes/\n│   ├── authRoutes.js       # POST /auth/register, /auth/login\n│   └── userRoutes.js       # GET/POST/PUT/DELETE /users\n├── middleware/\n│   ├── auth.js             # JWT protect + authorize\n│   └── errorHandler.js    # Global error middleware\n├── config/\n│   └── db.js              # MongoDB connection\n├── .env                   # Environment variables\n├── app.js                 # Express app setup\n└── server.js             # Start server (listen)" } },
        { type: "heading", data: { level: 2, text: "app.js vs server.js" } },
        { type: "code", data: { language: "javascript", title: "Separate App Config from Server Start", code: "// app.js — Express configuration only (importable for tests)\nconst express = require('express');\nconst app = express();\napp.use(express.json());\napp.use('/api/users', require('./routes/userRoutes'));\napp.use('/api/auth', require('./routes/authRoutes'));\napp.use(require('./middleware/errorHandler'));\nmodule.exports = app;\n\n// server.js — Only starts the server\nconst app = require('./app');\nconst connectDB = require('./config/db');\nconnectDB();\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log(`Server on port ${PORT}`));" } },
        { type: "info", data: { title: "Why Separate app.js and server.js?", text: "Tests can import app.js and run it without binding to a port. This is essential for unit testing and integration testing with supertest." } },
        { type: "quiz", data: { question: "In a REST API with Express, what does the 'View' in MVC represent?", options: ["HTML templates rendered by EJS", "The JSON response sent to the client", "Static files served by express.static()", "The database query results"], correctIndex: 1, explanation: "In a REST API, there's no HTML rendering. The 'View' is the JSON response (res.json()) that controllers send to API clients." } },
      ],
    },
    {
      title: "Models, Controllers & Routes",
      slug: "mvc-models-controllers-routes",
      order: 2,
      estimatedReadTime: 10,
      summary: "Build complete models, controllers, and routes following the MVC pattern with proper separation of concerns.",
      content: [
        { type: "heading", data: { level: 2, text: "Model — Mongoose Schema" } },
        { type: "code", data: { language: "javascript", title: "models/User.js", code: "const mongoose = require('mongoose');\n\nconst userSchema = new mongoose.Schema({\n  name:     { type: String, required: true, trim: true },\n  email:    { type: String, required: true, unique: true, lowercase: true },\n  password: { type: String, required: true, minlength: 6 },\n  role:     { type: String, enum: ['user', 'admin'], default: 'user' },\n  createdAt: { type: Date, default: Date.now },\n});\n\nmodule.exports = mongoose.model('User', userSchema);" } },
        { type: "heading", data: { level: 2, text: "Controller — Business Logic" } },
        { type: "code", data: { language: "javascript", title: "controllers/userController.js", code: "const User = require('../models/User');\n\nexports.getAllUsers = async (req, res, next) => {\n  try {\n    const users = await User.find().select('-password');\n    res.json({ success: true, count: users.length, data: users });\n  } catch (err) { next(err); }\n};\n\nexports.getUserById = async (req, res, next) => {\n  try {\n    const user = await User.findById(req.params.id).select('-password');\n    if (!user) return res.status(404).json({ error: 'User not found' });\n    res.json({ success: true, data: user });\n  } catch (err) { next(err); }\n};" } },
        { type: "heading", data: { level: 2, text: "Routes — Connect URLs to Controllers" } },
        { type: "code", data: { language: "javascript", title: "routes/userRoutes.js", code: "const router = require('express').Router();\nconst { getAllUsers, getUserById } = require('../controllers/userController');\nconst { protect, authorize } = require('../middleware/auth');\n\nrouter.get('/',    protect, authorize('admin'), getAllUsers);\nrouter.get('/:id', protect, getUserById);\n\nmodule.exports = router;" } },
        { type: "keyPoints", data: { title: "MVC Benefits", points: ["Clear separation: Models handle data, Controllers handle requests, Routes handle URL mapping", "Testable: each layer can be tested in isolation", "Scalable: multiple developers work on different layers without conflicts", "Maintainable: find and fix bugs in one layer without touching others", "Reusable: controllers can be used by multiple routes"] } },
        { type: "quiz", data: { question: "Why is it good practice to separate app.js and server.js?", options: ["It speeds up the application", "Tests can import app.js without starting the server", "Express requires it", "It enables hot-reloading"], correctIndex: 1, explanation: "Separating configuration (app.js) from server start (server.js) allows test frameworks to import app.js and run tests without binding to a port, enabling proper unit and integration testing." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — Connecting to MongoDB
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Connecting to MongoDB with Mongoose", 11, [
    {
      title: "MongoDB Setup & Mongoose Connection",
      slug: "mongodb-mongoose-setup",
      order: 1,
      estimatedReadTime: 8,
      summary: "Connect to MongoDB Atlas, configure Mongoose, and understand schemas vs models.",
      content: [
        { type: "heading", data: { level: 2, text: "Why MongoDB with Node.js?" } },
        { type: "paragraph", data: { text: "MongoDB stores data in JSON-like format (BSON), making it a natural fit for JavaScript applications. Mongoose provides a structured ODM (Object Data Modeling) layer on top of MongoDB's driver." } },
        { type: "heading", data: { level: 2, text: "Connecting to MongoDB" } },
        { type: "code", data: { language: "javascript", title: "config/db.js — Connection Setup", code: "// npm install mongoose\nconst mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI);\n    console.log(`MongoDB connected: ${conn.connection.host}`);\n  } catch (err) {\n    console.error('MongoDB connection error:', err.message);\n    process.exit(1); // Exit process on failure\n  }\n};\n\nmodule.exports = connectDB;\n\n// In server.js:\n// require('./config/db')();" } },
        { type: "heading", data: { level: 2, text: "Defining Schemas & Models" } },
        { type: "code", data: { language: "javascript", title: "models/Product.js — Schema with Validation", code: "const mongoose = require('mongoose');\n\nconst productSchema = new mongoose.Schema({\n  name:     { type: String, required: [true, 'Product name is required'], trim: true },\n  price:    { type: Number, required: true, min: 0 },\n  category: { type: String, enum: ['electronics', 'clothing', 'food'] },\n  inStock:  { type: Boolean, default: true },\n  tags:     [String],\n  createdAt: { type: Date, default: Date.now },\n});\n\n// Model compiles schema into a database interface\nmodule.exports = mongoose.model('Product', productSchema);" } },
        { type: "info", data: { title: "Schema vs Model", text: "A Schema defines structure, field types, validation rules, and defaults. A Model is the compiled version — it provides the interface (find, create, update, delete) for the database collection." } },
        { type: "quiz", data: { question: "What does ODM stand for?", options: ["Object Document Mapper", "Object Data Modeling", "Object Database Manager", "Online Data Model"], correctIndex: 1, explanation: "ODM stands for Object Data Modeling. Mongoose is an ODM — it maps JavaScript objects to MongoDB documents and provides an abstraction for schema definition, validation, and queries." } },
      ],
    },
    {
      title: "CRUD Operations with Mongoose",
      slug: "mongoose-crud-operations",
      order: 2,
      estimatedReadTime: 10,
      summary: "Perform Create, Read, Update, Delete operations using Mongoose methods with filtering and pagination.",
      content: [
        { type: "heading", data: { level: 2, text: "Full CRUD with Mongoose" } },
        { type: "code", data: { language: "javascript", title: "Mongoose CRUD Operations", code: "const Product = require('./models/Product');\n\n// CREATE\nconst product = await Product.create({\n  name: 'Laptop', price: 999, category: 'electronics'\n});\n\n// READ ALL — with filtering, sorting, pagination\nconst products = await Product\n  .find({ inStock: true, price: { $lte: 1000 } })\n  .sort({ price: -1 })   // sort descending\n  .limit(10)             // max 10 results\n  .skip(0);              // offset (for pagination)\n\n// READ ONE\nconst product = await Product.findById(id);\nconst product2 = await Product.findOne({ name: 'Laptop' });\n\n// UPDATE — { new: true } returns the UPDATED document\nconst updated = await Product.findByIdAndUpdate(\n  id,\n  { price: 899, inStock: false },\n  { new: true, runValidators: true }\n);\n\n// DELETE\nawait Product.findByIdAndDelete(id);" } },
        { type: "heading", data: { level: 2, text: "Query Operators & Projection" } },
        { type: "code", data: { language: "javascript", title: "Filtering & Selecting Fields", code: "// Query operators\nProduct.find({ price: { $gte: 100, $lte: 500 } }); // 100 ≤ price ≤ 500\nProduct.find({ name: { $regex: 'laptop', $options: 'i' } }); // case-insensitive\nProduct.find({ tags: { $in: ['sale', 'new'] } }); // array contains\n\n// Projection — exclude sensitive fields\nUser.find().select('-password -__v');\n// OR include specific fields only:\nUser.find().select('name email role');" } },
        { type: "tip", data: { text: "Always store MONGO_URI in a .env file. Never hardcode database connection strings in source code. Use MongoDB Atlas for cloud-hosted MongoDB in production." } },
        { type: "keyPoints", data: { title: "Mongoose CRUD Essentials", points: ["Model.create({}) — insert one document", "Model.find({}) — query documents with optional filters", "Model.findById(id) — fetch by MongoDB _id", "Model.findByIdAndUpdate(id, data, { new: true }) — update and return updated doc", "Model.findByIdAndDelete(id) — remove document", "Always use { new: true, runValidators: true } in update operations"] } },
        { type: "quiz", data: { question: "What does { new: true } do in findByIdAndUpdate()?", options: ["Creates a new document if not found", "Returns the updated document instead of the original", "Adds new fields to the schema", "Validates only new data"], correctIndex: 1, explanation: "By default, findByIdAndUpdate() returns the ORIGINAL document before updates. Passing { new: true } makes it return the updated document instead." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 12 — Environment Variables & Configuration
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Environment Variables & Configuration", 12, [
    {
      title: "Managing Environment Variables with dotenv",
      slug: "environment-variables-dotenv",
      order: 1,
      estimatedReadTime: 6,
      summary: "Use dotenv to manage sensitive configuration, create .env.example, and validate required variables.",
      content: [
        { type: "heading", data: { level: 2, text: "Why Environment Variables?" } },
        { type: "paragraph", data: { text: "Environment variables separate configuration from code. The same codebase runs in development, staging, and production with different database URLs, API keys, and ports — without modifying source code." } },
        { type: "heading", data: { level: 2, text: "Setup with dotenv" } },
        { type: "code", data: { language: "javascript", title: ".env file + dotenv config", code: "# .env (NEVER commit this to git!)\nNODE_ENV=development\nPORT=3000\nMONGO_URI=mongodb://localhost:27017/myapp\nJWT_SECRET=your_super_secret_key_minimum_32_chars\nJWT_EXPIRES_IN=7d\n\n# server.js — load env vars FIRST\nrequire('dotenv').config();\n\nconst port = process.env.PORT || 3000;\nconst mongoUri = process.env.MONGO_URI;" } },
        { type: "heading", data: { level: 2, text: "Validating Required Variables at Startup" } },
        { type: "code", data: { language: "javascript", title: "Fail Fast — Check Required Vars", code: "// config/validateEnv.js\nconst required = ['MONGO_URI', 'JWT_SECRET', 'PORT'];\n\nrequired.forEach(key => {\n  if (!process.env[key]) {\n    throw new Error(`Missing required environment variable: ${key}`);\n  }\n});\n\n// server.js:\nrequire('dotenv').config();\nrequire('./config/validateEnv'); // Throws if vars missing\n// ... rest of app startup" } },
        { type: "heading", data: { level: 2, text: ".env.example — For Your Team" } },
        { type: "code", data: { language: "javascript", title: ".env.example (commit this!)", code: "# .env.example — copy to .env and fill in values\nNODE_ENV=development\nPORT=3000\nMONGO_URI=mongodb://localhost:27017/your_db_name\nJWT_SECRET=replace_with_random_32_char_string\nJWT_EXPIRES_IN=7d" } },
        { type: "list", data: { style: "bullet", items: ["Add .env to .gitignore — NEVER commit secrets", "Commit .env.example with placeholder values — documents required variables", "Use strong randomly-generated secrets for JWT_SECRET", "Different .env files per environment: .env.test, .env.production", "Call require('dotenv').config() once at the very top of server.js"] } },
        { type: "quiz", data: { question: "How do you access the PORT environment variable in Node.js?", options: ["env.PORT", "process.env.PORT", "global.PORT", "config.PORT"], correctIndex: 1, explanation: "All environment variables are accessible via process.env. The process object is global in Node.js, so process.env.PORT reads the PORT variable from the environment." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Request & Response Handling
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Request & Response Handling", 13, [
    {
      title: "File Uploads & Request Validation",
      slug: "file-uploads-validation",
      order: 1,
      estimatedReadTime: 9,
      summary: "Handle file uploads with multer and validate request data with express-validator.",
      content: [
        { type: "heading", data: { level: 2, text: "Reading All Types of Request Data" } },
        { type: "code", data: { language: "javascript", title: "All Request Data Sources", code: "app.post('/api/data/:id', (req, res) => {\n  const id = req.params.id;              // URL: /api/data/123\n  const { page = 1, limit = 10 } = req.query; // ?page=2&limit=10\n  const { name, email } = req.body;      // JSON body\n  const token = req.headers.authorization; // Headers\n  const sessionId = req.cookies?.sessionId; // Cookies\n  res.json({ id, page, name });\n});" } },
        { type: "heading", data: { level: 2, text: "File Uploads with Multer" } },
        { type: "code", data: { language: "javascript", title: "Single & Multiple File Uploads", code: "// npm install multer\nconst multer = require('multer');\n\n// Store files in 'uploads/' folder\nconst upload = multer({\n  dest: 'uploads/',\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max\n  fileFilter: (req, file, cb) => {\n    const allowed = ['image/jpeg', 'image/png', 'image/webp'];\n    cb(null, allowed.includes(file.mimetype));\n  },\n});\n\n// Single file upload\napp.post('/upload/photo', upload.single('photo'), (req, res) => {\n  res.json({ filename: req.file.filename, size: req.file.size });\n});\n\n// Multiple files\napp.post('/upload/gallery', upload.array('photos', 5), (req, res) => {\n  res.json({ count: req.files.length });\n});" } },
        { type: "heading", data: { level: 2, text: "Request Validation with express-validator" } },
        { type: "code", data: { language: "javascript", title: "Validate Request Body", code: "// npm install express-validator\nconst { body, validationResult } = require('express-validator');\n\napp.post('/api/register',\n  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),\n  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),\n  body('name').isLength({ min: 2, max: 50 }).withMessage('Name 2-50 chars'),\n  (req, res) => {\n    const errors = validationResult(req);\n    if (!errors.isEmpty()) {\n      return res.status(400).json({ errors: errors.array() });\n    }\n    // req.body is now validated and sanitized\n    res.status(201).json({ message: 'Registered successfully' });\n  }\n);" } },
        { type: "keyPoints", data: { title: "Request Handling Best Practices", points: ["Validate and sanitize ALL user input before processing", "Use express-validator for structured validation with error messages", "Limit file upload size and type to prevent abuse", "Use req.query for search/filter params, req.params for resource IDs, req.body for data", "Always respond with specific error messages for 400 Bad Request"] } },
        { type: "quiz", data: { question: "What npm package is commonly used for file uploads in Express?", options: ["formidable", "busboy", "multer", "filestream"], correctIndex: 2, explanation: "Multer is the standard Express middleware for handling multipart/form-data, which is the encoding type used for file uploads. It processes uploaded files and makes them available on req.file / req.files." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 14 — Deployment Basics
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Deployment Basics", 14, [
    {
      title: "Deploying to Cloud Platforms",
      slug: "deploying-to-cloud",
      order: 1,
      estimatedReadTime: 8,
      summary: "Deploy your Node.js app to Heroku or Render, manage environment variables, and set up CI/CD.",
      content: [
        { type: "heading", data: { level: 2, text: "Preparing for Production" } },
        { type: "list", data: { style: "bullet", items: ["Set NODE_ENV=production in environment", "Remove all console.log() or use a logger (winston, pino)", "Ensure all env variables are configured on the hosting platform", "Test with npm start (not npm run dev)", "Add security headers with helmet", "Enable rate limiting with express-rate-limit"] } },
        { type: "heading", data: { level: 2, text: "Deploying to Heroku" } },
        { type: "code", data: { language: "javascript", title: "Heroku Deployment Steps", code: "# Install Heroku CLI, then:\nheroku login\nheroku create my-app-name\n\n# Set environment variables\nheroku config:set MONGO_URI=mongodb+srv://...\nheroku config:set JWT_SECRET=your_secret\nheroku config:set NODE_ENV=production\n\n# Deploy\ngit push heroku main\n\n# View logs\nheroku logs --tail" } },
        { type: "heading", data: { level: 2, text: "Deploying to Render (Free Tier)" } },
        { type: "list", data: { style: "ordered", items: ["Connect your GitHub repository on render.com", "Set environment variables in the dashboard", "Set Build Command: npm install", "Set Start Command: node server.js", "Deploy automatically on every git push to main"] } },
        { type: "heading", data: { level: 2, text: "Security Checklist Before Deployment" } },
        { type: "code", data: { language: "javascript", title: "Production Security Setup", code: "// npm install helmet cors express-rate-limit compression\nconst helmet = require('helmet');\nconst rateLimit = require('express-rate-limit');\nconst compression = require('compression');\n\napp.use(helmet());       // Security headers\napp.use(compression());  // gzip responses\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 minutes\n  max: 100,                  // Max 100 requests per window\n  message: 'Too many requests, please try again later',\n});\napp.use('/api/', limiter);" } },
        { type: "quiz", data: { question: "What should NODE_ENV be set to in production?", options: ["development", "staging", "production", "live"], correctIndex: 2, explanation: "Setting NODE_ENV=production enables Express optimizations (caching, less verbose errors), tells libraries to use production modes, and is the industry standard." } },
      ],
    },
    {
      title: "PM2 & Docker for Production",
      slug: "pm2-docker-production",
      order: 2,
      estimatedReadTime: 9,
      summary: "Keep your app running with PM2, containerize with Docker, and set up process monitoring.",
      content: [
        { type: "heading", data: { level: 2, text: "PM2 — Process Manager" } },
        { type: "paragraph", data: { text: "PM2 keeps your Node.js application running in production, automatically restarts it on crashes, and restarts on server reboot." } },
        { type: "code", data: { language: "javascript", title: "PM2 Essential Commands", code: "# Install globally\nnpm install -g pm2\n\n# Start app\npm2 start server.js --name my-app\n\n# Start with multiple CPU cores (cluster mode)\npm2 start server.js -i max --name my-app\n\n# Auto-start on server reboot\npm2 startup\npm2 save\n\n# View logs\npm2 logs\npm2 monit  # Real-time monitoring\n\n# pm2 ecosystem.config.js\nmodule.exports = {\n  apps: [{\n    name: 'my-app',\n    script: 'server.js',\n    env_production: {\n      NODE_ENV: 'production',\n      PORT: 8080,\n    },\n  }],\n};" } },
        { type: "heading", data: { level: 2, text: "Docker — Containerization" } },
        { type: "code", data: { language: "javascript", title: "Dockerfile for Node.js App", code: "# Dockerfile\nFROM node:18-alpine\n\nWORKDIR /app\n\n# Copy package files first (for Docker cache)\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Copy source code\nCOPY . .\n\nEXPOSE 3000\n\nCMD [\"node\", \"server.js\"]\n\n# Build and run:\n# docker build -t my-app .\n# docker run -p 3000:3000 --env-file .env my-app" } },
        { type: "code", data: { language: "javascript", title: ".dockerignore", code: "node_modules\n.env\n*.log\n.git\nREADME.md" } },
        { type: "keyPoints", data: { title: "Production Deployment Checklist", points: ["Set NODE_ENV=production and all required env vars", "Use PM2 for process management and auto-restart", "Enable gzip compression and rate limiting", "Use HTTPS (Let's Encrypt or cloud provider)", "Set up CI/CD with GitHub Actions for automated testing and deployment", "Monitor with tools like Datadog, New Relic, or Sentry", "Use Docker for consistent environments across machines"] } },
        { type: "quiz", data: { question: "What does pm2 startup do?", options: ["Starts PM2 for the first time", "Creates a startup script so PM2 auto-restarts after server reboot", "Starts all stopped apps", "Displays PM2 documentation"], correctIndex: 1, explanation: "pm2 startup generates a startup script for your operating system that ensures PM2 (and all saved processes) restart automatically when the server reboots." } },
      ],
    },
  ]);

  console.log("\n🎉  Node.js + Express.js course seeded successfully!");
  console.log(`    Chapters: 14 | Lessons: ~32`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
