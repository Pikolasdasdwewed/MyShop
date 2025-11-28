require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { initDb } = require('./models');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express();

// ======= Настройки шаблонов и статики =======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ======= Парсеры =======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ======= Сессии =======
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

// ======= Прокидываем юзера в шаблоны =======
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// ======= Маршруты =======
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// ======= Swagger =======
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: req => {
        req.credentials = 'include';
        return req;
      }
    },
    customSiteTitle: 'MyShop API Documentation'
  })
);

app.get('/swagger.json', (req, res) => res.json(swaggerDocument));

// ======= Инициализация БД и запуск =======
const port = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`MyShop running at http://localhost:${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
  })
  .catch(err => {
    console.error('Database init failed:', err);
    process.exit(1);
  });

module.exports = app;
