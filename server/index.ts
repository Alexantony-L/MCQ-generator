import express from 'express';
import cors from 'cors';
import videoRoutes from './routes/videoRoutes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/video', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
