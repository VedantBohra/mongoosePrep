# MongoDB + Mongoose Practice Challenges

---

## 🟢 Easy (Basics & CRUD)

### Create & Save Documents
- Define a **User** schema with fields: `name`, `email`, `age`.
- Create and save a new user in the database.
- Make `email` **unique**.

### Find Documents with Conditions
- Insert multiple **Book** documents with fields: `title`, `author`, `year`.
- Query all books **published after 2010**.

### Update a Document
- Update a user’s **age** by `email`.
- Return the **updated document**.

### Delete Documents
- Delete all users with `age < 18`.

### Schema with Default & Timestamps
- Create a **Post** schema with `title`, `content`, `createdAt`.
- Use `{ timestamps: true }` in schema options.
- Insert a post and check timestamps.

---

## 🟡 Medium (Relations & Aggregations)

### One-to-Many Relationship
- Create a **User** schema and **Post** schema.
- Store posts as an array of **ObjectIds** in `User`.
- Populate posts for a specific user.

### Many-to-Many Relationship
- Create **Student** and **Course** schemas.
- A student can enroll in many courses, and a course can have many students.
- Implement and populate the relationship.

### Indexing for Faster Queries
- Add an **index** on the `email` field of the **User** schema.
- Demonstrate querying by email and explain performance.

### Aggregation: Group & Count
- Given a **Sales** schema (`product`, `amount`, `region`),
- Write an **aggregation pipeline** to get total sales per region.

### Pagination with Mongoose
- Implement pagination for the **Post** model using `.limit()` and `.skip()`.
- Return **5 posts per page**.

---

## 🔴 Hard (Advanced Aggregation & Optimization)

### Lookup (Join between Collections)
- Have **Order** (`userId`, `total`) and **User** (`name`, `email`).
- Use aggregation `$lookup` to fetch orders with corresponding user info.

### Nested Aggregation (Top Products)
- Given **OrderItems** schema (`orderId`, `product`, `quantity`),
- Find the **top 3 most sold products** using `$group + $sort + $limit`.

### Text Search with Index
- Add a **text index** on **Post** (`title`, `content`).
- Implement a **search** that returns posts containing a given keyword, sorted by relevance.

### Transactions with Mongoose
- Implement a **money transfer** between two users:
  - Deduct from sender’s balance.
  - Add to receiver’s balance.
- Use **Mongoose transactions (session)** to ensure atomicity.

### Complex Aggregation (User Activity Stats)
- Given **UserActivity** schema (`userId`, `action`, `timestamp`).
- Write an aggregation to:
  - Group actions per user.
  - Count how many **login** actions per user.
  - Find the **most active user**.

---

✅ This set covers:
- **Easy** → CRUD + schema basics  
- **Medium** → relationships, indexes, pagination, simple aggregations  
- **Hard** → joins, text search, transactions, advanced pipelines
