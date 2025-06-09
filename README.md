# Full Stack E-commerce Application

This is a full-stack e-commerce web application built with Angular (frontend) and Spring Boot (backend). It supports product browsing, category filtering, shopping cart, and checkout with order placement.

---

## Features

- Product listing with pagination and category filtering
- Product search (by name or description)
- Product details page
- Shopping cart with add/remove/update quantity
- Checkout form with validation
- Dynamic country/state selection (fetched from external API)
- Order placement and backend persistence

---

## Tech Stack

- **Frontend:** Angular 17, Bootstrap 5, FontAwesome, RxJS, ng-bootstrap
- **Backend:** Spring Boot 3, Spring Data JPA, PostgreSQL, Lombok
- **Database:** PostgreSQL

---

## Project Structure

```
backend/   # Spring Boot backend
frontend/  # Angular frontend
```

---

## Getting Started

### Prerequisites

- Node.js & npm
- Angular CLI (`npm install -g @angular/cli`)
- Java 17+
- Maven
- PostgreSQL

---

### Backend Setup

1. **Configure Database**

   - Create a PostgreSQL database named `full-stack-ecommerce`.
   - Create a user `ecommerceapp` with password `ecommerceapp` and grant privileges.

2. **Edit Database Credentials**

   - See [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties) for DB config.

3. **Build & Run Backend**

   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```

   The backend will start on [http://localhost:8080](http://localhost:8080).

---

### Frontend Setup

1. **Install Dependencies**

   ```sh
   cd frontend
   npm install
   ```

2. **Run Frontend**

   ```sh
   npm start
   ```

   The frontend will be available at [http://localhost:4200](http://localhost:4200).

---

## API Endpoints

- **Products:** `/api/products`
- **Product Categories:** `/api/product-category`
- **Checkout:** `/api/checkout/purchase`
- **Countries/States:** `/api/countries-states`

---

## Running Tests

- **Frontend:**  
  ```sh
  npm test
  ```
- **Backend:**  
  ```sh
  ./mvnw test
  ```

---




## Acknowledgements

- [Angular](https://angular.io/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Bootstrap](https://getbootstrap.com/)
- [countriesnow.space API](https://countriesnow.space/)
