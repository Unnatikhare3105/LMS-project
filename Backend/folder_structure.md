backend/
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts
    ├── server.ts
    │
    ├── config/
    │   └── config.ts
    │
    ├── db/
    │   └── db.ts
    │
    ├── types/
    │   └── index.ts
    │
    ├── models/
    │   ├── user.model.ts
    │   ├── syllabus.model.ts
    │   ├── quiz.model.ts
    │   ├── bookmark.model.ts new
    │   └── dailyChallenge.model.ts new
    │
    ├── repositories/ new layer
    │   ├── user.repository.ts
    │   ├── syllabus.repository.ts
    │   ├── quiz.repository.ts
    │   ├── bookmark.repository.ts
    │   └── dailyChallenge.repository.ts
    │
    ├── services/
    │   ├── ai.service.ts
    │   ├── user.service.ts
    │   ├── syllabus.service.ts
    │   ├── quiz.service.ts
    │   ├── bookmark.service.ts new
    │   ├── dailyChallenge.service.ts new
    │   └── redis.service.ts
    │
    ├── controllers/
    │   ├── user.controller.ts
    │   ├── syllabus.controller.ts
    │   ├── quiz.controller.ts
    │   ├── bookmark.controller.ts new
    │   └── dailyChallenge.controller.ts new
    │
    ├── routers/
    │   ├── user.routes.ts
    │   ├── syllabus.routes.ts
    │   ├── quiz.routes.ts
    │   ├── bookmark.routes.ts new
    │   └── dailyChallenge.routes.ts new
    │
    ├── middlewares/
    │   ├── auth.middleware.ts
    │   └── error.middleware.ts new
    │
    └── utils/
        ├── customError.ts
        ├── logger.ts
        ├── emailService.ts
        ├── verificationCode.ts
        └── socket.io.ts