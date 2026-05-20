/**
 * Seed the MongoDB – Complete Database Course.
 *
 * Run from the BB_Backend directory:
 *   npx ts-node --esm seed-mongodb.ts
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

  const existing = await Course.findOne({ slug: "mongodb-complete-course" });
  if (existing) {
    console.log("⏭  Course already exists — skipping.");
    await mongoose.disconnect();
    process.exit(0);
  }

  // ─── Create Course ────────────────────────────────────────────────────────
  const course = await Course.create({
    title: "MongoDB – Complete Database Course",
    slug: "mongodb-complete-course",
    description:
      "A comprehensive guide to MongoDB — the world's most popular NoSQL database. Covers installation, CRUD operations, querying, aggregation, indexing, schema design, Mongoose integration, performance optimization, and security.",
    shortDescription:
      "Master MongoDB from scratch — CRUD, aggregation pipelines, indexing, schema design, Mongoose, and production best practices.",
    tags: ["MongoDB", "NoSQL", "Database", "Mongoose", "Node.js", "Aggregation", "Schema Design"],
    category: "Database",
    level: "Beginner",
    author: instructor._id,
    isPublished: true,
    price: 999,
    totalEnrollments: 0,
    rating: 0,
    totalRatings: 0,
    estimatedDuration: "35 hours",
    color: "from-green-600 to-teal-600",
    icon: "Database",
    whatYouWillLearn: [
      "Understand NoSQL vs SQL and when to use MongoDB",
      "Perform CRUD operations with MongoDB shell and Mongoose",
      "Write complex queries using comparison, logical, and array operators",
      "Design efficient schemas with embedding, referencing, and advanced patterns",
      "Build powerful aggregation pipelines for data analysis",
      "Create and manage indexes for optimal query performance",
      "Integrate MongoDB with Node.js using Mongoose ODM",
      "Secure, back up, and optimize MongoDB for production",
    ],
    requirements: [
      "Basic understanding of JSON and JavaScript objects",
      "Familiarity with the command line/terminal",
      "Familiarity with Node.js is helpful but not required",
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
  // CHAPTER 1 — Introduction to NoSQL & MongoDB
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Introduction to NoSQL & MongoDB", 1, [
    {
      title: "What is NoSQL & MongoDB?",
      slug: "intro-nosql-mongodb",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 10,
      summary: "Understand the NoSQL paradigm, how MongoDB differs from relational databases, and when to choose MongoDB.",
      content: [
        { type: "heading", data: { level: 2, text: "What is NoSQL?" } },
        { type: "paragraph", data: { text: "NoSQL (Not Only SQL) databases are non-relational databases designed to handle unstructured, semi-structured, and polymorphic data. They emerged to address the limitations of traditional relational databases (RDBMS) when dealing with large-scale web applications." } },
        { type: "heading", data: { level: 3, text: "Types of NoSQL Databases" } },
        { type: "list", data: { style: "bullet", items: ["Document Stores: MongoDB, CouchDB — data stored as JSON-like documents", "Key-Value Stores: Redis, DynamoDB — simple key-value pairs", "Column-family: Cassandra, HBase — optimized for wide-column queries", "Graph Databases: Neo4j, Amazon Neptune — optimized for relationships"] } },
        { type: "heading", data: { level: 2, text: "SQL vs NoSQL" } },
        { type: "table", data: { headers: ["Feature", "SQL (e.g., MySQL)", "NoSQL (MongoDB)"], rows: [["Data Format", "Rows and columns (tables)", "Documents (JSON/BSON)"], ["Schema", "Rigid, predefined schema", "Flexible, dynamic schema"], ["Relationships", "JOINs between tables", "Embedding or referencing"], ["Scaling", "Vertical (scale up)", "Horizontal (scale out)"], ["ACID", "Full ACID transactions", "Multi-doc transactions (v4.0+)"], ["Best For", "Complex queries, financial data", "Flexible data, rapid dev, large scale"]] } },
        { type: "heading", data: { level: 2, text: "What is MongoDB?" } },
        { type: "paragraph", data: { text: "MongoDB is a document-oriented NoSQL database released in 2009. It stores data as BSON (Binary JSON) documents within collections, rather than rows in tables. MongoDB is horizontally scalable, uses a flexible schema, and provides a powerful query language." } },
        { type: "heading", data: { level: 2, text: "Key MongoDB Concepts" } },
        { type: "list", data: { style: "bullet", items: ["Database: A container for collections (like a SQL database)", "Collection: A group of documents (like a SQL table)", "Document: A single record in JSON-like format (like a SQL row)", "Field: A key-value pair inside a document (like a SQL column)", "_id: A unique identifier automatically added to every document"] } },
        { type: "heading", data: { level: 2, text: "When to Use MongoDB" } },
        { type: "list", data: { style: "bullet", items: ["Content management systems (CMS) with varying content types", "E-commerce with diverse product attributes", "Real-time analytics and logging", "Mobile applications requiring offline sync", "IoT data storage with varying sensor data formats"] } },
        { type: "heading", data: { level: 2, text: "MongoDB vs MySQL Terminology" } },
        { type: "table", data: { headers: ["MySQL", "MongoDB"], rows: [["Database", "Database"], ["Table", "Collection"], ["Row", "Document"], ["Column", "Field"], ["Primary Key", "_id"], ["JOIN", "Embedding / $lookup"]] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["NoSQL databases offer flexibility and scalability over traditional relational databases", "MongoDB stores data as BSON documents in collections", "MongoDB scales horizontally — add more servers instead of upgrading one", "The _id field is automatically added as a unique identifier to every document", "Choose MongoDB for flexible-schema, rapidly-evolving, or large-scale data"] } },
        { type: "quiz", data: { question: "What is the MongoDB equivalent of a SQL table?", options: ["Document", "Record", "Collection", "Database"], correctIndex: 2, explanation: "A Collection in MongoDB is equivalent to a table in SQL. It is a group of documents, just like a table is a group of rows." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — Installation & Setup
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Installation & Setup", 2, [
    {
      title: "Installing MongoDB, Compass & MongoDB Atlas",
      slug: "mongodb-installation-setup",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 8,
      summary: "Install MongoDB locally, use MongoDB Compass GUI, work with mongosh shell, and get started with Atlas cloud.",
      content: [
        { type: "heading", data: { level: 2, text: "Installing MongoDB Community Edition" } },
        { type: "heading", data: { level: 3, text: "On macOS (using Homebrew)" } },
        { type: "code", data: { language: "bash", code: "brew tap mongodb/brew\nbrew install mongodb-community@7.0\nbrew services start mongodb-community@7.0" } },
        { type: "heading", data: { level: 3, text: "On Ubuntu/Debian Linux" } },
        { type: "code", data: { language: "bash", code: "curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor\necho 'deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list\nsudo apt update && sudo apt install -y mongodb-org\nsudo systemctl start mongod\nsudo systemctl enable mongod" } },
        { type: "heading", data: { level: 3, text: "On Windows" } },
        { type: "list", data: { style: "ordered", items: ["Download MongoDB Community Server from https://www.mongodb.com/try/download/community", "Run the .msi installer", "Install MongoDB Compass (GUI tool) when prompted", "MongoDB runs as a Windows service automatically"] } },
        { type: "heading", data: { level: 2, text: "MongoDB Compass (GUI)" } },
        { type: "paragraph", data: { text: "MongoDB Compass is the official graphical interface for MongoDB. It lets you visually browse your data, run queries, create indexes, and analyze performance — without writing shell commands. Download from: https://www.mongodb.com/products/compass. Connect with the default URI: mongodb://localhost:27017" } },
        { type: "heading", data: { level: 2, text: "MongoDB Shell (mongosh)" } },
        { type: "paragraph", data: { text: "mongosh is the modern MongoDB shell for interactive database access. It replaces the older 'mongo' shell and supports modern JavaScript, ES6+, better error messages, and syntax highlighting." } },
        { type: "code", data: { language: "bash", code: "# Start mongosh\nmongosh\n\n# Connect to a specific database\nmongosh 'mongodb://localhost:27017/mydb'\n\n# Show all databases\nshow dbs\n\n# Switch to / create a database\nuse myapp\n\n# Show current database\ndb\n\n# Show collections\nshow collections" } },
        { type: "heading", data: { level: 2, text: "MongoDB Atlas (Cloud)" } },
        { type: "info", data: { title: "Free Cloud Hosting", text: "MongoDB Atlas provides a free tier (512MB) perfect for learning and development. No installation required — access your database from anywhere." } },
        { type: "list", data: { style: "ordered", items: ["Go to https://www.mongodb.com/cloud/atlas", "Create a free account", "Create a free M0 cluster", "Add your IP address to the IP allowlist", "Create a database user", "Get your connection string: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/"] } },
        { type: "tip", data: { text: "For team projects, use Atlas. Add all team members' IP addresses (or use 0.0.0.0/0 for development) and share the connection string via a .env file." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["MongoDB can be installed locally (macOS, Linux, Windows) or used via Atlas (cloud)", "MongoDB Compass provides a GUI for visual exploration and query building", "mongosh is the modern shell that replaced the old mongo shell", "Atlas free tier is recommended for learning and team collaboration", "Default MongoDB port is 27017"] } },
        { type: "quiz", data: { question: "What is the default MongoDB port?", options: ["3306", "5432", "27017", "8080"], correctIndex: 2, explanation: "MongoDB runs on port 27017 by default. This is the standard port you'll use in connection strings like mongodb://localhost:27017." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — MongoDB Architecture
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("MongoDB Architecture", 3, [
    {
      title: "Documents, ObjectId, Replica Sets & Sharding",
      slug: "mongodb-architecture",
      order: 1,
      estimatedReadTime: 10,
      summary: "Explore how MongoDB stores data internally — WiredTiger, BSON documents, ObjectId, replica sets, and sharding.",
      content: [
        { type: "heading", data: { level: 2, text: "MongoDB Storage Architecture" } },
        { type: "paragraph", data: { text: "MongoDB uses the WiredTiger storage engine by default (since v3.2). WiredTiger provides document-level concurrency control, compression, and encryption. Data files are stored in the dbPath directory (/var/lib/mongodb on Linux). The journal acts as a write-ahead log for crash recovery, and the oplog is used for replication." } },
        { type: "heading", data: { level: 2, text: "Documents" } },
        { type: "paragraph", data: { text: "A MongoDB document is the basic unit of data, equivalent to a row in SQL. Documents are stored as BSON (Binary JSON) — a binary representation of JSON that supports more data types." } },
        { type: "code", data: { language: "javascript", code: "// Example MongoDB document\n{\n  _id: ObjectId('64a1b2c3d4e5f6789012345'),\n  name: 'Alice Johnson',\n  email: 'alice@example.com',\n  age: 28,\n  address: {\n    street: '123 Main St',\n    city: 'New York',\n    country: 'USA'\n  },\n  hobbies: ['reading', 'coding', 'hiking'],\n  createdAt: ISODate('2024-01-15T10:30:00Z')\n}" } },
        { type: "heading", data: { level: 2, text: "ObjectId" } },
        { type: "paragraph", data: { text: "The _id field is automatically added to every document with a unique ObjectId. An ObjectId is a 12-byte BSON type composed of: 4 bytes (Unix timestamp), 5 bytes (random value unique to the machine and process), and 3 bytes (incrementing counter)." } },
        { type: "code", data: { language: "javascript", code: "const id = new ObjectId();\nconsole.log(id.toString());     // '64a1b2c3d4e5f6789012345'\nconsole.log(id.getTimestamp()); // Creation time" } },
        { type: "heading", data: { level: 2, text: "Replica Sets" } },
        { type: "paragraph", data: { text: "A replica set is a group of MongoDB instances that maintain the same data set. It provides high availability and data redundancy." } },
        { type: "list", data: { style: "bullet", items: ["Primary: Receives all write operations", "Secondary: Replicates data from primary. Can serve reads", "Arbiter: Votes in elections but holds no data", "If the primary fails, an election is held and a secondary is automatically promoted to primary"] } },
        { type: "heading", data: { level: 2, text: "Sharding" } },
        { type: "paragraph", data: { text: "Sharding distributes data across multiple machines (shards), enabling horizontal scaling for very large datasets. Each shard holds a subset of the data, and a mongos router directs queries to the correct shard." } },
        { type: "info", data: { title: "Replication vs Sharding", text: "Replication copies the same data to multiple servers for high availability. Sharding splits data across multiple servers to handle datasets too large for a single machine." } },
        { type: "heading", data: { level: 2, text: "BSON Data Types" } },
        { type: "table", data: { headers: ["BSON Type", "JavaScript Type", "Example"], rows: [["ObjectId", "ObjectId", "ObjectId('...')"], ["String", "string", "'Hello World'"], ["Integer (32/64-bit)", "number", "42"], ["Double", "number", "3.14"], ["Boolean", "boolean", "true"], ["Date", "Date", "new Date()"], ["Array", "Array", "[1, 2, 3]"], ["Object", "Object", "{ key: value }"], ["Null", "null", "null"]] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["WiredTiger is MongoDB's default storage engine since v3.2", "ObjectId is a 12-byte identifier encoding timestamp, machine id, and counter", "Replica sets provide high availability — secondary promotes automatically if primary fails", "Sharding enables horizontal scaling for very large datasets", "BSON extends JSON with additional types like ObjectId, Date, and Binary"] } },
        { type: "quiz", data: { question: "What is sharding used for?", options: ["Encrypting data", "Backing up data", "Distributing data across multiple machines for horizontal scaling", "Replicating data for high availability"], correctIndex: 2, explanation: "Sharding distributes data across multiple servers (shards), each holding a portion. This enables horizontal scaling by adding more shards as data grows — handling datasets too large for a single server." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — CRUD Operations
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("CRUD Operations", 4, [
    {
      title: "Create & Read – Inserting and Querying Documents",
      slug: "mongodb-create-read",
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 12,
      summary: "Master inserting documents with insertOne/insertMany and querying with find, findOne, projection, sorting, and pagination.",
      content: [
        { type: "heading", data: { level: 2, text: "CRUD Overview" } },
        { type: "paragraph", data: { text: "CRUD stands for Create, Read, Update, Delete — the four fundamental operations for working with data. In MongoDB: insertOne/insertMany (Create), find/findOne (Read), updateOne/updateMany (Update), deleteOne/deleteMany (Delete)." } },
        { type: "heading", data: { level: 2, text: "Create – Inserting Documents" } },
        { type: "code", data: { language: "javascript", code: "// insertOne()\ndb.users.insertOne({\n  name: 'Alice',\n  email: 'alice@example.com',\n  age: 28,\n  city: 'New York'\n})\n// Returns: { acknowledged: true, insertedId: ObjectId('...') }\n\n// insertMany()\ndb.users.insertMany([\n  { name: 'Bob', email: 'bob@example.com', age: 32, city: 'London' },\n  { name: 'Carol', email: 'carol@example.com', age: 25, city: 'Tokyo' },\n  { name: 'Dave', email: 'dave@example.com', age: 35, city: 'Paris' }\n])" } },
        { type: "heading", data: { level: 2, text: "Read – Querying Documents" } },
        { type: "code", data: { language: "javascript", code: "// Get all documents\ndb.users.find()\n\n// Filter by a field\ndb.users.find({ city: 'New York' })\n\n// Filter multiple fields\ndb.users.find({ city: 'New York', age: 28 })\n\n// findOne – get single document\ndb.users.findOne({ email: 'alice@example.com' })" } },
        { type: "heading", data: { level: 3, text: "Projection – Selecting Fields" } },
        { type: "code", data: { language: "javascript", code: "// Return only name and email (1 = include, 0 = exclude)\ndb.users.find({}, { name: 1, email: 1, _id: 0 })" } },
        { type: "heading", data: { level: 3, text: "Sorting, Limiting, Skipping" } },
        { type: "code", data: { language: "javascript", code: "// Sort by age descending, get first 5\ndb.users.find().sort({ age: -1 }).limit(5)\n\n// Pagination: skip 10, get next 10\ndb.users.find().skip(10).limit(10)" } },
        { type: "tip", data: { text: "For pagination, always combine .skip() with .limit(). Page N with page size P: .skip((N-1) * P).limit(P)" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["insertOne() and insertMany() add documents to a collection", "find() returns a cursor; use .pretty() for readable output", "Projection controls which fields to return (1=include, 0=exclude)", "Chain .sort(), .limit(), .skip() for pagination", "findOne() returns the first matching document directly, not a cursor"] } },
        { type: "quiz", data: { question: "How do you get only 10 documents starting from the 20th record?", options: ["db.col.find().limit(10).offset(20)", "db.col.find().skip(20).limit(10)", "db.col.find().start(20).end(30)", "db.col.find({ skip: 20, limit: 10 })"], correctIndex: 1, explanation: "Use .skip(20).limit(10) — skip the first 20 documents, then return the next 10. This is the standard MongoDB pagination pattern." } },
      ],
    },
    {
      title: "Update & Delete – Modifying and Removing Documents",
      slug: "mongodb-update-delete",
      order: 2,
      estimatedReadTime: 10,
      summary: "Update documents with $set, $inc, upsert, and replaceOne. Delete with deleteOne, deleteMany, and bulk operations.",
      content: [
        { type: "heading", data: { level: 2, text: "Update – Modifying Documents" } },
        { type: "code", data: { language: "javascript", code: "// updateOne() – Update a single document\ndb.users.updateOne(\n  { email: 'alice@example.com' },  // filter\n  { $set: { age: 29, city: 'Boston' } }  // update\n)\n\n// updateMany() – Update all matching documents\ndb.users.updateMany(\n  { city: 'New York' },\n  { $set: { country: 'USA' } }\n)\n\n// Upsert – Insert if not found\ndb.users.updateOne(\n  { email: 'new@example.com' },\n  { $set: { name: 'New User', age: 20 } },\n  { upsert: true }\n)\n\n// replaceOne() – Replace entire document (keep only _id)\ndb.users.replaceOne(\n  { email: 'alice@example.com' },\n  { name: 'Alice Updated', email: 'alice@example.com', age: 30 }\n)" } },
        { type: "info", data: { title: "updateOne vs replaceOne", text: "$set in updateOne modifies only the specified fields, leaving others untouched. replaceOne replaces the entire document content (except _id), removing any fields not in the replacement." } },
        { type: "heading", data: { level: 2, text: "Delete – Removing Documents" } },
        { type: "code", data: { language: "javascript", code: "// deleteOne() – Remove first matching document\ndb.users.deleteOne({ email: 'alice@example.com' })\n\n// deleteMany() – Remove all matching documents\ndb.users.deleteMany({ city: 'New York' })\n\n// Delete ALL documents in collection (use with caution!)\ndb.users.deleteMany({})" } },
        { type: "warning", data: { title: "Caution", text: "db.collection.deleteMany({}) deletes ALL documents. Always double-check your filter before running delete operations in production." } },
        { type: "heading", data: { level: 2, text: "Bulk Operations" } },
        { type: "code", data: { language: "javascript", code: "db.users.bulkWrite([\n  { insertOne: { document: { name: 'Eve', age: 22 } } },\n  { updateOne: { filter: { name: 'Bob' }, update: { $set: { age: 33 } } } },\n  { deleteOne: { filter: { name: 'Dave' } } }\n])" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Use $set with updateOne/updateMany to modify specific fields without affecting others", "upsert: true inserts a document if no match is found", "replaceOne replaces the entire document body (only _id is preserved)", "deleteMany({}) removes ALL documents — always verify your filter", "bulkWrite() performs multiple operations in a single network round-trip"] } },
        { type: "quiz", data: { question: "What does upsert: true do in an updateOne() operation?", options: ["Always inserts a new document", "Inserts a document if no matching document is found", "Updates without a filter", "Prevents updates to existing documents"], correctIndex: 1, explanation: "upsert: true tells MongoDB: if a document matching the filter exists, update it; if not, insert a new document using the filter + update fields." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Data Types & Documents
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Data Types & Documents", 5, [
    {
      title: "BSON Data Types – Strings, Dates, Arrays & Embedded Docs",
      slug: "mongodb-data-types",
      order: 1,
      estimatedReadTime: 10,
      summary: "Master MongoDB's BSON data types: strings, numbers, booleans, dates, arrays, embedded documents, and regex.",
      content: [
        { type: "heading", data: { level: 2, text: "BSON Data Types" } },
        { type: "paragraph", data: { text: "MongoDB uses BSON (Binary JSON) which extends JSON with additional data types. Understanding these types is important for schema design and querying." } },
        { type: "heading", data: { level: 3, text: "String" } },
        { type: "code", data: { language: "javascript", code: "{ name: 'Alice', description: 'A sample string' }" } },
        { type: "heading", data: { level: 3, text: "Numbers" } },
        { type: "code", data: { language: "javascript", code: "{\n  age: 28,                         // 32-bit integer\n  price: 99.99,                     // 64-bit double (default)\n  population: NumberLong(8000000000) // 64-bit integer\n}" } },
        { type: "heading", data: { level: 3, text: "Date" } },
        { type: "code", data: { language: "javascript", code: "{\n  createdAt: new Date(),                    // Current datetime\n  updatedAt: ISODate('2024-01-15T10:30:00Z'),\n  birthday: new Date('1996-05-20')\n}" } },
        { type: "warning", data: { title: "Always Use Date Objects", text: "Always store dates as Date objects, never as strings. This enables date comparison operators ($gt, $lt, $gte, $lte) and date aggregation functions ($year, $month, $dayOfMonth)." } },
        { type: "heading", data: { level: 3, text: "Arrays" } },
        { type: "code", data: { language: "javascript", code: "{\n  tags: ['javascript', 'nodejs', 'mongodb'],\n  scores: [95, 87, 92],\n  addresses: [\n    { type: 'home', city: 'New York' },\n    { type: 'work', city: 'Boston' }\n  ]\n}" } },
        { type: "heading", data: { level: 3, text: "Embedded Documents (Objects)" } },
        { type: "code", data: { language: "javascript", code: "{\n  name: 'Alice',\n  address: {\n    street: '123 Main St',\n    city: 'New York',\n    state: 'NY',\n    zipCode: '10001'\n  }\n}\n\n// Query embedded document fields using dot notation:\ndb.users.find({ 'address.city': 'New York' })" } },
        { type: "heading", data: { level: 3, text: "Regular Expressions" } },
        { type: "code", data: { language: "javascript", code: "// Find users whose name starts with 'A' (case-insensitive)\ndb.users.find({ name: /^A/i })\n\n// Find users whose email contains 'gmail'\ndb.users.find({ email: /gmail/i })" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Always store dates as Date objects — enables date operators and sorting", "Dot notation ('parent.child') is required for querying nested fields", "Arrays can hold mixed types or embedded objects", "Regex queries enable flexible text matching without a text index", "null value and missing field are treated similarly by find() — both match { field: null }"] } },
        { type: "quiz", data: { question: "Which data type should you use to store dates in MongoDB?", options: ["String ('2024-01-15')", "Number (Unix timestamp)", "Date object (new Date())", "Either string or number"], correctIndex: 2, explanation: "Always use Date objects. They enable MongoDB's date comparison operators ($gt, $lt), date arithmetic, and date aggregation operators like $year and $month. Strings cannot be compared as dates." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Collections
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Collections", 6, [
    {
      title: "Creating Collections, Capped Collections & Schema Validation",
      slug: "mongodb-collections",
      order: 1,
      estimatedReadTime: 9,
      summary: "Create collections explicitly or implicitly, use capped collections for logs, and enforce schema validation with JSON Schema.",
      content: [
        { type: "heading", data: { level: 2, text: "What is a Collection?" } },
        { type: "paragraph", data: { text: "A collection is a group of MongoDB documents, analogous to a table in a relational database. Collections do not enforce a schema by default — documents within a collection can have different fields. However, using a consistent structure (enforced by Mongoose schemas in Node.js) is recommended." } },
        { type: "heading", data: { level: 2, text: "Creating Collections" } },
        { type: "code", data: { language: "javascript", code: "// Implicit creation (happens when you insert a document)\ndb.products.insertOne({ name: 'Laptop' })\n\n// Explicit creation with JSON Schema validation\ndb.createCollection('products', {\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['name', 'price'],\n      properties: {\n        name: { bsonType: 'string' },\n        price: { bsonType: 'number', minimum: 0 }\n      }\n    }\n  }\n})" } },
        { type: "heading", data: { level: 2, text: "Capped Collections" } },
        { type: "paragraph", data: { text: "Capped collections are fixed-size collections that overwrite the oldest documents when the size limit is reached. Useful for logs, audit trails, and caches." } },
        { type: "code", data: { language: "javascript", code: "db.createCollection('eventLogs', {\n  capped: true,\n  size: 1048576,  // 1MB max size\n  max: 1000       // Max 1000 documents\n})\n\n// Most recent 100 logs (natural order in capped = insertion order)\ndb.eventLogs.find().sort({ $natural: -1 }).limit(100)" } },
        { type: "heading", data: { level: 2, text: "Schema Validation" } },
        { type: "paragraph", data: { text: "MongoDB 3.6+ supports JSON Schema validation, allowing you to enforce field types and required fields at the database level." } },
        { type: "code", data: { language: "javascript", code: "db.runCommand({\n  collMod: 'users',\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['name', 'email'],\n      properties: {\n        name: { bsonType: 'string', description: 'Must be a string' },\n        email: { bsonType: 'string', pattern: '^.+@.+$' },\n        age: { bsonType: 'int', minimum: 0, maximum: 150 }\n      }\n    }\n  },\n  validationAction: 'error'  // or 'warn'\n})" } },
        { type: "heading", data: { level: 2, text: "Useful Collection Methods" } },
        { type: "code", data: { language: "javascript", code: "// Count documents with filter\ndb.users.countDocuments({ city: 'New York' })\n\n// Get distinct values\ndb.users.distinct('city')\n\n// Drop a collection\ndb.users.drop()\n\n// Rename a collection\ndb.users.renameCollection('customers')\n\n// Get collection statistics\ndb.users.stats()" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Collections are created implicitly on first insert or explicitly with createCollection()", "Capped collections auto-overwrite oldest documents — ideal for logs and caches", "JSON Schema validation enforces types and required fields at the database level", "validationAction: 'warn' logs a warning but still inserts; 'error' rejects invalid documents", "distinct() returns unique values — useful for building filter dropdowns"] } },
        { type: "quiz", data: { question: "What is a capped collection?", options: ["A collection with a max number of fields", "A fixed-size collection that overwrites oldest documents when full", "An encrypted collection", "A read-only collection"], correctIndex: 1, explanation: "A capped collection has a fixed size. When it's full, it automatically overwrites the oldest documents. This makes it ideal for rolling logs, event streams, and caches where you only need recent data." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Query Operators
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Query Operators", 7, [
    {
      title: "Comparison, Logical & Element Operators",
      slug: "mongodb-query-operators-basic",
      order: 1,
      estimatedReadTime: 10,
      summary: "Use comparison ($eq, $gt, $in), logical ($and, $or, $not), and element ($exists, $type) operators to write powerful queries.",
      content: [
        { type: "heading", data: { level: 2, text: "Comparison Operators" } },
        { type: "table", data: { headers: ["Operator", "Meaning", "Example"], rows: [["$eq", "Equal", "{ age: { $eq: 25 } }"], ["$ne", "Not equal", "{ status: { $ne: 'inactive' } }"], ["$gt", "Greater than", "{ price: { $gt: 100 } }"], ["$gte", "Greater than or equal", "{ age: { $gte: 18 } }"], ["$lt", "Less than", "{ price: { $lt: 50 } }"], ["$lte", "Less than or equal", "{ age: { $lte: 65 } }"], ["$in", "In an array", "{ city: { $in: ['NYC', 'LA'] } }"], ["$nin", "Not in array", "{ status: { $nin: ['deleted', 'banned'] } }"]] } },
        { type: "heading", data: { level: 2, text: "Logical Operators" } },
        { type: "code", data: { language: "javascript", code: "// $and – all conditions must be true\ndb.products.find({\n  $and: [{ price: { $gte: 10 } }, { price: { $lte: 100 } }]\n})\n\n// $or – at least one condition must be true\ndb.users.find({\n  $or: [{ city: 'New York' }, { city: 'London' }]\n})\n\n// $not – negate a condition\ndb.users.find({ age: { $not: { $lt: 18 } } })\n\n// $nor – none of the conditions must be true\ndb.users.find({\n  $nor: [{ city: 'NYC' }, { status: 'inactive' }]\n})" } },
        { type: "heading", data: { level: 2, text: "Element Operators" } },
        { type: "code", data: { language: "javascript", code: "// $exists – check if field exists\ndb.users.find({ middleName: { $exists: true } })\n\n// $type – check field type\ndb.users.find({ age: { $type: 'int' } })\ndb.docs.find({ value: { $type: ['int', 'double'] } })" } },
        { type: "tip", data: { text: "{ $exists: true } checks if the field exists in the document at all (even if its value is null). { field: null } matches both null values and missing fields." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["$in checks if a value is in a list — works on scalar fields and arrays", "$and/$or/$nor/$not compose multiple conditions logically", "$exists checks field presence regardless of value", "$type filters documents by the BSON type of a field", "You can usually skip $and by combining conditions in a single object: { a: 1, b: 2 }"] } },
        { type: "quiz", data: { question: "Which operator finds documents where a field value is in a given array?", options: ["$contains", "$in", "$within", "$array"], correctIndex: 1, explanation: "$in checks if the field value matches any element in the provided array. Example: { city: { $in: ['NYC', 'LA'] } } returns documents where city is either 'NYC' or 'LA'." } },
      ],
    },
    {
      title: "Array, Update Operators & Text Search",
      slug: "mongodb-query-operators-advanced",
      order: 2,
      estimatedReadTime: 10,
      summary: "Use array operators ($all, $elemMatch, $size), update operators ($set, $inc, $push, $pull), and text search.",
      content: [
        { type: "heading", data: { level: 2, text: "Array Operators" } },
        { type: "code", data: { language: "javascript", code: "// $all – array contains all specified values\ndb.posts.find({ tags: { $all: ['mongodb', 'database'] } })\n\n// $elemMatch – at least one element matches ALL conditions\ndb.users.find({\n  scores: { $elemMatch: { $gte: 80, $lt: 90 } }\n})\n\n// $size – array has exact number of elements\ndb.users.find({ hobbies: { $size: 3 } })" } },
        { type: "info", data: { title: "$in vs $all", text: "{ tags: { $in: ['a', 'b'] } } matches if tags contains 'a' OR 'b'. { tags: { $all: ['a', 'b'] } } matches only if tags contains BOTH 'a' AND 'b'." } },
        { type: "heading", data: { level: 2, text: "Update Operators" } },
        { type: "code", data: { language: "javascript", code: "// $set – set field values\ndb.users.updateOne({_id: id}, { $set: { name: 'New Name' } })\n\n// $unset – remove a field\ndb.users.updateOne({_id: id}, { $unset: { tempField: '' } })\n\n// $inc – increment a field\ndb.products.updateOne({_id: id}, { $inc: { stock: -1, views: 1 } })\n\n// $push – add element to array\ndb.users.updateOne({_id: id}, { $push: { tags: 'nodejs' } })\n\n// $pull – remove element from array\ndb.users.updateOne({_id: id}, { $pull: { tags: 'nodejs' } })\n\n// $addToSet – add to array only if not already present\ndb.users.updateOne({_id: id}, { $addToSet: { tags: 'mongodb' } })" } },
        { type: "heading", data: { level: 2, text: "Text Search" } },
        { type: "code", data: { language: "javascript", code: "// First create a text index\ndb.articles.createIndex({ title: 'text', body: 'text' })\n\n// Then search\ndb.articles.find({ $text: { $search: 'mongodb performance' } })\n\n// Sort by relevance score\ndb.articles.find(\n  { $text: { $search: 'mongodb' } },\n  { score: { $meta: 'textScore' } }\n).sort({ score: { $meta: 'textScore' } })" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["$elemMatch ensures ALL conditions are met by a SINGLE array element", "$inc is atomic — perfect for counters and stock tracking", "$addToSet prevents duplicates in arrays (unlike $push)", "$unset removes a field from a document entirely", "Text search requires a text index and uses the $text operator"] } },
        { type: "quiz", data: { question: "What does $addToSet do differently from $push?", options: ["It adds multiple elements at once", "It adds an element to an array only if it is not already present", "It creates a new array if one doesn't exist", "It adds the element at the beginning"], correctIndex: 1, explanation: "$addToSet adds a value to an array only if it's not already in the array, preventing duplicates. $push always adds the value regardless of whether it's already present." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Indexing
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Indexing", 8, [
    {
      title: "Index Types, Creating Indexes & Explain Plans",
      slug: "mongodb-indexing",
      order: 1,
      estimatedReadTime: 12,
      summary: "Understand index types (single, compound, unique, TTL, text), create and manage them, and analyze query performance with explain().",
      content: [
        { type: "heading", data: { level: 2, text: "What is an Index?" } },
        { type: "paragraph", data: { text: "An index is a data structure that improves the speed of data retrieval operations. Without an index, MongoDB performs a collection scan (COLLSCAN) — reading every document to find matches. With an index, MongoDB uses a B-tree structure (IXSCAN) for dramatically faster lookups." } },
        { type: "info", data: { title: "Think of a Book Index", text: "An index is like a book's index — instead of reading every page to find a topic, you look it up in the back. MongoDB does the same: instead of scanning every document, it looks up the index to find matching documents instantly." } },
        { type: "heading", data: { level: 2, text: "Creating Indexes" } },
        { type: "code", data: { language: "javascript", code: "// Single field index (1 = ascending, -1 = descending)\ndb.users.createIndex({ email: 1 })\n\n// Compound index (multiple fields)\ndb.products.createIndex({ category: 1, price: -1 })\n\n// Unique index\ndb.users.createIndex({ email: 1 }, { unique: true })\n\n// Sparse index (only indexes documents with the field)\ndb.users.createIndex({ phone: 1 }, { sparse: true })\n\n// TTL index (documents auto-deleted after N seconds)\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })\n\n// Text index\ndb.articles.createIndex({ title: 'text', content: 'text' })\n\n// Geospatial index\ndb.places.createIndex({ location: '2dsphere' })" } },
        { type: "heading", data: { level: 2, text: "Viewing and Managing Indexes" } },
        { type: "code", data: { language: "javascript", code: "// List all indexes on a collection\ndb.users.getIndexes()\n\n// Drop an index by name\ndb.users.dropIndex('email_1')\n\n// Drop all indexes (except _id)\ndb.users.dropIndexes()" } },
        { type: "heading", data: { level: 2, text: "Explain Plan – Analyzing Query Performance" } },
        { type: "code", data: { language: "javascript", code: "// See how MongoDB executes a query\ndb.users.find({ email: 'alice@example.com' }).explain('executionStats')" } },
        { type: "list", data: { style: "bullet", items: ["COLLSCAN: Collection scan — no index used (slow for large collections)", "IXSCAN: Index scan — index used (fast)", "nReturned vs totalDocsExamined: Should be equal if index is effective", "executionTimeMillis: Total query execution time"] } },
        { type: "heading", data: { level: 2, text: "Index Best Practices (ESR Rule)" } },
        { type: "list", data: { style: "bullet", items: ["ESR Rule for compound indexes: Equality → Sort → Range", "Index fields used in frequent queries, sort operations, and joins", "Avoid indexing fields with low cardinality (e.g., boolean fields)", "Don't over-index — each index consumes memory and slows writes", "Use .explain() to verify index usage before deploying"] } },
        { type: "code", data: { language: "javascript", code: "// Optimal compound index for: filter by userId+status, sort by createdAt\ndb.orders.createIndex({ userId: 1, status: 1, createdAt: -1 })" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Without an index, MongoDB does a COLLSCAN (slow); with one, it does an IXSCAN (fast)", "The _id index is automatically created and cannot be dropped", "TTL indexes automatically delete expired documents — perfect for sessions and tokens", "ESR Rule: Equality first, Sort second, Range last in compound indexes", "Use .explain('executionStats') to diagnose slow queries"] } },
        { type: "quiz", data: { question: "What does a TTL index do?", options: ["Creates a text search index", "Auto-deletes documents after a specified number of seconds", "Tracks document version history", "Limits query time"], correctIndex: 1, explanation: "A TTL (Time To Live) index automatically deletes documents after a specified number of seconds past a date field. Perfect for session tokens, OTP codes, and temporary data with automatic expiry." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Aggregation Framework
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Aggregation Framework", 9, [
    {
      title: "Aggregation Pipeline – Stages & Real-World Examples",
      slug: "mongodb-aggregation",
      order: 1,
      estimatedReadTime: 14,
      summary: "Build powerful data pipelines with $match, $group, $project, $lookup, $unwind, $addFields, and $facet.",
      content: [
        { type: "heading", data: { level: 2, text: "What is the Aggregation Framework?" } },
        { type: "paragraph", data: { text: "The Aggregation Framework is MongoDB's powerful data processing pipeline. It transforms and analyzes data through a sequence of pipeline stages, similar to UNIX pipes. Each stage takes documents, processes them, and outputs the result to the next stage." } },
        { type: "heading", data: { level: 2, text: "Basic Pipeline Structure" } },
        { type: "code", data: { language: "javascript", code: "db.orders.aggregate([\n  { $match: { status: 'completed' } },             // Filter\n  { $group: { _id: '$userId', total: { $sum: '$amount' } } }, // Group\n  { $sort: { total: -1 } },                         // Sort\n  { $limit: 10 }                                    // Limit\n])" } },
        { type: "heading", data: { level: 2, text: "Common Pipeline Stages" } },
        { type: "heading", data: { level: 3, text: "$match – Filter Documents" } },
        { type: "code", data: { language: "javascript", code: "{ $match: { status: 'active', age: { $gte: 18 } } }" } },
        { type: "heading", data: { level: 3, text: "$group – Group and Aggregate" } },
        { type: "code", data: { language: "javascript", code: "{ $group: {\n  _id: '$category',         // Group by category\n  totalSales: { $sum: '$amount' },\n  avgPrice:   { $avg: '$price' },\n  count:      { $sum: 1 },\n  minPrice:   { $min: '$price' },\n  maxPrice:   { $max: '$price' }\n}}" } },
        { type: "heading", data: { level: 3, text: "$project – Select and Transform Fields" } },
        { type: "code", data: { language: "javascript", code: "{ $project: {\n  name: 1,\n  email: 1,\n  fullName: { $concat: ['$firstName', ' ', '$lastName'] },\n  ageInMonths: { $multiply: ['$age', 12] }\n}}" } },
        { type: "heading", data: { level: 3, text: "$lookup – Join Collections" } },
        { type: "code", data: { language: "javascript", code: "{ $lookup: {\n  from: 'products',        // Collection to join\n  localField: 'productId',  // Field in current collection\n  foreignField: '_id',      // Field in 'products' collection\n  as: 'productDetails'      // Output array field name\n}}" } },
        { type: "heading", data: { level: 3, text: "$unwind – Deconstruct Arrays" } },
        { type: "code", data: { language: "javascript", code: "// Expands each array element into a separate document\n{ $unwind: '$tags' }" } },
        { type: "heading", data: { level: 3, text: "$addFields – Add Computed Fields" } },
        { type: "code", data: { language: "javascript", code: "{ $addFields: {\n  totalPrice:     { $multiply: ['$price', '$quantity'] },\n  discountedPrice: { $multiply: ['$price', 0.9] }\n}}" } },
        { type: "heading", data: { level: 2, text: "Real-World Example: Monthly Sales Report" } },
        { type: "code", data: { language: "javascript", code: "db.orders.aggregate([\n  { $match: {\n    status: 'completed',\n    createdAt: { $gte: new Date('2024-01-01') }\n  }},\n  { $group: {\n    _id: {\n      year:  { $year: '$createdAt' },\n      month: { $month: '$createdAt' }\n    },\n    revenue:       { $sum: '$total' },\n    orderCount:    { $sum: 1 },\n    avgOrderValue: { $avg: '$total' }\n  }},\n  { $sort: { '_id.year': 1, '_id.month': 1 } }\n])" } },
        { type: "heading", data: { level: 2, text: "$facet – Multiple Pipelines in One Query" } },
        { type: "code", data: { language: "javascript", code: "db.products.aggregate([{\n  $facet: {\n    priceBuckets: [\n      { $bucket: { groupBy: '$price', boundaries: [0, 25, 50, 100, 500] } }\n    ],\n    categoryStats: [\n      { $group: { _id: '$category', count: { $sum: 1 } } }\n    ]\n  }\n}])" } },
        { type: "tip", data: { text: "Always place $match early in the pipeline to reduce the number of documents processed by subsequent stages. If $match can use an index, it dramatically speeds up the entire pipeline." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Aggregation pipelines process data server-side through sequential stages", "$match early reduces documents in the pipeline — use indexes here", "$group with accumulators ($sum, $avg, $min, $max) performs analytics", "$lookup performs a JOIN with another collection", "$unwind is required before processing joined arrays from $lookup", "$facet runs multiple sub-pipelines in a single pass"] } },
        { type: "quiz", data: { question: "Which aggregation stage filters documents (like a WHERE clause)?", options: ["$filter", "$where", "$match", "$select"], correctIndex: 2, explanation: "$match is the aggregation equivalent of a SQL WHERE clause. It filters documents at that stage of the pipeline. Always place $match as early as possible to reduce documents processed downstream." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 10 — Schema Design
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Schema Design", 10, [
    {
      title: "Embedding vs Referencing & Relationship Patterns",
      slug: "mongodb-schema-design",
      order: 1,
      estimatedReadTime: 12,
      summary: "Design efficient MongoDB schemas — when to embed vs reference, one-to-one, one-to-many, and many-to-many relationships.",
      content: [
        { type: "heading", data: { level: 2, text: "Schema Design Principles" } },
        { type: "paragraph", data: { text: "Although MongoDB allows flexible schemas, good schema design is critical for performance and maintainability. Design your schema around how your application queries data, not how the data looks in isolation." } },
        { type: "heading", data: { level: 2, text: "Embedding (Denormalization)" } },
        { type: "code", data: { language: "javascript", code: "// User with embedded address — good for one-to-few relationships\n{\n  _id: ObjectId(),\n  name: 'Alice',\n  address: { street: '123 Main St', city: 'New York' },\n  orders: [{ id: 1, item: 'Book', total: 29.99 }]\n}" } },
        { type: "list", data: { style: "bullet", items: ["Use embedding when: data is accessed together", "Relationship is one-to-few (e.g., user → addresses)", "Data rarely changes independently", "No document size concern (< 16MB limit)"] } },
        { type: "heading", data: { level: 2, text: "Referencing (Normalization)" } },
        { type: "code", data: { language: "javascript", code: "// User document\n{ _id: ObjectId('user123'), name: 'Alice' }\n\n// Order document (references user)\n{ _id: ObjectId(), userId: ObjectId('user123'), item: 'Book', total: 29.99 }" } },
        { type: "list", data: { style: "bullet", items: ["Use referencing when: data is accessed independently", "Relationship is one-to-many or many-to-many", "Data changes frequently", "Embedded documents would grow too large (> 16MB limit)"] } },
        { type: "heading", data: { level: 2, text: "Relationship Types" } },
        { type: "heading", data: { level: 3, text: "One-to-One" } },
        { type: "code", data: { language: "javascript", code: "// Embed in same document\n{ _id: 'user1', name: 'Alice', profile: { bio: '...', avatar: 'url' } }" } },
        { type: "heading", data: { level: 3, text: "One-to-Many" } },
        { type: "code", data: { language: "javascript", code: "// Embed if 'many' is small (e.g., blog post with < 100 comments)\n{ _id: 'post1', title: 'My Post', comments: [{...}, {...}] }\n\n// Reference if 'many' is large (e.g., user with thousands of orders)\n{ _id: 'order1', userId: 'user1', amount: 100 }" } },
        { type: "heading", data: { level: 3, text: "Many-to-Many" } },
        { type: "code", data: { language: "javascript", code: "// Products and categories (array of references)\n{ _id: 'prod1', name: 'Book', categoryIds: ['cat1', 'cat2'] }\n{ _id: 'cat1', name: 'Education' }" } },
        { type: "warning", data: { title: "16MB Document Size Limit", text: "MongoDB documents cannot exceed 16MB. For one-to-many relationships where the array could grow without bounds (e.g., a post's comments), always use referencing to avoid hitting this limit." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Design schema around query patterns, not data structure", "Embed for one-to-few relationships where data is accessed together", "Reference for one-to-many/many-to-many or frequently changing data", "16MB document size limit — use references for unbounded arrays", "Denormalization (embedding) trades write complexity for read speed"] } },
        { type: "quiz", data: { question: "When should you prefer embedding over referencing?", options: ["When data is large and frequently updated independently", "When data is accessed together, and the relationship is one-to-few", "When you need JOINs", "Always prefer embedding"], correctIndex: 1, explanation: "Embed when data is consistently accessed together and the relationship is one-to-few. This avoids expensive $lookup operations and keeps related data in a single document read." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — Relationships – Embedding vs Referencing
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Relationships – Advanced Patterns", 11, [
    {
      title: "Extended Reference, Subset, Polymorphic Patterns & $lookup",
      slug: "mongodb-relationship-patterns",
      order: 1,
      estimatedReadTime: 12,
      summary: "Apply advanced schema patterns: Extended Reference, Subset Pattern, Polymorphic Pattern, and performing joins with $lookup.",
      content: [
        { type: "heading", data: { level: 2, text: "Extended Reference Pattern" } },
        { type: "paragraph", data: { text: "Store a reference plus frequently accessed fields from the related document to avoid $lookup on every query." } },
        { type: "code", data: { language: "javascript", code: "// Order document with extended reference to user\n{\n  _id: ObjectId(),\n  userId: ObjectId('user123'),\n  // Extended reference — frequently needed user fields\n  userName: 'Alice',\n  userEmail: 'alice@example.com',\n  items: [...],\n  total: 99.99\n}" } },
        { type: "heading", data: { level: 2, text: "Subset Pattern" } },
        { type: "paragraph", data: { text: "Store only the most relevant subset of embedded data, keeping the full list in another collection." } },
        { type: "code", data: { language: "javascript", code: "// Post document with latest 5 comments embedded\n{\n  _id: ObjectId(),\n  title: 'MongoDB Tips',\n  content: '...',\n  commentCount: 248,\n  recentComments: [ // Only last 5 comments\n    { user: 'Bob', text: 'Great article!', date: new Date() }\n  ]\n}" } },
        { type: "heading", data: { level: 2, text: "Polymorphic Pattern" } },
        { type: "paragraph", data: { text: "When different document types share common fields but also have type-specific fields, store all types in one collection with a type discriminator." } },
        { type: "code", data: { language: "javascript", code: "{ _id: 1, type: 'book', title: 'MongoDB Guide', pages: 300, isbn: '...' }\n{ _id: 2, type: 'video', title: 'MongoDB Tutorial', duration: 3600, resolution: '1080p' }" } },
        { type: "heading", data: { level: 2, text: "Performing Joins with $lookup" } },
        { type: "code", data: { language: "javascript", code: "// Join orders with users\ndb.orders.aggregate([\n  { $lookup: {\n    from: 'users',\n    localField: 'userId',\n    foreignField: '_id',\n    as: 'userDetails'\n  }},\n  { $unwind: {\n    path: '$userDetails',\n    preserveNullAndEmptyArrays: true  // Keep docs with no matching user\n  }}\n])" } },
        { type: "info", data: { title: "When Duplication Makes Sense", text: "Duplication (denormalization) makes sense when data is read far more often than it changes, and when avoiding a $lookup provides a significant performance benefit. Accept the tradeoff: updates must propagate to multiple places." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Extended Reference embeds frequently-read fields from related docs to avoid $lookup", "Subset Pattern keeps only recent/relevant subset in parent doc for performance", "Polymorphic Pattern uses a type field to store different shapes in one collection", "preserveNullAndEmptyArrays: true in $unwind keeps docs with no matching join", "Denormalization trades write complexity for dramatically faster reads"] } },
        { type: "quiz", data: { question: "What problem does the Extended Reference Pattern solve?", options: ["Document size limits", "Reducing $lookup queries by embedding frequently needed fields from related documents", "Handling many-to-many relationships", "Improving write performance"], correctIndex: 1, explanation: "The Extended Reference Pattern stores a reference (ObjectId) plus copies of frequently accessed fields from the related document. This eliminates the need for $lookup on every read, improving performance at the cost of some duplication." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 12 — MongoDB with Node.js – Mongoose
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("MongoDB with Node.js – Mongoose", 12, [
    {
      title: "Mongoose Setup, Schemas, Virtuals & Middleware",
      slug: "mongoose-setup-schemas",
      order: 1,
      estimatedReadTime: 12,
      summary: "Connect Mongoose, define schemas with validation, add virtual properties, and use pre/post middleware hooks.",
      content: [
        { type: "heading", data: { level: 2, text: "What is Mongoose?" } },
        { type: "paragraph", data: { text: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, query building, middleware (hooks), and virtual properties — bringing structure to MongoDB's flexible documents." } },
        { type: "heading", data: { level: 2, text: "Connecting Mongoose" } },
        { type: "code", data: { language: "javascript", code: "const mongoose = require('mongoose');\n\nmongoose.connect(process.env.MONGO_URI)\n  .then(() => console.log('MongoDB connected'))\n  .catch(err => console.error('Connection error:', err));" } },
        { type: "heading", data: { level: 2, text: "Defining Schemas" } },
        { type: "code", data: { language: "javascript", code: "const productSchema = new mongoose.Schema({\n  name: {\n    type: String,\n    required: [true, 'Name is required'],\n    trim: true,\n    maxlength: 100\n  },\n  price: {\n    type: Number,\n    required: true,\n    min: [0, 'Price cannot be negative']\n  },\n  category: {\n    type: String,\n    enum: ['electronics', 'books', 'clothing'],\n    required: true\n  },\n  inStock: { type: Boolean, default: true },\n  tags: [String],\n  createdAt: { type: Date, default: Date.now }\n}, { timestamps: true }); // Adds createdAt and updatedAt automatically" } },
        { type: "heading", data: { level: 2, text: "Mongoose Virtuals" } },
        { type: "code", data: { language: "javascript", code: "userSchema.virtual('fullName').get(function() {\n  return `${this.firstName} ${this.lastName}`;\n});" } },
        { type: "heading", data: { level: 2, text: "Mongoose Middleware (Hooks)" } },
        { type: "code", data: { language: "javascript", code: "// Pre-save hook: hash password before saving\nuserSchema.pre('save', async function(next) {\n  if (!this.isModified('password')) return next();\n  this.password = await bcrypt.hash(this.password, 10);\n  next();\n});\n\n// Post-save hook\nuserSchema.post('save', function(doc) {\n  console.log('User saved:', doc._id);\n});" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Mongoose adds schema validation at the application layer before data reaches MongoDB", "{ timestamps: true } automatically manages createdAt and updatedAt fields", "Virtuals are computed properties not stored in DB — useful for derived fields", "Pre-save hooks run before document is saved — perfect for password hashing", "Post-save hooks run after save — useful for sending emails or audit logs"] } },
        { type: "quiz", data: { question: "What does { timestamps: true } add to a Mongoose schema?", options: ["Only createdAt field", "Both createdAt and updatedAt fields that are automatically managed", "A timestamp format validator", "UTC conversion for dates"], correctIndex: 1, explanation: "{ timestamps: true } in a Mongoose schema automatically adds and manages both createdAt (set on insert) and updatedAt (updated on every save) fields. You never need to set these manually." } },
      ],
    },
    {
      title: "Mongoose Population, Query Methods & Performance",
      slug: "mongoose-queries-advanced",
      order: 2,
      estimatedReadTime: 10,
      summary: "Use .populate() for reference resolution, chain query methods, and optimize with .lean() for production performance.",
      content: [
        { type: "heading", data: { level: 2, text: "Mongoose Population (Reference Resolution)" } },
        { type: "code", data: { language: "javascript", code: "const orderSchema = new mongoose.Schema({\n  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]\n});\n\n// Populate referenced documents\nconst order = await Order.findById(id)\n  .populate('userId', 'name email')\n  .populate('products', 'name price');" } },
        { type: "heading", data: { level: 2, text: "Mongoose Query Methods" } },
        { type: "code", data: { language: "javascript", code: "// Chaining query methods\nconst products = await Product\n  .find({ category: 'electronics' })\n  .select('name price -_id')       // -field excludes it\n  .sort({ price: -1 })\n  .limit(10)\n  .skip(20)\n  .lean(); // Returns plain JS objects (faster, no Mongoose overhead)" } },
        { type: "info", data: { title: "When to Use .lean()", text: "Use .lean() when reading data for API responses and you don't need Mongoose document methods (save, validate) or virtuals. lean() returns plain JavaScript objects which are faster to create and use less memory — perfect for read-heavy routes." } },
        { type: "heading", data: { level: 2, text: "Complete Post Schema Example" } },
        { type: "code", data: { language: "javascript", code: "const postSchema = new mongoose.Schema({\n  title:     { type: String, required: true, trim: true },\n  slug:      { type: String, unique: true },\n  content:   { type: String, required: true },\n  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },\n  tags:      [String],\n  published: { type: Boolean, default: false },\n  viewCount: { type: Number, default: 0 }\n}, { timestamps: true });\n\n// Auto-generate slug from title\npostSchema.pre('save', function(next) {\n  if (this.isModified('title')) {\n    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');\n  }\n  next();\n});\n\nmodule.exports = mongoose.model('Post', postSchema);" } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: [".populate() replaces ObjectId references with actual referenced documents", "Use .lean() for read operations in API routes — significantly faster", ".select('-field') excludes a field; .select('field1 field2') includes only those fields", "Mongoose validation runs in Node.js; MongoDB validation runs in the DB — use both", "Chain .sort(), .limit(), .skip() for efficient pagination"] } },
        { type: "quiz", data: { question: "What does .populate() do in Mongoose?", options: ["Adds default data to empty fields", "Replaces ObjectId references with the actual referenced documents", "Creates a new collection", "Generates test data"], correctIndex: 1, explanation: ".populate() performs a secondary query to replace ObjectId values with the actual documents from the referenced collection. It's the Mongoose equivalent of a SQL JOIN." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Performance Optimization
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Performance Optimization", 13, [
    {
      title: "Query Optimization, Covered Queries & the MongoDB Profiler",
      slug: "mongodb-performance-optimization",
      order: 1,
      estimatedReadTime: 10,
      summary: "Optimize MongoDB queries with proper indexes, covered queries, aggregation best practices, and the query profiler.",
      content: [
        { type: "heading", data: { level: 2, text: "Query Optimization" } },
        { type: "list", data: { style: "bullet", items: ["Use indexes on frequently queried fields", "Use .explain('executionStats') to verify index usage", "Use projection to return only needed fields", "Use .lean() in Mongoose for read operations", "Avoid $where and JavaScript expressions (they bypass indexes)"] } },
        { type: "heading", data: { level: 2, text: "Covered Queries" } },
        { type: "paragraph", data: { text: "A covered query is one where all the queried and projected fields are in the index, so MongoDB never needs to read the actual documents. This is the fastest possible query — data is served entirely from the index." } },
        { type: "code", data: { language: "javascript", code: "// Create compound index covering all query + projection fields\ndb.users.createIndex({ email: 1, name: 1, _id: 0 })\n\n// This query is fully covered — no document reads needed\ndb.users.find(\n  { email: 'alice@example.com' },\n  { name: 1, email: 1, _id: 0 }\n)" } },
        { type: "heading", data: { level: 2, text: "Index Optimization" } },
        { type: "list", data: { style: "bullet", items: ["Create compound indexes matching your query patterns", "Use covered queries (all fields in query + projection are in the index)", "Monitor index usage: db.collection.aggregate([{$indexStats:{}}])", "Drop unused indexes — they slow down writes and consume memory"] } },
        { type: "heading", data: { level: 2, text: "Aggregation Optimization" } },
        { type: "list", data: { style: "bullet", items: ["Place $match and $sort early in the pipeline to use indexes", "Use $project early to reduce document size flowing through pipeline", "Use $limit early when you only need a few results", "Place $lookup as late as possible to minimize joined documents"] } },
        { type: "heading", data: { level: 2, text: "MongoDB Profiler" } },
        { type: "code", data: { language: "javascript", code: "// Enable profiling (0=off, 1=slow queries, 2=all)\ndb.setProfilingLevel(1, { slowms: 100 })\n\n// View slow queries\ndb.system.profile.find().sort({ ts: -1 }).limit(10)" } },
        { type: "info", data: { title: "Working Set", text: "The working set is the data and indexes MongoDB actively accesses. If it fits in RAM, reads are served from memory (fast). If it exceeds RAM, MongoDB reads from disk (slow). Always ensure your working set fits in available RAM." } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Covered queries serve data entirely from indexes — no document reads", "Use .explain('executionStats') to diagnose COLLSCAN vs IXSCAN", "Drop unused indexes — each one slows writes and consumes RAM", "$match early in aggregation pipeline enables index usage", "The profiler (slowms threshold) identifies real-world slow queries"] } },
        { type: "quiz", data: { question: "What is a 'covered query' in MongoDB?", options: ["A query protected by authentication", "A query where all fields can be satisfied from the index alone, without reading documents", "A query hidden from the profiler", "A query with error handling"], correctIndex: 1, explanation: "A covered query has all its queried and projected fields included in an index. MongoDB can answer the query using only the index B-tree, without touching the actual documents — making it the fastest possible query execution." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 14 — Backup & Restore
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Backup & Restore", 14, [
    {
      title: "mongodump, mongoexport & Atlas Automated Backups",
      slug: "mongodb-backup-restore",
      order: 1,
      estimatedReadTime: 8,
      summary: "Back up and restore MongoDB with mongodump/mongorestore, export with mongoexport, and use Atlas automated backups.",
      content: [
        { type: "heading", data: { level: 2, text: "Why Backup?" } },
        { type: "paragraph", data: { text: "Data loss can occur due to hardware failures, accidental deletions, bugs, or ransomware attacks. Regular backups are essential for any production MongoDB deployment." } },
        { type: "heading", data: { level: 2, text: "mongodump & mongorestore" } },
        { type: "code", data: { language: "bash", code: "# Backup — entire database\nmongodump --out /backup/$(date +%Y%m%d)\n\n# Backup — specific database\nmongodump --db myapp --out /backup/myapp\n\n# Backup from Atlas\nmongodump --uri 'mongodb+srv://user:pass@cluster.mongodb.net/myapp' --out /backup\n\n# Restore — entire dump\nmongorestore /backup/20240115\n\n# Restore — with drop (replaces existing data)\nmongorestore --drop --db myapp /backup/myapp" } },
        { type: "heading", data: { level: 2, text: "mongoexport & mongoimport (JSON/CSV)" } },
        { type: "code", data: { language: "bash", code: "# Export collection to JSON\nmongoexport --db myapp --collection users --out users.json\n\n# Export collection to CSV\nmongoexport --db myapp --collection users --type csv --fields name,email --out users.csv\n\n# Import from JSON\nmongoimport --db myapp --collection users --file users.json" } },
        { type: "info", data: { title: "mongodump vs mongoexport", text: "mongodump creates binary BSON backups — use for full backup/restore. mongoexport creates human-readable JSON/CSV — use for data migration or analysis. mongodump preserves all BSON types; mongoexport may lose some type info." } },
        { type: "heading", data: { level: 2, text: "Automated Backup Script" } },
        { type: "code", data: { language: "bash", code: "#!/bin/bash\n# backup.sh\nDATE=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR='/var/backups/mongodb'\n\nmongodump --uri $MONGO_URI --out $BACKUP_DIR/$DATE\n\n# Delete backups older than 7 days\nfind $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +\n\necho \"Backup completed: $BACKUP_DIR/$DATE\"\n\n# Add to crontab: 0 2 * * * /path/to/backup.sh >> /var/log/mongodb-backup.log 2>&1" } },
        { type: "heading", data: { level: 2, text: "Backup Best Practices" } },
        { type: "list", data: { style: "bullet", items: ["Automate backups with cron jobs (Linux) or Task Scheduler (Windows)", "Store backups offsite (S3, Google Cloud Storage)", "Test your restore process regularly — an untested backup is not a backup", "Use Atlas automated backups with point-in-time recovery for production", "Retain backups for at least 7 days; longer for compliance"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["mongodump creates binary BSON backups; mongorestore restores them", "mongoexport creates human-readable JSON/CSV for migration or analysis", "--drop in mongorestore replaces existing collections before restoring", "Atlas provides automated backups with point-in-time recovery", "Always test your restore process — never assume backups work until verified"] } },
        { type: "quiz", data: { question: "Which tool creates a binary backup of MongoDB data?", options: ["mongoexport", "mongobackup", "mongodump", "mongosave"], correctIndex: 2, explanation: "mongodump creates binary BSON backups that preserve all MongoDB-specific data types. It's the standard tool for database backups that can be restored with mongorestore." } },
      ],
    },
  ]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 15 — Security Basics
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Security Basics", 15, [
    {
      title: "Authentication, RBAC, Network Security & Injection Prevention",
      slug: "mongodb-security-basics",
      order: 1,
      estimatedReadTime: 10,
      summary: "Secure MongoDB with authentication, role-based access control, network binding, TLS encryption, and NoSQL injection prevention.",
      content: [
        { type: "heading", data: { level: 2, text: "Authentication" } },
        { type: "code", data: { language: "javascript", code: "// Create admin user\nuse admin\ndb.createUser({\n  user: 'admin',\n  pwd: 'strong_password_here',\n  roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']\n})\n\n// Create application-specific user (least privilege)\nuse myapp\ndb.createUser({\n  user: 'appuser',\n  pwd: 'app_password',\n  roles: [{ role: 'readWrite', db: 'myapp' }]\n})" } },
        { type: "heading", data: { level: 2, text: "Role-Based Access Control (RBAC)" } },
        { type: "table", data: { headers: ["Role", "Permissions"], rows: [["read", "Can read any data in the database"], ["readWrite", "Can read and write data"], ["dbAdmin", "Can perform administrative tasks"], ["userAdmin", "Can manage users and roles"], ["clusterAdmin", "Full cluster-level access"], ["readAnyDatabase", "Read access to all databases"]] } },
        { type: "heading", data: { level: 2, text: "Network Security" } },
        { type: "code", data: { language: "yaml", code: "# mongod.conf — Bind to specific IPs only\nnet:\n  bindIp: 127.0.0.1,10.0.0.5  # NEVER use 0.0.0.0 in production\n  port: 27017\nsecurity:\n  authorization: enabled" } },
        { type: "warning", data: { title: "Never Expose MongoDB to the Internet", text: "NEVER bind MongoDB to 0.0.0.0 in production — this exposes it on all network interfaces including the public internet. Always use a VPN or SSH tunnel for remote access." } },
        { type: "heading", data: { level: 2, text: "Encryption" } },
        { type: "list", data: { style: "bullet", items: ["Encryption at Rest: Use MongoDB Enterprise or Atlas to encrypt data files on disk", "Encryption in Transit: Use TLS/SSL for all connections to prevent eavesdropping", "Field-Level Encryption: Encrypt specific sensitive fields client-side (e.g., SSN, credit cards)"] } },
        { type: "heading", data: { level: 2, text: "Preventing NoSQL Injection" } },
        { type: "code", data: { language: "javascript", code: "// ❌ VULNERABLE — user input directly in query\napp.get('/user', (req, res) => {\n  db.users.findOne({ username: req.query.username });\n  // Attacker sends: ?username[$ne]=xxx → bypasses authentication!\n});\n\n// ✅ SAFE — validate input type first\nconst { username } = req.query;\nif (typeof username !== 'string') return res.status(400).json({ error: 'Invalid' });\nawait User.findOne({ username }); // Mongoose casts to string, neutralizing operators" } },
        { type: "heading", data: { level: 2, text: "Security Checklist for Production" } },
        { type: "list", data: { style: "ordered", items: ["Enable authentication (security.authorization: enabled in mongod.conf)", "Create separate users per application with minimum required roles", "Bind to specific IPs only — never 0.0.0.0", "Enable TLS/SSL for all connections", "Place MongoDB behind a firewall — no public internet access", "Use strong, unique passwords and rotate them regularly", "Keep MongoDB version updated to latest stable", "Enable audit logging for compliance"] } },
        { type: "keyPoints", data: { title: "Key Takeaways", points: ["Always enable authentication — security.authorization: enabled", "Principle of least privilege: grant only the minimum permissions needed", "Never bind to 0.0.0.0 in production — use specific IPs or VPN", "Validate all user input types before using in queries to prevent NoSQL injection", "Mongoose helps prevent injection by casting values to schema-defined types"] } },
        { type: "quiz", data: { question: "What does enabling security.authorization in mongod.conf do?", options: ["Encrypts the database files", "Requires authentication for all database connections", "Enables network encryption", "Disables external connections"], correctIndex: 1, explanation: "security.authorization: enabled requires all database connections to authenticate with valid credentials before accessing any data. Without this setting, anyone who can reach the MongoDB port has full access." } },
      ],
    },
  ]);

  console.log("\n🎉  MongoDB course seeded successfully!");
  console.log(`    Chapters: 15 | Lessons: ~20`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
