# 🟢 Hard Level – MongoDB + Mongoose CRUD

This section covers the hard level of **Advanced queries on aggregation pipeline , transactions and text index search**.

---

## 🚀 Setup Instructions

1. **Connect MongoDB Compass**
   - First step: Open **MongoDB Compass** and connect it to your local MongoDB server (`mongodb://127.0.0.1:27017` by default).

2. **Project Setup**
   - Make sure you have **Node.js** installed.
   - Initialize your project and install dependencies if not already done:
     ```bash
     npm init -y
     npm install express mongoose
     ```

3. **Replace MongoDB URL**
   - In your code, replace the connection URL with your machine’s **local MongoDB URL**:
     ```js
     mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
     ```

4. **Start the Server**
   - Run the server using:
     ```bash
     node server.js
     ```

5. **Test with Postman**
   - All the routes you create for these challenges can be tested directly in **Postman** after the server is running.

---