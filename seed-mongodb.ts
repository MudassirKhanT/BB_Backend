/**
 * Seed the MongoDB – Complete Database Course (exact content, 15 chapters, 5 quizzes each).
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
  if (!instructor) { console.error("❌  No instructor found — run seed.ts first."); process.exit(1); }

  // ── Drop existing course + all topics/subtopics ───────────────────────────
  const old = await Course.findOne({ slug: "mongodb-complete-course" });
  if (old) {
    const topics = await Topic.find({ course: old._id });
    for (const t of topics) await Subtopic.deleteMany({ topic: t._id });
    await Topic.deleteMany({ course: old._id });
    await Course.deleteOne({ _id: old._id });
    console.log("🗑️   Removed existing MongoDB course — re-seeding fresh...");
  }

  const course = await Course.create({
    title: "MongoDB – Complete Database Course",
    slug: "mongodb-complete-course",
    description: "A comprehensive guide to MongoDB — the world's most popular NoSQL database. Covers installation, CRUD operations, querying, aggregation, indexing, schema design, Mongoose integration, performance optimization, and security.",
    shortDescription: "Master MongoDB from scratch — CRUD, aggregation pipelines, indexing, schema design, Mongoose, and production best practices.",
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

  async function createChapter(title: string, order: number, lessons: Array<{ title: string; slug: string; order: number; isFreePreview?: boolean; estimatedReadTime: number; summary: string; content: Block[]; }>) {
    const topic = await Topic.create({ title, course: course._id, order });
    for (const lesson of lessons) await Subtopic.create({ ...lesson, topic: topic._id, isFreePreview: lesson.isFreePreview ?? false });
    console.log(`  ✅  Chapter ${order}: ${title} (${lessons.length} lesson${lessons.length > 1 ? "s" : ""})`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — Introduction to NoSQL & MongoDB
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Introduction to NoSQL & MongoDB", 1, [{
    title: "Introduction to NoSQL & MongoDB",
    slug: "intro-nosql-mongodb",
    order: 1, isFreePreview: true, estimatedReadTime: 10,
    summary: "Understand the NoSQL paradigm, how MongoDB differs from SQL databases, key concepts, and when to use MongoDB.",
    content: [
      { type: "heading", data: { level: 2, text: "1.1 What is NoSQL?" } },
      { type: "paragraph", data: { text: "NoSQL (Not Only SQL) databases are non-relational databases designed to handle unstructured, semi-structured, and polymorphic data. They emerged to address the limitations of traditional relational databases (RDBMS) when dealing with large-scale web applications." } },
      { type: "list", data: { style: "bullet", items: ["Document Stores: MongoDB, CouchDB — data stored as JSON-like documents", "Key-Value Stores: Redis, DynamoDB — simple key-value pairs", "Column-family: Cassandra, HBase — optimized for wide-column queries", "Graph Databases: Neo4j, Amazon Neptune — optimized for relationships"] } },
      { type: "heading", data: { level: 2, text: "1.2 SQL vs NoSQL" } },
      { type: "table", data: { headers: ["Feature", "SQL (e.g., MySQL)", "NoSQL (MongoDB)"], rows: [["Data Format", "Rows and columns (tables)", "Documents (JSON/BSON)"], ["Schema", "Rigid, predefined schema", "Flexible, dynamic schema"], ["Relationships", "JOINs between tables", "Embedding or referencing"], ["Scaling", "Vertical (scale up)", "Horizontal (scale out)"], ["ACID", "Full ACID transactions", "Multi-doc transactions (v4.0+)"], ["Best For", "Complex queries, financial data", "Flexible data, rapid dev, large scale"]] } },
      { type: "heading", data: { level: 2, text: "1.3 What is MongoDB?" } },
      { type: "paragraph", data: { text: "MongoDB is a document-oriented NoSQL database released in 2009. It stores data as BSON (Binary JSON) documents within collections, rather than rows in tables. MongoDB is horizontally scalable, uses a flexible schema, and provides a powerful query language." } },
      { type: "heading", data: { level: 2, text: "1.4 Key MongoDB Concepts" } },
      { type: "list", data: { style: "bullet", items: ["Database: A container for collections (like a SQL database)", "Collection: A group of documents (like a SQL table)", "Document: A single record in JSON-like format (like a SQL row)", "Field: A key-value pair inside a document (like a SQL column)", "_id: A unique identifier automatically added to every document"] } },
      { type: "heading", data: { level: 2, text: "1.5 When to Use MongoDB" } },
      { type: "list", data: { style: "bullet", items: ["Content management systems (CMS) with varying content types", "E-commerce with diverse product attributes", "Real-time analytics and logging", "Mobile applications requiring offline sync", "IoT data storage with varying sensor data formats"] } },
      { type: "heading", data: { level: 2, text: "1.6 MongoDB vs MySQL Terminology" } },
      { type: "table", data: { headers: ["MySQL", "MongoDB"], rows: [["Database", "Database"], ["Table", "Collection"], ["Row", "Document"], ["Column", "Field"], ["Primary Key", "_id"], ["JOIN", "Embedding / $lookup"]] } },
      { type: "heading", data: { level: 2, text: "1.7 Summary" } },
      { type: "paragraph", data: { text: "NoSQL databases offer flexibility and scalability over traditional relational databases. MongoDB is the most popular NoSQL database, storing data as BSON documents in collections. Understanding when to use MongoDB vs SQL is key to good architectural decisions." } },
      { type: "quiz", data: { question: "What does NoSQL stand for?", options: ["No Standard Query Language", "Not Only SQL", "Non-Standard SQL", "New Open SQL"], correctIndex: 1, explanation: "NoSQL stands for 'Not Only SQL'. It refers to non-relational databases that can handle various data models beyond the traditional table-based relational model." } },
      { type: "quiz", data: { question: "What is the MongoDB equivalent of a SQL table?", options: ["Document", "Record", "Collection", "Database"], correctIndex: 2, explanation: "A Collection in MongoDB is equivalent to a table in SQL. It is a group of MongoDB documents, just as a table is a group of rows." } },
      { type: "quiz", data: { question: "What format does MongoDB use to store data internally?", options: ["XML", "CSV", "JSON", "BSON"], correctIndex: 3, explanation: "MongoDB stores data as BSON (Binary JSON) — a binary representation of JSON that supports additional data types like ObjectId, Date, and Binary." } },
      { type: "quiz", data: { question: "Which of the following is a good use case for MongoDB?", options: ["Banking transactions requiring strict ACID compliance", "E-commerce with diverse product attributes needing flexible schema", "Complex multi-table reporting queries", "A small fixed-schema application"], correctIndex: 1, explanation: "E-commerce with diverse product attributes is ideal for MongoDB because different products can have different fields, which fits MongoDB's flexible schema perfectly." } },
      { type: "quiz", data: { question: "What is the unique identifier field automatically added to every MongoDB document?", options: ["id", "uuid", "_id", "docId"], correctIndex: 2, explanation: "MongoDB automatically adds an _id field to every document if not provided. It contains a unique ObjectId that identifies the document within its collection." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — Installation & Setup
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Installation & Setup", 2, [{
    title: "Installing MongoDB, Compass, mongosh & Atlas",
    slug: "mongodb-installation-setup",
    order: 1, isFreePreview: true, estimatedReadTime: 8,
    summary: "Install MongoDB locally on macOS, Linux, or Windows; use MongoDB Compass GUI; work with mongosh; and connect to Atlas cloud.",
    content: [
      { type: "heading", data: { level: 2, text: "2.1 Installing MongoDB Community Edition" } },
      { type: "heading", data: { level: 3, text: "On macOS (using Homebrew)" } },
      { type: "code", data: { language: "bash", code: "brew tap mongodb/brew\nbrew install mongodb-community@7.0\nbrew services start mongodb-community@7.0" } },
      { type: "heading", data: { level: 3, text: "On Ubuntu/Debian Linux" } },
      { type: "code", data: { language: "bash", code: "curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor\necho 'deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list\nsudo apt update && sudo apt install -y mongodb-org\nsudo systemctl start mongod\nsudo systemctl enable mongod" } },
      { type: "heading", data: { level: 3, text: "On Windows" } },
      { type: "list", data: { style: "ordered", items: ["Download MongoDB Community Server from https://www.mongodb.com/try/download/community", "Run the .msi installer", "Install MongoDB Compass (GUI tool) when prompted", "MongoDB runs as a Windows service automatically"] } },
      { type: "heading", data: { level: 2, text: "2.2 MongoDB Compass (GUI)" } },
      { type: "paragraph", data: { text: "MongoDB Compass is the official graphical interface for MongoDB. It lets you visually browse your data, run queries, create indexes, and analyze performance — without writing shell commands. Download from: https://www.mongodb.com/products/compass. Connect with the default URI: mongodb://localhost:27017" } },
      { type: "heading", data: { level: 2, text: "2.3 MongoDB Shell (mongosh)" } },
      { type: "paragraph", data: { text: "mongosh is the modern MongoDB shell for interactive database access. It replaces the older 'mongo' shell." } },
      { type: "code", data: { language: "bash", code: "# Start mongosh\nmongosh\n\n# Connect to a specific database\nmongosh 'mongodb://localhost:27017/mydb'\n\n# Show all databases\nshow dbs\n\n# Switch to / create a database\nuse myapp\n\n# Show current database\ndb\n\n# Show collections\nshow collections" } },
      { type: "heading", data: { level: 2, text: "2.4 MongoDB Atlas (Cloud)" } },
      { type: "paragraph", data: { text: "MongoDB Atlas is MongoDB's cloud-hosted database service. It provides a free tier (512MB) perfect for learning and development." } },
      { type: "list", data: { style: "ordered", items: ["Go to https://www.mongodb.com/cloud/atlas", "Create a free account", "Create a free M0 cluster", "Add your IP address to the IP allowlist", "Create a database user", "Get your connection string: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/"] } },
      { type: "heading", data: { level: 2, text: "2.5 Summary" } },
      { type: "paragraph", data: { text: "MongoDB can be installed locally (macOS, Linux, Windows) or used via Atlas (cloud). MongoDB Compass provides a GUI, while mongosh provides interactive shell access. Atlas is recommended for production and learning." } },
      { type: "quiz", data: { question: "What is MongoDB Compass?", options: ["A command-line tool", "The official GUI for MongoDB", "A cloud hosting service", "A data migration tool"], correctIndex: 1, explanation: "MongoDB Compass is the official graphical user interface for MongoDB that allows you to visually explore data, run queries, analyze performance, and manage indexes without using the command line." } },
      { type: "quiz", data: { question: "What does 'use myapp' do in mongosh?", options: ["Installs myapp", "Switches to or creates the myapp database", "Lists the myapp collection", "Imports the myapp schema"], correctIndex: 1, explanation: "'use myapp' switches the current context to the myapp database. If the database doesn't exist yet, MongoDB creates it when you first insert data." } },
      { type: "quiz", data: { question: "What is MongoDB Atlas?", options: ["A desktop GUI tool", "MongoDB's cloud-hosted database service", "An ORM for MongoDB", "The MongoDB command-line shell"], correctIndex: 1, explanation: "MongoDB Atlas is MongoDB's fully managed cloud database service. It handles infrastructure, backups, scaling, and security. It offers a free M0 tier perfect for learning and development." } },
      { type: "quiz", data: { question: "What is the default MongoDB port?", options: ["3306", "5432", "27017", "8080"], correctIndex: 2, explanation: "MongoDB runs on port 27017 by default. This is the port used in connection strings like mongodb://localhost:27017." } },
      { type: "quiz", data: { question: "Which command shows all databases in mongosh?", options: ["list databases", "show databases", "show dbs", "db.list()"], correctIndex: 2, explanation: "'show dbs' is the mongosh command to list all databases on the current MongoDB server along with their sizes." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — MongoDB Architecture
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("MongoDB Architecture", 3, [{
    title: "MongoDB Architecture – Storage, Documents, Replica Sets & Sharding",
    slug: "mongodb-architecture",
    order: 1, estimatedReadTime: 10,
    summary: "Explore WiredTiger storage, BSON documents, ObjectId, replica sets for high availability, and sharding for horizontal scaling.",
    content: [
      { type: "heading", data: { level: 2, text: "3.1 MongoDB Storage Architecture" } },
      { type: "paragraph", data: { text: "MongoDB uses the WiredTiger storage engine by default (since v3.2). WiredTiger provides document-level concurrency control, compression, and encryption." } },
      { type: "list", data: { style: "bullet", items: ["Data Files: Stored in the dbPath directory (default: /var/lib/mongodb on Linux)", "Journal: Write-ahead log for crash recovery", "Oplog: Operations log used for replication"] } },
      { type: "heading", data: { level: 2, text: "3.2 Documents" } },
      { type: "paragraph", data: { text: "A MongoDB document is the basic unit of data, equivalent to a row in SQL. Documents are stored as BSON (Binary JSON) — a binary representation of JSON that supports more data types." } },
      { type: "code", data: { language: "javascript", code: "{\n  _id: ObjectId('64a1b2c3d4e5f6789012345'),\n  name: 'Alice Johnson',\n  email: 'alice@example.com',\n  age: 28,\n  address: {\n    street: '123 Main St',\n    city: 'New York',\n    country: 'USA'\n  },\n  hobbies: ['reading', 'coding', 'hiking'],\n  createdAt: ISODate('2024-01-15T10:30:00Z')\n}" } },
      { type: "heading", data: { level: 2, text: "3.3 ObjectId" } },
      { type: "paragraph", data: { text: "The _id field is automatically added to every document with a unique ObjectId. An ObjectId is a 12-byte BSON type:" } },
      { type: "list", data: { style: "bullet", items: ["4 bytes: Unix timestamp (seconds since epoch)", "5 bytes: Random value unique to the machine and process", "3 bytes: Incrementing counter"] } },
      { type: "code", data: { language: "javascript", code: "const id = new ObjectId();\nconsole.log(id.toString());     // '64a1b2c3d4e5f6789012345'\nconsole.log(id.getTimestamp()); // Creation time" } },
      { type: "heading", data: { level: 2, text: "3.4 Replica Sets" } },
      { type: "paragraph", data: { text: "A replica set is a group of MongoDB instances that maintain the same data set. It provides high availability and data redundancy." } },
      { type: "list", data: { style: "bullet", items: ["Primary: Receives all write operations", "Secondary: Replicates data from primary. Can serve reads", "Arbiter: Votes in elections but holds no data", "If the primary fails, an election is held and a secondary is automatically promoted to primary"] } },
      { type: "heading", data: { level: 2, text: "3.5 Sharding" } },
      { type: "paragraph", data: { text: "Sharding distributes data across multiple machines (shards), enabling horizontal scaling for very large datasets. Each shard holds a subset of the data, and a mongos router directs queries to the correct shard." } },
      { type: "heading", data: { level: 2, text: "3.6 BSON Data Types" } },
      { type: "table", data: { headers: ["BSON Type", "JavaScript Type", "Example"], rows: [["ObjectId", "ObjectId", "ObjectId('...')"], ["String", "string", "'Hello World'"], ["Integer (32/64-bit)", "number", "42"], ["Double", "number", "3.14"], ["Boolean", "boolean", "true"], ["Date", "Date", "new Date()"], ["Array", "Array", "[1, 2, 3]"], ["Object", "Object", "{ key: value }"], ["Null", "null", "null"], ["Binary Data", "Buffer", "Binary files"]] } },
      { type: "quiz", data: { question: "What storage engine does MongoDB use by default?", options: ["MMAPv1", "RocksDB", "WiredTiger", "InnoDB"], correctIndex: 2, explanation: "WiredTiger has been MongoDB's default storage engine since version 3.2. It provides document-level concurrency control, compression, and encryption at rest." } },
      { type: "quiz", data: { question: "How many bytes is a MongoDB ObjectId?", options: ["4", "8", "12", "16"], correctIndex: 2, explanation: "A MongoDB ObjectId is 12 bytes: 4 bytes for Unix timestamp, 5 bytes for a random machine/process value, and 3 bytes for an incrementing counter." } },
      { type: "quiz", data: { question: "What is the role of the Primary in a replica set?", options: ["Votes in elections only", "Receives all write operations", "Serves read-only queries", "Holds no data"], correctIndex: 1, explanation: "The Primary node in a replica set is the only node that receives all write operations. Secondaries replicate from the primary and can optionally serve reads." } },
      { type: "quiz", data: { question: "What is sharding used for?", options: ["Encrypting data", "Backing up data", "Distributing data across multiple machines for horizontal scaling", "Replicating data for high availability"], correctIndex: 2, explanation: "Sharding enables horizontal scaling by distributing data across multiple machines (shards). Each shard holds a portion of the data, and a mongos router directs queries to the correct shard." } },
      { type: "quiz", data: { question: "What does BSON stand for?", options: ["Basic Standard Object Notation", "Binary JSON", "Boolean Standard Object Notation", "Built-in Serialized Object Notation"], correctIndex: 1, explanation: "BSON stands for Binary JSON. It is a binary-encoded serialization of JSON-like documents that extends JSON with additional data types like ObjectId, Date, and binary data." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — CRUD Operations
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("CRUD Operations", 4, [{
    title: "CRUD Operations – Create, Read, Update & Delete",
    slug: "mongodb-crud-operations",
    order: 1, isFreePreview: true, estimatedReadTime: 14,
    summary: "Master all CRUD operations: insertOne/insertMany, find/findOne with projection and pagination, updateOne/updateMany with operators, and deleteOne/deleteMany.",
    content: [
      { type: "heading", data: { level: 2, text: "4.1 Overview of CRUD" } },
      { type: "paragraph", data: { text: "CRUD stands for Create, Read, Update, Delete — the four fundamental operations for working with data. In MongoDB, these map to: insertOne/insertMany, find/findOne, updateOne/updateMany, and deleteOne/deleteMany." } },
      { type: "heading", data: { level: 2, text: "4.2 Create – Inserting Documents" } },
      { type: "code", data: { language: "javascript", code: "// insertOne()\ndb.users.insertOne({\n  name: 'Alice',\n  email: 'alice@example.com',\n  age: 28,\n  city: 'New York'\n})\n// Returns: { acknowledged: true, insertedId: ObjectId('...') }\n\n// insertMany()\ndb.users.insertMany([\n  { name: 'Bob',   email: 'bob@example.com',   age: 32, city: 'London' },\n  { name: 'Carol', email: 'carol@example.com', age: 25, city: 'Tokyo'  },\n  { name: 'Dave',  email: 'dave@example.com',  age: 35, city: 'Paris'  }\n])" } },
      { type: "heading", data: { level: 2, text: "4.3 Read – Querying Documents" } },
      { type: "code", data: { language: "javascript", code: "// Get all documents\ndb.users.find()\n\n// Filter by a field\ndb.users.find({ city: 'New York' })\n\n// Filter multiple fields\ndb.users.find({ city: 'New York', age: 28 })\n\n// findOne – get single document\ndb.users.findOne({ email: 'alice@example.com' })\n\n// Projection – return only name and email (1=include, 0=exclude)\ndb.users.find({}, { name: 1, email: 1, _id: 0 })\n\n// Sort by age descending, get first 5\ndb.users.find().sort({ age: -1 }).limit(5)\n\n// Pagination: skip 10, get next 10\ndb.users.find().skip(10).limit(10)" } },
      { type: "heading", data: { level: 2, text: "4.4 Update – Modifying Documents" } },
      { type: "code", data: { language: "javascript", code: "// updateOne()\ndb.users.updateOne(\n  { email: 'alice@example.com' },         // filter\n  { $set: { age: 29, city: 'Boston' } }    // update\n)\n\n// updateMany()\ndb.users.updateMany(\n  { city: 'New York' },\n  { $set: { country: 'USA' } }\n)\n\n// Upsert – insert if not found\ndb.users.updateOne(\n  { email: 'new@example.com' },\n  { $set: { name: 'New User', age: 20 } },\n  { upsert: true }\n)\n\n// replaceOne() – replace entire document (keep only _id)\ndb.users.replaceOne(\n  { email: 'alice@example.com' },\n  { name: 'Alice Updated', email: 'alice@example.com', age: 30 }\n)" } },
      { type: "heading", data: { level: 2, text: "4.5 Delete – Removing Documents" } },
      { type: "code", data: { language: "javascript", code: "// deleteOne()\ndb.users.deleteOne({ email: 'alice@example.com' })\n\n// deleteMany() – delete all users from New York\ndb.users.deleteMany({ city: 'New York' })\n\n// Delete ALL documents in collection (use with caution!)\ndb.users.deleteMany({})" } },
      { type: "heading", data: { level: 2, text: "4.6 Bulk Operations" } },
      { type: "code", data: { language: "javascript", code: "db.users.bulkWrite([\n  { insertOne: { document: { name: 'Eve', age: 22 } } },\n  { updateOne: { filter: { name: 'Bob' }, update: { $set: { age: 33 } } } },\n  { deleteOne: { filter: { name: 'Dave' } } }\n])" } },
      { type: "quiz", data: { question: "Which method inserts a single document into a collection?", options: ["db.collection.insert()", "db.collection.insertOne()", "db.collection.add()", "db.collection.create()"], correctIndex: 1, explanation: "db.collection.insertOne() is the method to insert a single document. It returns an object with acknowledged: true and the insertedId of the new document." } },
      { type: "quiz", data: { question: "What does { $set: { age: 30 } } do in an update operation?", options: ["Replaces the entire document", "Sets the age field to 30 without affecting other fields", "Increments age by 30", "Deletes the age field"], correctIndex: 1, explanation: "$set is an update operator that modifies only the specified fields. Other fields in the document remain unchanged — unlike replaceOne() which replaces the whole document." } },
      { type: "quiz", data: { question: "What does upsert: true do?", options: ["Always inserts a new document", "Inserts a document if no matching document is found", "Updates without a filter", "Prevents updates to existing documents"], correctIndex: 1, explanation: "upsert: true tells MongoDB: if a document matching the filter exists, update it; if not, insert a new document combining the filter and update fields." } },
      { type: "quiz", data: { question: "What is the difference between updateOne() and replaceOne()?", options: ["No difference", "updateOne modifies specified fields; replaceOne replaces the entire document", "replaceOne is faster", "updateOne works on multiple documents"], correctIndex: 1, explanation: "updateOne() with $set modifies only specified fields, leaving others intact. replaceOne() replaces the entire document body (only _id is preserved), removing any fields not in the replacement." } },
      { type: "quiz", data: { question: "How do you get only 10 documents starting from the 20th record?", options: ["db.col.find().limit(10).offset(20)", "db.col.find().skip(20).limit(10)", "db.col.find().start(20).end(30)", "db.col.find({ skip: 20, limit: 10 })"], correctIndex: 1, explanation: "Use .skip(20).limit(10) for pagination — skip the first 20 documents, then return the next 10. This is the standard MongoDB pagination pattern." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Data Types & Documents
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Data Types & Documents", 5, [{
    title: "BSON Data Types – String, Number, Date, Array, Embedded Docs",
    slug: "mongodb-data-types",
    order: 1, estimatedReadTime: 10,
    summary: "Master all BSON data types: strings, numbers, booleans, dates, arrays, embedded documents, null, ObjectId, and regular expressions.",
    content: [
      { type: "heading", data: { level: 2, text: "5.1 BSON Data Types" } },
      { type: "paragraph", data: { text: "MongoDB uses BSON (Binary JSON) which extends JSON with additional data types. Understanding these types is important for schema design and querying." } },
      { type: "heading", data: { level: 2, text: "5.2 String" } },
      { type: "code", data: { language: "javascript", code: "{ name: 'Alice', description: 'A sample string' }\n// Strings are UTF-8 encoded. Always use strings for text data." } },
      { type: "heading", data: { level: 2, text: "5.3 Numbers" } },
      { type: "code", data: { language: "javascript", code: "{\n  age: 28,                           // 32-bit integer\n  price: 99.99,                       // 64-bit double (default)\n  population: NumberLong(8000000000)  // 64-bit integer\n}" } },
      { type: "heading", data: { level: 2, text: "5.4 Boolean" } },
      { type: "code", data: { language: "javascript", code: "{ isActive: true, isDeleted: false }" } },
      { type: "heading", data: { level: 2, text: "5.5 Date" } },
      { type: "code", data: { language: "javascript", code: "{\n  createdAt: new Date(),                      // Current datetime\n  updatedAt: ISODate('2024-01-15T10:30:00Z'),\n  birthday: new Date('1996-05-20')\n}" } },
      { type: "warning", data: { title: "Always Use Date Objects", text: "Always store dates as Date objects, never as strings. This enables date comparison operators ($gt, $lt, $gte, $lte) and date aggregation functions ($year, $month, $dayOfMonth)." } },
      { type: "heading", data: { level: 2, text: "5.6 Arrays" } },
      { type: "code", data: { language: "javascript", code: "{\n  tags:   ['javascript', 'nodejs', 'mongodb'],\n  scores: [95, 87, 92],\n  addresses: [\n    { type: 'home', city: 'New York' },\n    { type: 'work', city: 'Boston'   }\n  ]\n}" } },
      { type: "heading", data: { level: 2, text: "5.7 Embedded Documents (Objects)" } },
      { type: "code", data: { language: "javascript", code: "{\n  name: 'Alice',\n  address: {\n    street: '123 Main St',\n    city: 'New York',\n    state: 'NY',\n    zipCode: '10001'\n  }\n}\n\n// Query embedded document fields using dot notation:\ndb.users.find({ 'address.city': 'New York' })" } },
      { type: "heading", data: { level: 2, text: "5.8 Null and Undefined" } },
      { type: "code", data: { language: "javascript", code: "{ middleName: null }   // Field exists with null value\n\n// Find documents where field is null OR field doesn't exist\ndb.users.find({ middleName: null })" } },
      { type: "heading", data: { level: 2, text: "5.9 ObjectId" } },
      { type: "code", data: { language: "javascript", code: "{\n  _id: ObjectId('64a1b2c3d4e5f6789012345'),\n  userId: ObjectId('507f191e810c19729de860ea')\n}" } },
      { type: "heading", data: { level: 2, text: "5.10 Regular Expressions" } },
      { type: "code", data: { language: "javascript", code: "// Find users whose name starts with 'A'\ndb.users.find({ name: /^A/i })\n\n// Find users whose email contains 'gmail'\ndb.users.find({ email: /gmail/i })" } },
      { type: "quiz", data: { question: "Which data type should you use to store dates in MongoDB?", options: ["String ('2024-01-15')", "Number (Unix timestamp)", "Date object (new Date())", "Either string or number"], correctIndex: 2, explanation: "Always use Date objects. They enable MongoDB's date comparison operators ($gt, $lt), date arithmetic, and aggregation operators like $year and $month. Strings cannot be compared as dates properly." } },
      { type: "quiz", data: { question: "How do you query a nested field 'address.city' in MongoDB?", options: ["{ address: { city: 'NY' } }", "{ 'address.city': 'NY' }", "{ address.city: 'NY' }", "{ address[city]: 'NY' }"], correctIndex: 1, explanation: "Dot notation with quoted string '{ \\'address.city\\': \\'NY\\' }' is the correct way to query embedded document fields. Without quotes, it's a syntax error in JavaScript." } },
      { type: "quiz", data: { question: "What is the difference between { field: null } and a missing field?", options: ["No difference", "{ field: null } finds docs where field is null or missing; they behave similarly in find()", "null always means deleted", "Missing fields are treated as 0"], correctIndex: 1, explanation: "In a find() query, { field: null } matches documents where the field is explicitly set to null AND documents where the field doesn't exist at all. Use $exists to differentiate." } },
      { type: "quiz", data: { question: "Which BSON type stores binary data?", options: ["Buffer", "String", "BinData", "Blob"], correctIndex: 2, explanation: "BinData is the BSON type for storing binary data (images, files, encrypted data). In JavaScript drivers, it's typically represented as a Buffer." } },
      { type: "quiz", data: { question: "What syntax finds documents where a name starts with 'Al' (case-insensitive)?", options: ["{ name: 'Al*' }", "{ name: { $startsWith: 'Al' } }", "{ name: /^Al/i }", "{ name: { $regex: 'Al', $options: 'start' } }"], correctIndex: 2, explanation: "MongoDB uses JavaScript regex syntax. /^Al/i means: starts with (^) 'Al', case-insensitive (i flag). The $regex operator could also work: { name: { $regex: '^Al', $options: 'i' } }." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Collections
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Collections", 6, [{
    title: "Collections – Creating, Capped Collections & Schema Validation",
    slug: "mongodb-collections",
    order: 1, estimatedReadTime: 9,
    summary: "Create collections implicitly or explicitly, use capped collections for logs, enforce schema validation with JSON Schema, and use collection methods.",
    content: [
      { type: "heading", data: { level: 2, text: "6.1 What is a Collection?" } },
      { type: "paragraph", data: { text: "A collection is a group of MongoDB documents, analogous to a table in a relational database. Collections do not enforce a schema by default — documents within a collection can have different fields. However, using a consistent structure (enforced by Mongoose schemas in Node.js) is recommended." } },
      { type: "heading", data: { level: 2, text: "6.2 Creating Collections" } },
      { type: "code", data: { language: "javascript", code: "// Implicit creation (happens when you insert a document)\ndb.products.insertOne({ name: 'Laptop' })\n\n// Explicit creation with options\ndb.createCollection('products', {\n  capped: false,\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['name', 'price'],\n      properties: {\n        name:  { bsonType: 'string' },\n        price: { bsonType: 'number', minimum: 0 }\n      }\n    }\n  }\n})" } },
      { type: "heading", data: { level: 2, text: "6.3 Capped Collections" } },
      { type: "paragraph", data: { text: "Capped collections are fixed-size collections that overwrite the oldest documents when the size limit is reached. Useful for logs and caching." } },
      { type: "code", data: { language: "javascript", code: "db.createCollection('eventLogs', {\n  capped: true,\n  size: 1048576,  // 1MB max size\n  max: 1000       // Max 1000 documents\n})" } },
      { type: "heading", data: { level: 2, text: "6.4 Schema Validation" } },
      { type: "paragraph", data: { text: "MongoDB 3.6+ supports JSON Schema validation, allowing you to enforce field types and required fields at the database level." } },
      { type: "code", data: { language: "javascript", code: "db.runCommand({\n  collMod: 'users',\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['name', 'email'],\n      properties: {\n        name:  { bsonType: 'string', description: 'Must be a string' },\n        email: { bsonType: 'string', pattern: '^.+@.+$' },\n        age:   { bsonType: 'int', minimum: 0, maximum: 150 }\n      }\n    }\n  },\n  validationAction: 'error'  // or 'warn'\n})" } },
      { type: "heading", data: { level: 2, text: "6.5 Collection Methods" } },
      { type: "code", data: { language: "javascript", code: "// Count documents\ndb.users.countDocuments({ city: 'New York' })\n\n// Get distinct values\ndb.users.distinct('city')\n\n// Drop a collection\ndb.users.drop()\n\n// Rename a collection\ndb.users.renameCollection('customers')\n\n// Get collection statistics\ndb.users.stats()" } },
      { type: "quiz", data: { question: "What is a capped collection?", options: ["A collection with a max number of fields", "A fixed-size collection that overwrites oldest documents when full", "An encrypted collection", "A read-only collection"], correctIndex: 1, explanation: "A capped collection has a fixed maximum size. When it's full, it automatically overwrites the oldest documents (like a circular buffer). Ideal for logs, event streams, and caches." } },
      { type: "quiz", data: { question: "Which command counts documents matching a filter?", options: ["db.col.count(filter)", "db.col.countDocuments(filter)", "db.col.length(filter)", "db.col.size(filter)"], correctIndex: 1, explanation: "db.col.countDocuments(filter) is the modern, accurate way to count documents. The older count() method had consistency issues with sharded clusters." } },
      { type: "quiz", data: { question: "What does db.collection.distinct('city') return?", options: ["All city values with duplicates", "An array of unique city values", "The count of unique cities", "Documents grouped by city"], correctIndex: 1, explanation: "distinct() returns an array of unique values for the specified field across all documents in the collection, removing any duplicates." } },
      { type: "quiz", data: { question: "What does validationAction: 'warn' do in schema validation?", options: ["Rejects invalid documents with an error", "Logs a warning but still inserts the invalid document", "Silently ignores invalid documents", "Converts invalid values to valid ones"], correctIndex: 1, explanation: "validationAction: 'warn' allows invalid documents to be inserted but logs a warning message. Use 'error' to strictly reject invalid documents." } },
      { type: "quiz", data: { question: "How is a collection created implicitly in MongoDB?", options: ["Running db.createCollection()", "When you insert the first document into a non-existent collection", "By importing a JSON file", "By defining a schema"], correctIndex: 1, explanation: "MongoDB creates a collection automatically the first time you insert a document into it. You don't need to explicitly create collections, unlike tables in SQL." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 7 — Query Operators
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Query Operators", 7, [{
    title: "Query Operators – Comparison, Logical, Array & Update",
    slug: "mongodb-query-operators",
    order: 1, estimatedReadTime: 12,
    summary: "Use all MongoDB query operators: comparison ($eq, $gt, $in), logical ($and, $or, $not), element ($exists, $type), array ($all, $elemMatch), update ($set, $inc, $push), and text search.",
    content: [
      { type: "heading", data: { level: 2, text: "7.1 Comparison Operators" } },
      { type: "table", data: { headers: ["Operator", "Meaning", "Example"], rows: [["$eq", "Equal", "{ age: { $eq: 25 } }"], ["$ne", "Not equal", "{ status: { $ne: 'inactive' } }"], ["$gt", "Greater than", "{ price: { $gt: 100 } }"], ["$gte", "Greater than or equal", "{ age: { $gte: 18 } }"], ["$lt", "Less than", "{ price: { $lt: 50 } }"], ["$lte", "Less than or equal", "{ age: { $lte: 65 } }"], ["$in", "In an array", "{ city: { $in: ['NYC', 'LA'] } }"], ["$nin", "Not in array", "{ status: { $nin: ['deleted', 'banned'] } }"]] } },
      { type: "heading", data: { level: 2, text: "7.2 Logical Operators" } },
      { type: "code", data: { language: "javascript", code: "// $and - all conditions must be true\ndb.products.find({ $and: [{ price: { $gte: 10 } }, { price: { $lte: 100 } }] })\n\n// $or - at least one condition must be true\ndb.users.find({ $or: [{ city: 'New York' }, { city: 'London' }] })\n\n// $not - negate a condition\ndb.users.find({ age: { $not: { $lt: 18 } } })\n\n// $nor - none of the conditions must be true\ndb.users.find({ $nor: [{ city: 'NYC' }, { status: 'inactive' }] })" } },
      { type: "heading", data: { level: 2, text: "7.3 Element Operators" } },
      { type: "code", data: { language: "javascript", code: "// $exists - check if field exists\ndb.users.find({ middleName: { $exists: true } })\n\n// $type - check field type\ndb.users.find({ age: { $type: 'int' } })\ndb.docs.find({ value: { $type: ['int', 'double'] } })" } },
      { type: "heading", data: { level: 2, text: "7.4 Array Operators" } },
      { type: "code", data: { language: "javascript", code: "// $all - array contains all specified values\ndb.posts.find({ tags: { $all: ['mongodb', 'database'] } })\n\n// $elemMatch - at least one element matches all conditions\ndb.users.find({\n  scores: { $elemMatch: { $gte: 80, $lt: 90 } }\n})\n\n// $size - array has exact number of elements\ndb.users.find({ hobbies: { $size: 3 } })" } },
      { type: "heading", data: { level: 2, text: "7.5 Update Operators" } },
      { type: "code", data: { language: "javascript", code: "// $set – set field values\ndb.users.updateOne({_id: id}, { $set: { name: 'New Name' } })\n\n// $unset – remove a field\ndb.users.updateOne({_id: id}, { $unset: { tempField: '' } })\n\n// $inc – increment a field\ndb.products.updateOne({_id: id}, { $inc: { stock: -1, views: 1 } })\n\n// $push – add element to array\ndb.users.updateOne({_id: id}, { $push: { tags: 'nodejs' } })\n\n// $pull – remove element from array\ndb.users.updateOne({_id: id}, { $pull: { tags: 'nodejs' } })\n\n// $addToSet – add to array only if not already present\ndb.users.updateOne({_id: id}, { $addToSet: { tags: 'mongodb' } })" } },
      { type: "heading", data: { level: 2, text: "7.6 Text Search" } },
      { type: "code", data: { language: "javascript", code: "// First create a text index\ndb.articles.createIndex({ title: 'text', body: 'text' })\n\n// Then search\ndb.articles.find({ $text: { $search: 'mongodb performance' } })\n\n// Sort by relevance score\ndb.articles.find(\n  { $text: { $search: 'mongodb' } },\n  { score: { $meta: 'textScore' } }\n).sort({ score: { $meta: 'textScore' } })" } },
      { type: "quiz", data: { question: "Which operator finds documents where a field value is in a given array?", options: ["$contains", "$in", "$within", "$array"], correctIndex: 1, explanation: "$in checks if the field value matches any element in the provided array. E.g., { city: { $in: ['NYC', 'LA'] } } returns documents where city is 'NYC' or 'LA'." } },
      { type: "quiz", data: { question: "What does { $exists: true } check?", options: ["The field has a non-null value", "The field exists in the document (even if null)", "The field is a required field", "The field has been indexed"], correctIndex: 1, explanation: "$exists: true checks whether the field exists in the document at all, regardless of its value (even null). $exists: false finds documents where the field is absent." } },
      { type: "quiz", data: { question: "Which update operator removes a field from a document?", options: ["$remove", "$delete", "$unset", "$drop"], correctIndex: 2, explanation: "$unset removes the specified field from a document entirely. The value passed to $unset doesn't matter (use empty string ''). After $unset, the field no longer exists in the document." } },
      { type: "quiz", data: { question: "What does $addToSet do differently from $push?", options: ["It adds multiple elements at once", "It adds an element to an array only if it is not already present", "It creates a new array if one doesn't exist", "It adds the element at the beginning"], correctIndex: 1, explanation: "$addToSet adds a value to an array only if it's not already present, preventing duplicates. $push always adds regardless of duplicates. Both create the array if it doesn't exist." } },
      { type: "quiz", data: { question: "Which operator increments a numeric field?", options: ["$add", "$plus", "$increment", "$inc"], correctIndex: 3, explanation: "$inc increments (or decrements with a negative value) a numeric field atomically. E.g., { $inc: { stock: -1, views: 1 } } decrements stock and increments views in one operation." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 8 — Indexing
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Indexing", 8, [{
    title: "Indexing – Types, Creating Indexes & Explain Plans",
    slug: "mongodb-indexing",
    order: 1, estimatedReadTime: 12,
    summary: "Understand index types (single, compound, unique, sparse, TTL, text), create and manage indexes, analyze queries with explain(), and follow best practices.",
    content: [
      { type: "heading", data: { level: 2, text: "8.1 What is an Index?" } },
      { type: "paragraph", data: { text: "An index is a data structure that improves the speed of data retrieval operations. Without an index, MongoDB performs a collection scan — reading every document to find matches. With an index, MongoDB can find data much faster using the index B-tree structure." } },
      { type: "info", data: { title: "Think of a Book Index", text: "An index is like a book's index — instead of reading every page to find a topic, you look it up in the back. MongoDB does the same: look up the index to find matching documents instantly." } },
      { type: "heading", data: { level: 2, text: "8.2 Default _id Index" } },
      { type: "paragraph", data: { text: "MongoDB automatically creates a unique index on the _id field for every collection. This cannot be dropped." } },
      { type: "heading", data: { level: 2, text: "8.3 Creating Indexes" } },
      { type: "code", data: { language: "javascript", code: "// Single field index (1=ascending, -1=descending)\ndb.users.createIndex({ email: 1 })\n\n// Compound index (multiple fields)\ndb.products.createIndex({ category: 1, price: -1 })\n\n// Unique index\ndb.users.createIndex({ email: 1 }, { unique: true })\n\n// Sparse index (only indexes documents with the field)\ndb.users.createIndex({ phone: 1 }, { sparse: true })\n\n// TTL index (documents auto-deleted after N seconds)\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })\n\n// Text index\ndb.articles.createIndex({ title: 'text', content: 'text' })\n\n// Geospatial index\ndb.places.createIndex({ location: '2dsphere' })" } },
      { type: "heading", data: { level: 2, text: "8.4 Viewing and Managing Indexes" } },
      { type: "code", data: { language: "javascript", code: "// List all indexes on a collection\ndb.users.getIndexes()\n\n// Drop an index by name\ndb.users.dropIndex('email_1')\n\n// Drop all indexes (except _id)\ndb.users.dropIndexes()" } },
      { type: "heading", data: { level: 2, text: "8.5 Explain Plan – Analyzing Query Performance" } },
      { type: "code", data: { language: "javascript", code: "db.users.find({ email: 'alice@example.com' }).explain('executionStats')" } },
      { type: "list", data: { style: "bullet", items: ["COLLSCAN: Collection scan (no index used — slow for large collections)", "IXSCAN: Index scan (index used — fast)", "nReturned vs totalDocsExamined: Should be equal if index is effective", "executionTimeMillis: Total query execution time"] } },
      { type: "heading", data: { level: 2, text: "8.6 Index Best Practices" } },
      { type: "list", data: { style: "bullet", items: ["Index fields used in frequent queries, sort operations, and joins", "Compound indexes support queries on the prefix fields", "Avoid indexing fields with low cardinality (e.g., boolean fields)", "Don't over-index — each index consumes memory and slows writes", "Use .explain() to verify index usage", "Consider compound index field order: equality > sort > range (ESR Rule)"] } },
      { type: "quiz", data: { question: "What type of scan does MongoDB use when no index is available?", options: ["IXSCAN", "FETCH", "COLLSCAN", "SORT"], correctIndex: 2, explanation: "COLLSCAN (Collection Scan) means MongoDB reads every document in the collection to find matches. This is slow for large collections. IXSCAN means an index was used." } },
      { type: "quiz", data: { question: "What does a TTL index do?", options: ["Creates a text search index", "Auto-deletes documents after a specified number of seconds", "Tracks document version history", "Limits query time"], correctIndex: 1, explanation: "A TTL (Time To Live) index automatically deletes documents after a specified number of seconds from the indexed date field. Perfect for sessions, OTP codes, and temporary data." } },
      { type: "quiz", data: { question: "Which index type ensures a field's value is unique across all documents?", options: ["Sparse index", "Text index", "Unique index", "Compound index"], correctIndex: 2, explanation: "A unique index ensures no two documents can have the same value for the indexed field. MongoDB will reject insert/update operations that would create a duplicate." } },
      { type: "quiz", data: { question: "What is a compound index?", options: ["An index on arrays", "An index on two or more fields", "An encrypted index", "An index that covers the full document"], correctIndex: 1, explanation: "A compound index spans two or more fields. It supports queries that filter or sort on those fields, and prefix fields can be used independently for single-field queries." } },
      { type: "quiz", data: { question: "What does .explain('executionStats') help you do?", options: ["Export query results", "Analyze query performance and verify index usage", "Create an execution plan for bulk operations", "Display index statistics"], correctIndex: 1, explanation: ".explain('executionStats') shows how MongoDB executed the query: whether it used an index (IXSCAN vs COLLSCAN), how many documents were examined, and execution time in milliseconds." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 9 — Aggregation Framework
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Aggregation Framework", 9, [{
    title: "Aggregation Framework – Pipelines, Stages & Real-World Examples",
    slug: "mongodb-aggregation-framework",
    order: 1, estimatedReadTime: 14,
    summary: "Build powerful data pipelines with $match, $group, $project, $lookup, $unwind, $addFields, and $facet for complex data transformations.",
    content: [
      { type: "heading", data: { level: 2, text: "9.1 What is the Aggregation Framework?" } },
      { type: "paragraph", data: { text: "The Aggregation Framework is MongoDB's powerful data processing pipeline. It transforms and analyzes data through a sequence of pipeline stages, similar to UNIX pipes. Each stage takes documents, processes them, and outputs the result to the next stage." } },
      { type: "heading", data: { level: 2, text: "9.2 Aggregation Pipeline Stages" } },
      { type: "code", data: { language: "javascript", code: "db.orders.aggregate([\n  { $match: { status: 'completed' } },                          // Filter\n  { $group: { _id: '$userId', total: { $sum: '$amount' } } },   // Group\n  { $sort: { total: -1 } },                                     // Sort\n  { $limit: 10 }                                                // Limit\n])" } },
      { type: "heading", data: { level: 2, text: "9.3 Common Pipeline Stages" } },
      { type: "code", data: { language: "javascript", code: "// $match – Filter Documents\n{ $match: { status: 'active', age: { $gte: 18 } } }\n\n// $group – Group and Aggregate\n{ $group: {\n  _id: '$category',\n  totalSales: { $sum: '$amount' },\n  avgPrice:   { $avg: '$price' },\n  count:      { $sum: 1 },\n  minPrice:   { $min: '$price' },\n  maxPrice:   { $max: '$price' }\n}}\n\n// $project – Select and Transform Fields\n{ $project: {\n  name: 1,\n  email: 1,\n  fullName:    { $concat: ['$firstName', ' ', '$lastName'] },\n  ageInMonths: { $multiply: ['$age', 12] }\n}}\n\n// $lookup – Join Collections\n{ $lookup: {\n  from: 'products',       // Collection to join\n  localField: 'productId',\n  foreignField: '_id',\n  as: 'productDetails'\n}}\n\n// $unwind – Deconstruct Arrays\n{ $unwind: '$tags' }\n\n// $addFields – Add Computed Fields\n{ $addFields: {\n  totalPrice:      { $multiply: ['$price', '$quantity'] },\n  discountedPrice: { $multiply: ['$price', 0.9] }\n}}" } },
      { type: "heading", data: { level: 2, text: "9.4 Real-World Example: Sales Report" } },
      { type: "code", data: { language: "javascript", code: "db.orders.aggregate([\n  { $match: { status: 'completed', createdAt: { $gte: new Date('2024-01-01') } } },\n  { $group: {\n    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },\n    revenue:       { $sum: '$total' },\n    orderCount:    { $sum: 1 },\n    avgOrderValue: { $avg: '$total' }\n  }},\n  { $sort: { '_id.year': 1, '_id.month': 1 } }\n])" } },
      { type: "heading", data: { level: 2, text: "9.5 $facet – Multiple Pipelines" } },
      { type: "code", data: { language: "javascript", code: "db.products.aggregate([{\n  $facet: {\n    priceBuckets: [\n      { $bucket: { groupBy: '$price', boundaries: [0, 25, 50, 100, 500] } }\n    ],\n    categoryStats: [\n      { $group: { _id: '$category', count: { $sum: 1 } } }\n    ]\n  }\n}])" } },
      { type: "tip", data: { text: "Always place $match early in the pipeline to reduce documents processed by subsequent stages. If $match can use an index, it dramatically speeds up the entire pipeline." } },
      { type: "quiz", data: { question: "Which aggregation stage filters documents (like a WHERE clause)?", options: ["$filter", "$where", "$match", "$select"], correctIndex: 2, explanation: "$match is the aggregation equivalent of SQL's WHERE clause. It filters documents at that stage. Always place $match first to minimize documents processed by later stages." } },
      { type: "quiz", data: { question: "What does $lookup do in an aggregation pipeline?", options: ["Looks up values in an array", "Performs a JOIN with another collection", "Creates a text index for search", "Looks up documents by _id"], correctIndex: 1, explanation: "$lookup performs a left outer join between the current collection and a foreign collection, similar to SQL JOIN. It adds a new array field with matched documents." } },
      { type: "quiz", data: { question: "What does $unwind do to an array field?", options: ["Removes the array field", "Flattens the array into a single value", "Creates a separate document for each array element", "Sorts the array elements"], correctIndex: 2, explanation: "$unwind deconstructs an array field — it creates one output document for each element in the array. A document with a 3-element array becomes 3 documents." } },
      { type: "quiz", data: { question: "Which accumulator in $group calculates the average?", options: ["$mean", "$average", "$avg", "$arithmetic"], correctIndex: 2, explanation: "$avg is the accumulator operator that calculates the average of all values in the group. Common accumulators: $sum, $avg, $min, $max, $first, $last, $push, $addToSet." } },
      { type: "quiz", data: { question: "In $group, what does { $sum: 1 } calculate?", options: ["The sum of all values in a field", "The count of documents in each group", "The total of the first field", "Adds 1 to each document's value"], correctIndex: 1, explanation: "{ $sum: 1 } counts the number of documents in each group — it adds 1 for each document processed. It's the aggregation equivalent of COUNT(*) in SQL." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 10 — Schema Design
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Schema Design", 10, [{
    title: "Schema Design – Embedding vs Referencing & Relationship Patterns",
    slug: "mongodb-schema-design",
    order: 1, estimatedReadTime: 12,
    summary: "Design efficient MongoDB schemas — embedding vs referencing, one-to-one, one-to-many, many-to-many relationships, and the 16MB document limit.",
    content: [
      { type: "heading", data: { level: 2, text: "10.1 Schema Design Principles" } },
      { type: "paragraph", data: { text: "Although MongoDB allows flexible schemas, good schema design is critical for performance and maintainability. Design your schema around how your application queries data, not how the data looks in isolation." } },
      { type: "heading", data: { level: 2, text: "10.2 Embedding vs Referencing" } },
      { type: "paragraph", data: { text: "The fundamental schema design decision in MongoDB is whether to embed related data in the same document or reference it from another collection." } },
      { type: "heading", data: { level: 3, text: "Embedding (Denormalization)" } },
      { type: "code", data: { language: "javascript", code: "// User with embedded address - good for one-to-few relationships\n{\n  _id: ObjectId(),\n  name: 'Alice',\n  address: { street: '123 Main St', city: 'New York' },\n  orders: [{ id: 1, item: 'Book', total: 29.99 }]\n}" } },
      { type: "list", data: { style: "bullet", items: ["Use embedding when: data is accessed together", "Relationship is one-to-few", "Data rarely changes independently"] } },
      { type: "heading", data: { level: 3, text: "Referencing (Normalization)" } },
      { type: "code", data: { language: "javascript", code: "// User document\n{ _id: ObjectId('user123'), name: 'Alice' }\n\n// Order document\n{ _id: ObjectId(), userId: ObjectId('user123'), item: 'Book', total: 29.99 }" } },
      { type: "list", data: { style: "bullet", items: ["Use referencing when: data is accessed independently", "Relationship is one-to-many or many-to-many", "Data changes frequently", "Embedded documents would grow too large"] } },
      { type: "heading", data: { level: 2, text: "10.3 One-to-One Relationship" } },
      { type: "code", data: { language: "javascript", code: "// Embed in same document\n{ _id: 'user1', name: 'Alice', profile: { bio: '...', avatar: 'url' } }" } },
      { type: "heading", data: { level: 2, text: "10.4 One-to-Many Relationship" } },
      { type: "code", data: { language: "javascript", code: "// Embed if 'many' is small (e.g., blog post comments < 100)\n{ _id: 'post1', title: 'My Post', comments: [{...}, {...}] }\n\n// Reference if 'many' is large (e.g., user with thousands of orders)\n{ _id: 'order1', userId: 'user1', amount: 100 }" } },
      { type: "heading", data: { level: 2, text: "10.5 Many-to-Many Relationship" } },
      { type: "code", data: { language: "javascript", code: "// Products and categories\n{ _id: 'prod1', name: 'Book', categoryIds: ['cat1', 'cat2'] }\n{ _id: 'cat1', name: 'Education' }" } },
      { type: "warning", data: { title: "16MB Document Size Limit", text: "MongoDB documents cannot exceed 16MB. For one-to-many relationships where the array could grow without bounds, always use referencing to avoid hitting this limit." } },
      { type: "quiz", data: { question: "When should you prefer embedding over referencing?", options: ["When data is large and frequently updated independently", "When data is accessed together, and the relationship is one-to-few", "When you need JOINs", "Always prefer embedding"], correctIndex: 1, explanation: "Embed when data is consistently accessed together and the relationship is one-to-few. This avoids $lookup operations and keeps related data in a single document read." } },
      { type: "quiz", data: { question: "What is the document size limit in MongoDB?", options: ["4 MB", "8 MB", "16 MB", "32 MB"], correctIndex: 2, explanation: "MongoDB documents cannot exceed 16 MB in size. This limit influences schema design — unbounded arrays should use referencing instead of embedding to avoid hitting this limit." } },
      { type: "quiz", data: { question: "In a one-to-many relationship where 'many' means thousands of documents, which approach is recommended?", options: ["Embed all documents", "Reference with a foreign key", "Use a capped collection", "Store as JSON strings"], correctIndex: 1, explanation: "For large one-to-many relationships (thousands), use referencing (foreign key). Embedding thousands of subdocuments would approach the 16MB limit and degrade performance." } },
      { type: "quiz", data: { question: "What does denormalization mean in MongoDB?", options: ["Removing duplicate data", "Embedding related data together to avoid $lookup", "Adding validation rules", "Splitting data across collections"], correctIndex: 1, explanation: "Denormalization means intentionally duplicating or embedding data to improve read performance by avoiding joins ($lookup). It trades storage/write complexity for faster reads." } },
      { type: "quiz", data: { question: "Which pattern stores a subset of frequently accessed fields from a related document inside the parent document?", options: ["Referencing pattern", "Subset pattern / Extended Reference pattern", "Polymorphic pattern", "Bucket pattern"], correctIndex: 1, explanation: "The Subset/Extended Reference pattern stores a reference plus a copy of frequently accessed fields from the related document, avoiding $lookup on common reads while keeping the full data elsewhere." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 11 — Relationships – Embedding vs Referencing
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Relationships – Embedding vs Referencing", 11, [{
    title: "Advanced Relationship Patterns – Extended Reference, Subset, Polymorphic",
    slug: "mongodb-relationship-patterns",
    order: 1, estimatedReadTime: 12,
    summary: "Apply advanced patterns: Extended Reference, Subset Pattern, Polymorphic Pattern, and performing joins with $lookup and preserveNullAndEmptyArrays.",
    content: [
      { type: "heading", data: { level: 2, text: "11.1 Deep Dive into Relationships" } },
      { type: "paragraph", data: { text: "This chapter expands on Chapter 10's introduction with more patterns and practical implementations." } },
      { type: "heading", data: { level: 2, text: "11.2 Extended Reference Pattern" } },
      { type: "paragraph", data: { text: "Store a reference plus frequently accessed fields from the related document to avoid $lookup on every query." } },
      { type: "code", data: { language: "javascript", code: "// Order document with extended reference to user\n{\n  _id: ObjectId(),\n  userId: ObjectId('user123'),\n  // Extended reference - frequently needed user fields\n  userName:  'Alice',\n  userEmail: 'alice@example.com',\n  items: [...],\n  total: 99.99\n}" } },
      { type: "heading", data: { level: 2, text: "11.3 Subset Pattern" } },
      { type: "paragraph", data: { text: "Store only the most relevant subset of embedded data, keeping a full list in another collection." } },
      { type: "code", data: { language: "javascript", code: "// Post document with latest 5 comments embedded\n{\n  _id: ObjectId(),\n  title: 'MongoDB Tips',\n  content: '...',\n  commentCount: 248,\n  recentComments: [  // Only last 5 comments\n    { user: 'Bob', text: 'Great article!', date: new Date() }\n  ]\n}" } },
      { type: "heading", data: { level: 2, text: "11.4 Polymorphic Pattern" } },
      { type: "paragraph", data: { text: "When different document types share common fields but also have type-specific fields, store all types in one collection with a type discriminator." } },
      { type: "code", data: { language: "javascript", code: "{ _id: 1, type: 'book',  title: 'MongoDB Guide',    pages: 300,    isbn: '...'    }\n{ _id: 2, type: 'video', title: 'MongoDB Tutorial', duration: 3600, resolution: '1080p' }" } },
      { type: "heading", data: { level: 2, text: "11.5 Performing Joins with $lookup" } },
      { type: "code", data: { language: "javascript", code: "// Join orders with users\ndb.orders.aggregate([{\n  $lookup: {\n    from: 'users',\n    localField: 'userId',\n    foreignField: '_id',\n    as: 'userDetails'\n  }\n}, {\n  $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }\n}])" } },
      { type: "quiz", data: { question: "What problem does the Extended Reference Pattern solve?", options: ["Document size limits", "Reducing $lookup queries by embedding frequently needed fields from related documents", "Handling many-to-many relationships", "Improving write performance"], correctIndex: 1, explanation: "The Extended Reference Pattern stores a foreign key reference PLUS copies of commonly needed fields from the referenced document. This eliminates $lookup on the most common read paths." } },
      { type: "quiz", data: { question: "What is the Polymorphic Pattern used for?", options: ["Encrypting documents", "Storing different types of objects in the same collection with a type discriminator", "Managing large arrays", "Implementing access control"], correctIndex: 1, explanation: "The Polymorphic Pattern stores documents of different shapes in one collection using a 'type' field as a discriminator. All types share common fields; type-specific fields differ." } },
      { type: "quiz", data: { question: "What does preserveNullAndEmptyArrays: true do in $unwind?", options: ["Keeps documents where the array has null or no elements, instead of removing them", "Adds null values to empty arrays", "Prevents array modification", "Handles null foreign keys in $lookup"], correctIndex: 0, explanation: "By default, $unwind removes documents where the unwound field is null, missing, or an empty array. preserveNullAndEmptyArrays: true keeps those documents in the output." } },
      { type: "quiz", data: { question: "In the Subset Pattern, what is kept in the parent document?", options: ["All related documents", "Only a small, frequently accessed subset of the related data", "Only foreign key references", "Metadata about the relationship"], correctIndex: 1, explanation: "The Subset Pattern keeps only a small, recent, or frequently accessed portion of related data embedded in the parent document. The full dataset lives in a separate collection." } },
      { type: "quiz", data: { question: "Which relationship type most commonly uses an array of ObjectId references?", options: ["One-to-one", "Many-to-many", "One-to-zero", "Self-referencing"], correctIndex: 1, explanation: "Many-to-many relationships commonly use an array of ObjectId references. E.g., a product document has categoryIds: [ObjectId('...'), ObjectId('...')] referencing multiple categories." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 12 — MongoDB with Node.js – Mongoose
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("MongoDB with Node.js – Mongoose", 12, [{
    title: "Mongoose – Schemas, Virtuals, Middleware & Population",
    slug: "mongoose-nodejs-integration",
    order: 1, estimatedReadTime: 14,
    summary: "Connect Mongoose, define schemas with validation, add virtual properties, use pre/post hooks, populate references, and chain query methods.",
    content: [
      { type: "heading", data: { level: 2, text: "12.1 What is Mongoose?" } },
      { type: "paragraph", data: { text: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, query building, middleware (hooks), and virtual properties — bringing structure to MongoDB's flexible documents." } },
      { type: "heading", data: { level: 2, text: "12.2 Connecting Mongoose" } },
      { type: "code", data: { language: "javascript", code: "const mongoose = require('mongoose');\n\nmongoose.connect(process.env.MONGO_URI)\n  .then(() => console.log('MongoDB connected'))\n  .catch(err => console.error('Connection error:', err));" } },
      { type: "heading", data: { level: 2, text: "12.3 Defining Schemas" } },
      { type: "code", data: { language: "javascript", code: "const productSchema = new mongoose.Schema({\n  name:     { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },\n  price:    { type: Number, required: true, min: [0, 'Price cannot be negative'] },\n  category: { type: String, enum: ['electronics', 'books', 'clothing'], required: true },\n  inStock:  { type: Boolean, default: true },\n  tags:     [String],\n  createdAt: { type: Date, default: Date.now }\n}, { timestamps: true }); // Adds createdAt and updatedAt automatically" } },
      { type: "heading", data: { level: 2, text: "12.4 Mongoose Virtuals" } },
      { type: "code", data: { language: "javascript", code: "userSchema.virtual('fullName').get(function() {\n  return `${this.firstName} ${this.lastName}`;\n});" } },
      { type: "heading", data: { level: 2, text: "12.5 Mongoose Middleware (Hooks)" } },
      { type: "code", data: { language: "javascript", code: "// Pre-save hook: hash password before saving\nuserSchema.pre('save', async function(next) {\n  if (!this.isModified('password')) return next();\n  this.password = await bcrypt.hash(this.password, 10);\n  next();\n});\n\n// Post-save hook\nuserSchema.post('save', function(doc) {\n  console.log('User saved:', doc._id);\n});" } },
      { type: "heading", data: { level: 2, text: "12.6 Mongoose Population (Reference Resolution)" } },
      { type: "code", data: { language: "javascript", code: "const orderSchema = new mongoose.Schema({\n  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]\n});\n\n// Populate referenced documents\nconst order = await Order.findById(id)\n  .populate('userId', 'name email')\n  .populate('products', 'name price');" } },
      { type: "heading", data: { level: 2, text: "12.7 Mongoose Query Methods" } },
      { type: "code", data: { language: "javascript", code: "const products = await Product\n  .find({ category: 'electronics' })\n  .select('name price -_id')\n  .sort({ price: -1 })\n  .limit(10)\n  .skip(20)\n  .lean();  // Returns plain JS objects (faster, no Mongoose overhead)" } },
      { type: "quiz", data: { question: "What does .populate() do in Mongoose?", options: ["Adds default data to empty fields", "Replaces ObjectId references with the actual referenced documents", "Creates a new collection", "Generates test data"], correctIndex: 1, explanation: ".populate() performs a secondary query to replace ObjectId values with the actual documents from the referenced collection. It's the Mongoose equivalent of a SQL JOIN." } },
      { type: "quiz", data: { question: "What does { timestamps: true } add to a Mongoose schema?", options: ["Only createdAt field", "Both createdAt and updatedAt fields that are automatically managed", "A timestamp format validator", "UTC conversion for dates"], correctIndex: 1, explanation: "{ timestamps: true } automatically adds and manages both createdAt (set on insert) and updatedAt (updated on every save) fields. You never need to manage these manually." } },
      { type: "quiz", data: { question: "What is the purpose of a Mongoose pre-save hook?", options: ["Runs code after a document is deleted", "Runs code before a document is saved, allowing modification or validation", "Connects to the database before saving", "Creates a backup before saving"], correctIndex: 1, explanation: "A pre-save hook runs before a document is saved to the database. Common uses: hashing passwords, auto-generating slugs, validation, setting default values." } },
      { type: "quiz", data: { question: "What does .lean() do in a Mongoose query?", options: ["Removes empty fields", "Returns plain JavaScript objects instead of Mongoose documents (faster)", "Flattens nested objects", "Removes the _id field"], correctIndex: 1, explanation: ".lean() returns plain JavaScript objects instead of Mongoose Document instances. This is faster and uses less memory — ideal for read-only API responses where you don't need Mongoose methods." } },
      { type: "quiz", data: { question: "What is a Mongoose virtual?", options: ["A field stored in the database", "A computed property not stored in the database but accessible on the document", "A virtual collection", "An index type"], correctIndex: 1, explanation: "A virtual is a computed property defined on the schema that is not stored in MongoDB. Example: a fullName virtual that combines firstName and lastName. Virtuals don't appear in toJSON() by default unless enabled." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Performance Optimization
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Performance Optimization", 13, [{
    title: "Performance Optimization – Queries, Indexes, Schema & Profiler",
    slug: "mongodb-performance-optimization",
    order: 1, estimatedReadTime: 10,
    summary: "Optimize MongoDB with proper indexes, covered queries, schema design for performance, aggregation pipeline optimization, and the MongoDB profiler.",
    content: [
      { type: "heading", data: { level: 2, text: "13.1 Query Optimization" } },
      { type: "list", data: { style: "bullet", items: ["Use indexes on frequently queried fields", "Use .explain('executionStats') to verify index usage", "Use projection to return only needed fields", "Use .lean() in Mongoose for read operations", "Avoid $where and JavaScript expressions (they bypass indexes)"] } },
      { type: "heading", data: { level: 2, text: "13.2 Index Optimization" } },
      { type: "list", data: { style: "bullet", items: ["Create compound indexes matching your query patterns", "Use covered queries (all fields in query + projection are in the index)", "Monitor index usage with db.collection.aggregate([{$indexStats:{}}])", "Drop unused indexes — they slow down writes"] } },
      { type: "heading", data: { level: 2, text: "13.3 Schema Optimization" } },
      { type: "list", data: { style: "bullet", items: ["Embed frequently co-accessed data together", "Keep document size small — large documents increase memory pressure", "Use appropriate data types (int vs string for numbers)", "Design around your most critical queries"] } },
      { type: "heading", data: { level: 2, text: "13.4 Aggregation Optimization" } },
      { type: "list", data: { style: "bullet", items: ["Place $match and $sort early in the pipeline to use indexes", "Use $project early to reduce document size flowing through pipeline", "Use $limit early when you only need a few results"] } },
      { type: "heading", data: { level: 2, text: "13.5 MongoDB Profiler" } },
      { type: "code", data: { language: "javascript", code: "// Enable profiling (0=off, 1=slow queries, 2=all)\ndb.setProfilingLevel(1, { slowms: 100 })\n\n// View slow queries\ndb.system.profile.find().sort({ ts: -1 }).limit(10)" } },
      { type: "quiz", data: { question: "What is a 'covered query' in MongoDB?", options: ["A query protected by authentication", "A query where all fields can be satisfied from the index alone, without reading documents", "A query hidden from the profiler", "A query with error handling"], correctIndex: 1, explanation: "A covered query has all its filter and projection fields in an index. MongoDB can answer the query using only the index B-tree — never reading the actual documents. This is the fastest possible query execution." } },
      { type: "quiz", data: { question: "What does db.setProfilingLevel(1) do?", options: ["Enables profiling for all operations", "Enables profiling for operations slower than slowms threshold", "Disables profiling", "Profiles only write operations"], correctIndex: 1, explanation: "Profiling level 1 captures only 'slow' operations — those exceeding the slowms threshold (default 100ms). Level 0 is off, level 2 captures everything." } },
      { type: "quiz", data: { question: "Why should you avoid $where in queries?", options: ["It's deprecated", "It requires JavaScript execution which bypasses indexes and is slow", "It only works on strings", "It doesn't support all operators"], correctIndex: 1, explanation: "$where runs JavaScript on every document, bypassing the query optimizer and all indexes. It results in a full collection scan and is significantly slower than native MongoDB operators." } },
      { type: "quiz", data: { question: "Which aggregation stage should usually come first for performance?", options: ["$group", "$sort", "$match", "$project"], correctIndex: 2, explanation: "$match should come first to filter documents early, reducing the number of documents that pass through subsequent stages. If $match can use an index, it avoids scanning the entire collection." } },
      { type: "quiz", data: { question: "What is the purpose of .lean() in Mongoose for performance?", options: ["Reduces query execution time by removing index checks", "Returns plain JS objects instead of Mongoose documents, reducing memory and CPU overhead", "Compresses the response data", "Caches the result"], correctIndex: 1, explanation: ".lean() skips the creation of full Mongoose Document instances. Plain JavaScript objects are faster to create and use less memory. Use for read-only operations like API responses." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 14 — Backup & Restore
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Backup & Restore", 14, [{
    title: "Backup & Restore – mongodump, mongoexport & Atlas Backups",
    slug: "mongodb-backup-restore",
    order: 1, estimatedReadTime: 8,
    summary: "Back up MongoDB with mongodump/mongorestore, export data with mongoexport/mongoimport, use Atlas automated backups, and automate with cron scripts.",
    content: [
      { type: "heading", data: { level: 2, text: "14.1 Why Backup?" } },
      { type: "paragraph", data: { text: "Data loss can occur due to hardware failures, accidental deletions, bugs, or ransomware attacks. Regular backups are essential for any production MongoDB deployment." } },
      { type: "heading", data: { level: 2, text: "14.2 mongodump & mongorestore" } },
      { type: "code", data: { language: "bash", code: "# Dump entire MongoDB instance\nmongodump --out /backup/$(date +%Y%m%d)\n\n# Dump specific database\nmongodump --db myapp --out /backup/myapp\n\n# Dump specific collection\nmongodump --db myapp --collection users --out /backup\n\n# Dump from remote (Atlas)\nmongodump --uri 'mongodb+srv://user:pass@cluster.mongodb.net/myapp' --out /backup\n\n# Restore entire dump\nmongorestore /backup/20240115\n\n# Restore specific database\nmongorestore --db myapp /backup/myapp\n\n# Restore with drop (replaces existing data)\nmongorestore --drop --db myapp /backup/myapp" } },
      { type: "heading", data: { level: 2, text: "14.3 mongoexport & mongoimport (JSON/CSV)" } },
      { type: "code", data: { language: "bash", code: "# Export collection to JSON\nmongoexport --db myapp --collection users --out users.json\n\n# Export collection to CSV\nmongoexport --db myapp --collection users --type csv --fields name,email --out users.csv\n\n# Import from JSON\nmongoimport --db myapp --collection users --file users.json" } },
      { type: "heading", data: { level: 2, text: "14.4 MongoDB Atlas Backups" } },
      { type: "paragraph", data: { text: "Atlas provides automated backups with point-in-time recovery. You can restore to any point within the backup retention period from the Atlas UI without any commands." } },
      { type: "heading", data: { level: 2, text: "14.5 Backup Best Practices" } },
      { type: "list", data: { style: "bullet", items: ["Automate backups with cron jobs (Linux) or Task Scheduler (Windows)", "Store backups offsite (S3, Google Cloud Storage)", "Test your restore process regularly", "Use Atlas automated backups for production"] } },
      { type: "code", data: { language: "bash", code: "#!/bin/bash\n# backup.sh\nDATE=$(date +%Y%m%d_%H%M%S)\nBACKUP_DIR='/var/backups/mongodb'\n\nmongodump --uri $MONGO_URI --out $BACKUP_DIR/$DATE\n\n# Delete backups older than 7 days\nfind $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +\n\necho \"Backup completed: $BACKUP_DIR/$DATE\"\n# Add to crontab: 0 2 * * * /path/to/backup.sh >> /var/log/mongodb-backup.log 2>&1" } },
      { type: "quiz", data: { question: "Which tool creates a binary backup of MongoDB data?", options: ["mongoexport", "mongobackup", "mongodump", "mongosave"], correctIndex: 2, explanation: "mongodump creates binary BSON backups that preserve all MongoDB-specific data types. It's the standard tool for database backups, restored with mongorestore." } },
      { type: "quiz", data: { question: "What does --drop do in mongorestore?", options: ["Drops the entire database before restoring", "Drops each collection before restoring it (replaces existing data)", "Drops indexes during restore", "Drops duplicate documents"], correctIndex: 1, explanation: "--drop tells mongorestore to drop each collection before restoring it from the backup. This ensures the restored data replaces any existing data rather than merging with it." } },
      { type: "quiz", data: { question: "Which tool exports data to JSON or CSV format?", options: ["mongodump", "mongoexport", "mongorestore", "mongoconvert"], correctIndex: 1, explanation: "mongoexport exports MongoDB data to human-readable JSON or CSV format. It's useful for data analysis and migration. Note: it may lose some BSON-specific type info unlike mongodump." } },
      { type: "quiz", data: { question: "What is Point-in-Time Recovery?", options: ["Restoring a backup from exactly midnight each day", "Ability to restore the database to any specific moment in time within retention period", "Recovering a single document by timestamp", "Backing up every minute"], correctIndex: 1, explanation: "Point-in-Time Recovery (PITR) lets you restore your database to any specific second within the backup retention window. Available in MongoDB Atlas M10+ clusters." } },
      { type: "quiz", data: { question: "What is the recommended approach for production MongoDB backups?", options: ["Daily manual mongodump only", "Atlas automated backups with offsite storage", "Export to CSV weekly", "No backups needed with replication"], correctIndex: 1, explanation: "Atlas automated backups with offsite storage are recommended for production. They provide continuous backups, point-in-time recovery, and are managed by MongoDB — no manual effort required." } },
    ],
  }]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAPTER 15 — Security Basics
  // ═══════════════════════════════════════════════════════════════════════════
  await createChapter("Security Basics", 15, [{
    title: "Security – Authentication, RBAC, Network Security & Injection Prevention",
    slug: "mongodb-security-basics",
    order: 1, estimatedReadTime: 10,
    summary: "Secure MongoDB with authentication, role-based access control, network binding, TLS encryption, and prevention of NoSQL injection attacks.",
    content: [
      { type: "heading", data: { level: 2, text: "15.1 Authentication" } },
      { type: "paragraph", data: { text: "MongoDB supports multiple authentication mechanisms. Always enable authentication in production." } },
      { type: "code", data: { language: "javascript", code: "// Create admin user\nuse admin\ndb.createUser({\n  user: 'admin',\n  pwd: 'strong_password_here',\n  roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']\n})\n\n// Create application-specific user\nuse myapp\ndb.createUser({\n  user: 'appuser',\n  pwd: 'app_password',\n  roles: [{ role: 'readWrite', db: 'myapp' }]\n})" } },
      { type: "heading", data: { level: 2, text: "15.2 Role-Based Access Control (RBAC)" } },
      { type: "list", data: { style: "bullet", items: ["read: Can read any data in the database", "readWrite: Can read and write data", "dbAdmin: Can perform administrative tasks", "userAdmin: Can manage users and roles", "clusterAdmin: Full cluster-level access", "readAnyDatabase, readWriteAnyDatabase: Access to all databases"] } },
      { type: "heading", data: { level: 2, text: "15.3 Network Security" } },
      { type: "code", data: { language: "yaml", code: "# mongod.conf - Bind to specific IPs only\nnet:\n  bindIp: 127.0.0.1,10.0.0.5   # Never use 0.0.0.0 in production\n  port: 27017\nsecurity:\n  authorization: enabled" } },
      { type: "heading", data: { level: 2, text: "15.4 Encryption" } },
      { type: "list", data: { style: "bullet", items: ["Encryption at Rest: Use MongoDB Enterprise or Atlas to encrypt data files", "Encryption in Transit: Use TLS/SSL for all connections", "Field-Level Encryption: Encrypt specific sensitive fields client-side"] } },
      { type: "heading", data: { level: 2, text: "15.5 Security Best Practices" } },
      { type: "list", data: { style: "bullet", items: ["NEVER expose MongoDB directly to the internet — use a VPN or SSH tunnel", "Always enable authentication (--auth flag or security.authorization: enabled)", "Use strong, unique passwords for all database users", "Principle of least privilege: grant only necessary permissions", "Enable TLS/SSL for all connections", "Regularly audit user accounts and permissions", "Keep MongoDB updated to the latest stable version", "Use MongoDB Atlas for built-in security features"] } },
      { type: "heading", data: { level: 2, text: "15.6 Preventing Injection Attacks" } },
      { type: "code", data: { language: "javascript", code: "// VULNERABLE: User input directly in query\napp.get('/user', (req, res) => {\n  db.users.findOne({ username: req.query.username });\n  // Attacker can send: ?username[$ne]=xxx to bypass authentication\n});\n\n// SAFE: Use Mongoose (sanitizes input) or validate input\nconst { username } = req.query;\nif (typeof username !== 'string') return res.status(400).json({ error: 'Invalid' });\nawait User.findOne({ username }); // Mongoose escapes operators" } },
      { type: "quiz", data: { question: "What does enabling security.authorization in mongod.conf do?", options: ["Encrypts the database files", "Requires authentication for all database connections", "Enables network encryption", "Disables external connections"], correctIndex: 1, explanation: "security.authorization: enabled requires all database connections to authenticate with valid credentials. Without it, anyone who can reach MongoDB's port has full access — never acceptable in production." } },
      { type: "quiz", data: { question: "Which MongoDB role allows both reading and writing to a specific database?", options: ["read", "dbAdmin", "readWrite", "clusterAdmin"], correctIndex: 2, explanation: "The readWrite role grants permission to read and write data (insert, update, delete, find) on a specific database. It's the standard role for application users." } },
      { type: "quiz", data: { question: "Why should you never bind MongoDB to 0.0.0.0 in production?", options: ["It reduces performance", "It makes MongoDB accessible on all network interfaces, exposing it to the internet", "It disables replication", "It conflicts with authentication"], correctIndex: 1, explanation: "Binding to 0.0.0.0 means MongoDB listens on ALL network interfaces, including public ones. This exposes your database to the internet. Always bind to specific private IPs or localhost." } },
      { type: "quiz", data: { question: "What is a NoSQL injection attack?", options: ["Injecting SQL code into MongoDB", "Using MongoDB query operators in user input to manipulate queries", "Overloading the database with requests", "Injecting malware into BSON files"], correctIndex: 1, explanation: "NoSQL injection uses MongoDB operators in user input. E.g., sending { username: { $ne: null } } as a query parameter bypasses authentication by matching all users. Always validate input types." } },
      { type: "quiz", data: { question: "What does the Principle of Least Privilege mean for database users?", options: ["Use the same user for all applications", "Grant only the minimum permissions needed for the application to function", "Share credentials between developers", "Use read-only access for everything"], correctIndex: 1, explanation: "Least privilege means each application user should have only the permissions it actually needs. An API that only reads data should have the 'read' role, not 'readWrite' or 'dbAdmin'." } },
    ],
  }]);

  console.log("\n🎉  MongoDB course seeded successfully!");
  console.log(`    Chapters: 15 | Lessons: 15 (1 per chapter, 5 quizzes each)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
