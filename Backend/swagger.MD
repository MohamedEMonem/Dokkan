# 📚 Dokkan API Documentation Guide

We use **Swagger UI** combined with **Swagger Autogen** to automatically generate and serve our API documentation. This keeps our code clean and our docs perfectly in sync with our actual endpoints.

## 🔗 Viewing the Docs

1. Start the development server (`npm run dev` or `npm start`).
2. Open your browser and navigate to: **`http://localhost:3000/api/docs`**

---

## 🛠 How to Document a New Route

You do **not** need to manually edit the `swagger-output.json` file. Instead, we use "Magic Comments" directly inside our route handlers.

Whenever you add a new endpoint, follow these three steps:

### Step 1: Add the Magic Comment
Place a comment block *inside* the route definition, right before your controller logic. At minimum, every route needs a `#swagger.tags` and `#swagger.summary`.

**Basic Example:**
```typescript
router.get("/my-new-route", 
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Get a list of special products'
  */
  myControllerFunction
);
```

### Step 2: Add Parameters or Request Bodies (If needed)
If your route expects data (like a POST body or query parameters), define it in the comment so the Swagger UI can build an interactive form for testing.

**Advanced Example (POST request with body and Auth):**
```typescript
router.post("/create", auth, 
  /* #swagger.tags = ['Stores']
     #swagger.summary = 'Create a new store'
     #swagger.security = [{ "bearerAuth": [] }] 
     #swagger.requestBody = {
       required: true,
       content: {
         "application/json": {
           schema: {
             type: "object",
             properties: {
               name: { type: "string", example: "My Cool Store" },
               location: { type: "string", example: "Cairo" }
             }
           }
         }
       }
     }
  */
  createStoreController
);
```

### Step 3: Generate the Docs!
Once you have added your comments, you must tell the generator to crawl the code and update the JSON file.

Run this command from the root of the `Backend` folder:
```bash
node swagger.cjs
```
Restart your server, refresh the page, and your new route will be there!

---

## 📝 Cheat Sheet for Magic Comments

Here are the most common tags you will use:

* **Group the route (Required):** `#swagger.tags = ['Auth']` *(Available tags: Auth, Stores, Categories, Products, Cart)*
* **Short description:** `#swagger.summary = 'What this does'`
* **Long description:** `#swagger.description = 'Detailed explanation here.'`
* **Require Bearer Token:** `#swagger.security = [{ "bearerAuth": [] }]`
* **Documenting a URL param (e.g., `/:id`):** `#swagger.parameters['id'] = { description: 'The unique ID' }`
* **Custom Responses:** `#swagger.responses[200] = { description: 'Success!' }`
    `#swagger.responses[404] = { description: 'Not found.' }`


Ah, I see what you mean! The "comment thing" isn't actually part of the official Swagger/OpenAPI specification itself—it is a special feature built specifically into the **`swagger-autogen`** library that we used to scan your code.

You can find the complete, official documentation for every single `#swagger` magic comment you can use right here on their official docs site:

### 🔗 **[Official swagger-autogen Documentation](https://swagger-autogen.github.io/docs/)**

Specifically, you will want to look at the **"Endpoints"** section in their sidebar. That is where they keep the master list of all the comment tricks.

Here are the most useful sections you will find in that documentation:

* **[Parameters](https://swagger-autogen.github.io/docs/endpoints/parameters):** How to document path variables (`/:id`), query strings (`?sort=desc`), and headers.
* **[Request Body](https://swagger-autogen.github.io/docs/endpoints/body):** How to define the exact JSON payload a user needs to send for a `POST` or `PATCH` request.
* **[Responses](https://swagger-autogen.github.io/docs/endpoints/responses):** How to document different status codes (like what a `404 Not Found` or `400 Bad Request` returns).
* **[Security](https://swagger-autogen.github.io/docs/endpoints/security):** How to apply different types of authentication (like the Bearer tokens you are using) to specific routes.

It is a fantastic cheat sheet to keep bookmarked as you and your friends continue building out the Dokkan API!