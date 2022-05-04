const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const { emailValidation, passwordValidation } = require('./middlewares/loginMiddlewares');
const { tokenValidation } = require('./middlewares/authTokenMiddleware');
const { 
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
} = require('./middlewares/newTalkerMiddleware');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

// status
const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND_STATUS = 404;

const filePath = './talker.json';

// pegar a lista completa
const getTalkersList = async () => {
  const response = await fs.readFile(filePath);
  const data = JSON.parse(response);
  return data;
};

// gera um token aleatório 
const createToken = () => {
  let token = '';
  for (let i = 1; i <= 16; i += 1) {
      token += (Math.floor(Math.random() * 10));
  }

  return token;
};

// requisito 01
app.get('/talker', async (_req, res) => {
  const allTalkersList = await getTalkersList();
  if (allTalkersList === undefined) return res.status(HTTP_OK_STATUS).json([]);
  return res.status(HTTP_OK_STATUS).json(allTalkersList);
});

// requisito 02
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const allTalkersList = await getTalkersList();
  const talkerById = allTalkersList.find((talker) => talker.id === Number(id));
  if (talkerById === undefined) {
    return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerById);
});

// requisitos 03 e 04
app.post('/login', emailValidation, passwordValidation, (_req, res) => {
  res.status(HTTP_OK_STATUS).json({ token: createToken() });
});

app.post('/talker',
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
  async (req, res) => {
  const { name, age, talk } = req.body;

  const talkersList = await getTalkersList();
  const id = talkersList.length + 1;
  const newTalker = ({ id, name, age, talk });

  talkersList.push(newTalker);

  fs.writeFile(filePath, JSON.stringify(talkersList));

  return res.status(201).json({ 
    id,
    name,
    age,
    talk,
   });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
