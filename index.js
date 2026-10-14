const express = require('express');
const fs = require('fs');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'dados.json');

const defaultData = {
  nome: 'Maria Silva',
  gmail: 'maria.silva@gmail.com',
  senha: '123456',
  idade: 25,
  cidade: 'São Paulo'
};

function readData() {
  try {
    const file = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
    return { ...defaultData };
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', __dirname);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('pessoal', { pessoa: readData() });
});

app.post('/salvar', (req, res) => {
  const pessoa = {
    nome: req.body.nome || '',
    gmail: req.body.gmail || '',
    senha: req.body.senha || '',
    idade: Number(req.body.idade) || 0,
    cidade: req.body.cidade || ''
  };

  saveData(pessoa);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


