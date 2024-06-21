# LGN Documentation

## Steps to start the project:

1. To install the dependencies:
    ```bash
    npm install
    ```
2. To start the backend server:
    ```bash
    npm start
    ```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following content:

`MONGODB_URL` `PORT` `JWT_SECRET` `API_KEY` `API_SECRET` `CLOUD_NAME`


## Project Dependencies

Here are the main dependencies used in this project along with a brief description of each:

- **bcrypt**: A library to help hash passwords. It is widely used to enhance security by encrypting passwords before storing them in a database.
- **bcryptjs**: A pure JavaScript implementation of bcrypt. It's a lightweight alternative to bcrypt, which might require native libraries.
- **cloudinary**: A service that provides cloud-based image and video management. It simplifies image and video uploads, storage, manipulation, and delivery.
- **cookie-parser**: Middleware for parsing cookies attached to the client request object. It helps in managing and reading cookies.
- **cors**: A middleware to enable Cross-Origin Resource Sharing (CORS) with various options. It allows your server to accept requests from different origins.
- **dotenv**: A module that loads environment variables from a `.env` file into `process.env`. It's used to manage environment-specific configurations.
- **express**: A fast, unopinionated, minimalist web framework for Node.js. It is widely used to build web applications and APIs.
- **express-fileupload**: Simple middleware for handling file uploads in Express applications. It supports both single and multiple file uploads.
- **jsonwebtoken**: A library to sign, verify, and decode JSON Web Tokens (JWT). It is commonly used for authentication and secure data transmission.
- **mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data.
- **morgan**: A HTTP request logger middleware for Node.js. It is used to log requests details for better monitoring and debugging.
- **nodemon**: A utility that monitors for any changes in your source and automatically restarts your server. It makes development much easier by reducing the need to manually restart the server after changes.
- **socket.io**: A library that enables real-time, bidirectional and event-based communication between web clients and servers. It is useful for building real-time applications like chat apps.
- **socket.io-client**: The client-side library for `socket.io`. It enables connecting to a `socket.io` server from a web client.

These dependencies are essential for building and running the project, each serving a specific purpose to enhance functionality, security, and ease of development.
