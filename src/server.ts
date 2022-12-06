import App from './app';
import HealthRoute from './routes/health.route';
import SKURoute from './routes/sku.route';

const app = new App([new HealthRoute(), new SKURoute()]);

app.listen();

export default app;