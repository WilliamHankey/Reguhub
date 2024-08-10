const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectsRouter = require('./routes/projects');
const workersRouter = require('./routes/workers');
const projectFlowsRouter = require('./routes/projectFlows');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://wchankey15:Amethyis15@cluster0.slydm6y.mongodb.net/reguhub';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

app.use('/projects', projectsRouter);
app.use('/workers', workersRouter);
app.use('/projectFlows', projectFlowsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
