# Travlr Getaways – Full Stack Web Application

**CS 465 – Full Stack Development**  
**Author:** Amauri Hopewell

## Project Overview

Travlr Getaways is a full-stack travel web application built using the MEAN stack: MongoDB, Express, Angular, and Node.js. The completed application consists of two primary user interfaces that share a common backend and database:

- A **customer-facing website** built with Express and Handlebars that allows visitors to browse available travel packages.
- An **administrator single-page application (SPA)** built with Angular that allows authenticated staff to create, view, update, and delete trip information.

The backend provides a RESTful API that connects both sides of the application to a MongoDB database through Mongoose. The final iteration also adds secure administrator authentication using JSON Web Tokens (JWT). API operations that modify trip data are protected so that unauthenticated users cannot create, edit, or delete records.

---

## Architecture

### Frontend Development Approaches

This project demonstrates several approaches to frontend and web application development, beginning with static HTML and progressing to server-rendered templates and a client-side single-page application.

The **customer-facing site** uses Express and Handlebars and follows a traditional multi-page architecture. A browser request is routed through the Express application to a controller. The controller obtains the required data and passes it to a Handlebars template, which renders the HTML returned to the browser. Navigation generally results in a new request to the server and a complete page response. This architecture works well for the public-facing portion of Travlr Getaways because those pages are primarily intended for browsing travel information.

**JavaScript** provides much of the logic that makes the application dynamic instead of simply serving static HTML. On the Express side, JavaScript is used for routing, controllers, API processing, authentication, and database interaction. The Angular SPA uses TypeScript, which builds on JavaScript, for components, services, forms, routing, and client-side application behavior. Developing the project across these stages illustrated the difference between static content, server-generated pages, and an interactive client-side application.

The **Angular administrator interface** is a single-page application. After the initial application load, Angular handles navigation and interface updates on the client without requiring complete page reloads. Reusable components display and edit trip information, while services communicate asynchronously with the Express REST API. For example, an administrator can add or edit a trip and see the updated information without navigating away from the Angular application. The SPA therefore provides a richer and more responsive interface, although it also requires additional client-side logic for application state, routing, forms, API communication, and authentication.

### Why MongoDB?

The backend uses MongoDB because its document-oriented data model is a natural fit for the application's trip information. Each trip can be represented as a single document containing fields such as its code, name, length, start date, resort, price per person, image, and description rather than dividing those values among multiple relational tables.

MongoDB is a NoSQL database, but the application does not rely on completely unstructured data. Mongoose provides defined schemas, required fields, validation, and a consistent modeling layer on top of MongoDB. This combines the advantages of a document-oriented database with additional structure in the application.

Using MongoDB as the central persistent data store also allows the public website and administrator SPA to work from the same source of trip information. Changes made through the administrative application are stored in MongoDB and can then be retrieved by the customer-facing site through the API.

---

## Functionality

### JavaScript, JSON, and Full-Stack Communication

JavaScript and JSON are related but serve different purposes. **JavaScript** is a programming language capable of implementing variables, functions, classes, control flow, application logic, and user interaction. **JSON (JavaScript Object Notation)** is a lightweight data-interchange format used to represent and exchange structured information. Although JSON uses syntax that resembles JavaScript object notation, JSON itself does not contain executable application logic.

JSON ties together the frontend and backend portions of Travlr Getaways. The Express API retrieves trip information from MongoDB through Mongoose and returns the information in JSON responses. The Angular SPA uses HTTP requests to receive this data and convert it into information that its components can display.

The same process works in the opposite direction when an administrator modifies data. Angular sends trip information through the REST API, the Express backend processes the request, and Mongoose writes the resulting document to MongoDB. Authentication endpoints also return JWT information in JSON responses.

MongoDB internally stores documents in **BSON (Binary JSON)**, a binary representation with a structure similar to JSON. The use of compatible document-based representations throughout the application makes it easier for the Angular frontend, Express API, and MongoDB database to exchange data without tightly coupling their implementations.

### Refactoring and Reusable Components

Refactoring occurred throughout the project as the application became more sophisticated.

One early change involved moving from **static HTML pages to Express/Handlebars templates backed by dynamic application data**. Instead of maintaining separate static copies of content, routes and controllers could provide data to reusable templates for server-side rendering.

Another major architectural change was creating the dedicated **REST API layer** in `app_api`. Database operations could be handled through API routes and controllers rather than mixing database access directly into user-interface code. This improved separation of concerns and allowed both the public site and Angular application to work with the same backend data.

The Angular application also provided several opportunities for refactoring. Trip rendering was extracted into the reusable **TripCard** component rather than requiring the trip-listing component to handle every detail of displaying individual trips. The **TripDataService** centralized HTTP communication with the REST API so that individual components did not need to duplicate networking logic.

