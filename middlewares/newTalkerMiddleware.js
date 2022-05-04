const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });

  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const ageValidation = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });

  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400)
      .json({ 
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      });
  }

  next();
};

// para implemetar o regex usei algumas informações desse link: https://stackoverflow.com/questions/5465375/javascript-date-regex-dd-mm-yyyy
const dateValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk.watchedAt) {
    return res.status(400)
      .json({ 
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      });
  }

  const dateRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;

  if (!dateRegex.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  
  next();
};

const rateValidation = (req, res, next) => {
  const { talk } = req.body;

  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  if (!talk.rate) {
    return res.status(400)
      .json({ 
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      });
  }

  next();
};

module.exports = {
  nameValidation,
  ageValidation,
  talkValidation,
  dateValidation,
  rateValidation,
};