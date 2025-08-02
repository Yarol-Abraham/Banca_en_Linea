require('dotenv').config();
const mongoose = require('mongoose');

// - conectar base de datos
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Base de datos Conectada!'))

.catch(err => console.error(err));

// - configuración de API 
const app = require('./app');
const PORT = process.env.PORT || 3000;

// - ejecución de servidor
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});