Authentication introduced additional reusable functionality. The **AuthenticationService** centralized login state, JWT storage, token validation, and logout behavior. A **JWT HTTP interceptor** was then used to attach the Bearer token automatically to authenticated API requests. Without the interceptor, authorization-header logic would have needed to be repeated throughout the application's HTTP methods.

These changes provided several benefits:

- Reduced duplicate code
- Improved separation of concerns
- More consistent user-interface behavior
- Easier maintenance and debugging
- Reusable components that can be used in multiple areas of the application
- Centralized API and authentication logic
- Easier expansion of the application with future features

---

## Testing

Testing a full-stack application required verifying not only the user interface but also the individual API operations, database behavior, and authentication controls.

### HTTP Methods and API Endpoints

RESTful endpoints identify the resources or operations available through the API, while HTTP methods indicate the type of action being requested. The primary trip endpoints used in Travlr Getaways include:

- `GET /api/trips` — retrieve all trips
- `GET /api/trips/:tripCode` — retrieve one trip by its code
- `POST /api/trips` — create a new trip
- `PUT /api/trips/:tripCode` — update an existing trip
- `DELETE /api/trips/:tripCode` — remove an existing trip
- `POST /api/register` — register a user
- `POST /api/login` — authenticate a user and return a JWT

Understanding the relationship among HTTP methods, endpoints, controllers, and database operations was important because an error visible in the frontend could originate at several different points in this request path.

### API Testing

Postman was used to test the API independently from the Angular application. This made it possible to verify that GET, POST, PUT, and DELETE operations reached the correct endpoint, returned the expected HTTP response, and produced the expected change in MongoDB.

Testing the API independently was particularly useful during development because it helped distinguish backend problems from frontend problems. Once an endpoint worked correctly in Postman, the Angular application could then be tested against the same endpoint.

### Security Testing

Adding authentication created an additional layer that also had to be tested. After a successful login, the backend returns a JSON Web Token. The Angular application stores this token, and its HTTP interceptor adds the token to protected requests using the `Authorization: Bearer <JWT>` header.

The Express backend uses JWT authentication middleware before allowing requests that modify trip data. Testing therefore included both positive and negative cases:

- Protected requests with a valid JWT were expected to succeed.
- Requests without an authorization token were expected to return `401 Unauthorized`.
- Requests containing an invalid token were also expected to be rejected.
- Logging out removed the stored token, preventing subsequent protected operations until the administrator logged in again.

Testing both authorized and unauthorized requests demonstrated that successful API functionality alone is not enough. A secure application must also verify that a caller has the required authentication before allowing access to protected operations.

### Frontend Integration Testing

After the API had been tested independently, the Angular SPA was tested as a complete client. The trip listing was verified against data returned by the GET endpoint. New trips were added through the Angular form, existing trips were edited, and the resulting changes were checked both in the interface and in MongoDB.

Authentication state was also tested in the UI. Administrative controls were displayed when the user was authenticated and hidden after logout. Together, these tests confirmed that the Angular components, services, REST API, authentication middleware, and database operated as a complete system.

---

## Reflection

CS 465 strengthened my understanding of how the different technologies in a modern web application operate together as a complete system. Rather than viewing frontend development, backend programming, APIs, databases, and security as isolated topics, the Travlr Getaways project required me to work with the complete flow of information from the user interface through the server and database and back to the user.

The course gave me practical experience with Node.js, Express, Handlebars, Angular, TypeScript, MongoDB, Mongoose, RESTful API development, JSON, client-side routing, reusable components, reactive forms, HTTP requests, API testing, and JWT-based authentication. I also developed a better understanding of software architecture and separation of concerns by dividing responsibilities among routes, controllers, services, components, models, and middleware.

One particularly useful skill was learning to troubleshoot problems across application layers. A problem visible in the browser might originate in an Angular component, an HTTP request, an authorization header, an Express route, a controller, a Mongoose query, or the database itself. Learning to trace a request through these layers made debugging more systematic and gave me a better understanding of how full-stack systems operate.

These skills make me better prepared for software engineering and other technical roles because I can understand and work with systems that span multiple technologies rather than focusing on only one layer. Even in roles where I am not responsible for implementing every part of an application, being able to understand APIs, data flow, authentication, databases, and frontend/backend interactions provides a stronger technical foundation.

The completed Travlr Getaways application also gives me a concrete portfolio artifact that demonstrates my ability to apply these concepts in a working project. It provides practical experience and technical decisions that I can discuss in interviews rather than only listing individual technologies on a résumé.
