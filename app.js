const express = require('express');
const bodyParser = require('body-parser');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

// Configure i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
   fallbackLng: 'en',
   backend: {
     loadPath: './locales/{{lng}}/translation.json'
   }
  })

// Log missing translation keys for debugging
i18next.on('missingKey', (lng, ns, key) => {
  console.log(`Missing key ${key} in language ${lng}`);
});

// Use i18next middleware to handle translations
app.use(middleware.handle(i18next));

// Routes
app.get('/', (req, res) => {
  console.log('Requested language:', req.language); // Log requested language
  res.send(req.t('welcomeMessage')); // Use i18next to fetch the translated message
});

// Use routes from the routes module
app.use('/api', require('./routes'));

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
