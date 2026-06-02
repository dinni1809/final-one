backend/
│
├── src/
│
├── config/
│   ├── db.js
│   ├── passport.js
│   └── env.js
│
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   └── MenuItem.js
│
├── controllers/
│   ├── authController.js
│   ├── restaurantController.js
│   ├── menuController.js
│   ├── adminRestaurantController.js
│   └── adminMenuController.js
│
├── services/
│   ├── authService.js
│   ├── restaurantService.js
│   ├── menuService.js
│   └── adminService.js
│
├── repositories/
│   ├── userRepository.js
│   ├── restaurantRepository.js
│   └── menuRepository.js
│
├── routes/
│   ├── authRoutes.js
│   ├── restaurantRoutes.js
│   ├── menuRoutes.js
│   └── adminRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
│
├── validators/
│   ├── authValidator.js
│   ├── restaurantValidator.js
│   └── menuValidator.js
│
├── utils/
│   ├── generateToken.js
│   ├── pagination.js
│   ├── responseHandler.js
│   └── ApiError.js
│
├── constants/
│   ├── roles.js
│   ├── cuisines.js
│   ├── restaurantStyles.js
│   └── priceCategories.js
│
├── docs/
│   └── swagger.yaml
│
├── app.js
│
└── server.js
│
├── uploads/
│   ├── restaurants/
│   └── menu/
│
├── .env
├── .gitignore
├── package.json
└── README.md