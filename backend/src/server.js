const app = require('./app');
const config = require('./config');

const PORT = config.port || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api/`);
});