const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND_STATUS = 404;
const PORT = '3000';

const filePath = './talker.json';

const getTalkersList = async () => {
  const response = await fs.readFile(filePath);
  const data = JSON.parse(response);
  return data;
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
  const talkerById = allTalkersList.find((talker) => Number(talker.id) === Number(id));
  if (talkerById === undefined) {
    return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerById);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
