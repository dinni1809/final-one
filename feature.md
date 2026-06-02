With only these 3 collections:

```text
users
restaurants
menuItems
```

you can still build a very solid Restaurant Discovery API.

---

# 1. Authentication Features (Users)

## Register User

```http
POST /api/auth/register
```

Purpose:

* Create new account

---

## Login User

```http
POST /api/auth/login
```

Purpose:

* Username/password login

---

## Google Login

```http
POST /api/auth/google
```

Purpose:

* Google authentication

---

## Get Current User

```http
GET /api/auth/me
```

Purpose:

* Fetch logged-in user details

---

## Logout

```http
POST /api/auth/logout
```

Purpose:

* End session

---

# 2. Restaurant Discovery Features

This is your core module.

---

## Get All Restaurants

```http
GET /api/restaurants
```

Purpose:

* Display all restaurants

Supports:

* Pagination
* Sorting

---

## Get Restaurant By ID

```http
GET /api/restaurants/:id
```

Purpose:

* Restaurant detail page

Returns:

* Name
* Area
* Cuisine
* Rating
* Style
* Description
* Image
* Menu

---

## Search Restaurant By Name

```http
GET /api/restaurants/search?q=bawarchi
```

Purpose:

* Search box

Examples:

```text
Bawarchi
KFC
Casino
```

---

# 3. Filter Features

This is the most important API.

---

## Advanced Filter API

```http
GET /api/restaurants/filter
```

Supports:

### Area

```text
RT Nagar
Rajajinagar
Koramangala
```

---

### Cuisine

```text
Indian
Chinese
Italian
Fast Food
```

---

### Price

```text
Budget
Mid
Premium
```

---

### Rating

```text
8+
9+
9.5+
```

---

### Restaurant Style

```text
Cafe
Buffet
Fine Dining
Bakery
Dessert
```

---

### Menu Item

```text
Biryani
Pizza
Burger
Ice Cream
```

Example:

```http
GET /api/restaurants/filter?
area=RT Nagar&
cuisine=Indian&
price=Budget&
rating=9
```

---

# 4. Filter Metadata APIs

Instead of hardcoding dropdowns.

---

## Get All Areas

```http
GET /api/restaurants/areas
```

Returns:

```json
[
  "RT Nagar",
  "Rajajinagar",
  "Koramangala"
]
```

---

## Get All Cuisines

```http
GET /api/restaurants/cuisines
```

Returns:

```json
[
  "Indian",
  "Chinese",
  "Italian"
]
```

---

## Get Restaurant Styles

```http
GET /api/restaurants/styles
```

Returns:

```json
[
  "Cafe",
  "Buffet",
  "Bakery"
]
```

---

## Get Price Categories

```http
GET /api/restaurants/prices
```

Returns:

```json
[
  "Budget",
  "Mid",
  "Premium"
]
```

---

# 5. Menu APIs

---

## Get Restaurant Menu

```http
GET /api/menu/:restaurantId
```

Purpose:

Load menu on restaurant details page.

---

## Search Menu Items

```http
GET /api/menu/search?q=biryani
```

Purpose:

Find restaurants serving a dish.

Example:

```text
Chicken Biryani
Mutton Biryani
Pizza
```

---

# 6. Homepage APIs

Useful for nice UI.

---

## Top Rated Restaurants

```http
GET /api/restaurants/top-rated
```

Returns:

Highest-rated restaurants.

---

## Featured Restaurants

```http
GET /api/restaurants/featured
```

Purpose:

Hero section.

---

## Recently Added Restaurants

```http
GET /api/restaurants/recent
```

Purpose:

New additions.

---

# 7. Admin Features

---

## Add Restaurant

```http
POST /api/admin/restaurants
```

---

## Update Restaurant

```http
PUT /api/admin/restaurants/:id
```

---

## Delete Restaurant

```http
DELETE /api/admin/restaurants/:id
```

---

## Add Menu Item

```http
POST /api/admin/menu
```

---

## Update Menu Item

```http
PUT /api/admin/menu/:id
```

---

## Delete Menu Item

```http
DELETE /api/admin/menu/:id
```

---

# 8. Admin Dashboard APIs

---

## Restaurant Count

```http
GET /api/admin/stats/restaurants
```

Returns:

```json
{
  "totalRestaurants": 50
}
```

---

## Menu Count

```http
GET /api/admin/stats/menu
```

Returns:

```json
{
  "totalMenuItems": 500
}
```

---

## User Count

```http
GET /api/admin/stats/users
```

Returns:

```json
{
  "totalUsers": 100
}
```

---

# MVP Feature Set (What I Would Build First)

### Authentication

* Register
* Login
* Google Login

### Restaurant Discovery

* Get Restaurants
* Restaurant Details
* Search
* Filters

### Menu

* View Restaurant Menu
* Search Menu Item

### Admin

* Add Restaurant
* Edit Restaurant
* Delete Restaurant
* Add/Edit/Delete Menu

These APIs alone are enough to make FAATTSOO Restaurant Discovery feel like a complete production-ready application before you move on to the Explore City AI module.
