const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { response } = require('express')
const generateUUV4Id = require('uuid').v4

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const questionById = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  if (questionById) res.json(questionById)
  else res.sendStatus(404)
})

app.post('/questions', async (req, res) => {
  if (!req.body.question) {
    res.status(406).send({ msg: 'Please provide question' })
  } else if (!req.body.question.author) {
    res.status(406).send({ msg: 'Please provide question author' })
  } else if (!req.body.question.summary) {
    res.status(406).send({ msg: 'Please provide question summary' })
  } else {
    req.repositories.questionRepo
      .addQuestion({
        id: generateUUV4Id(),
        author: req.body.question.author,
        summary: req.body.question.summary,
        answers: []
      })
      .then(() => res.status(201).send({ msg: 'Question added' }))
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  if (!answers) {
    res
      .status(404)
      .send({ msg: `Question with id ${req.params.questionId} not found` })
  } else {
    res.json(answers)
  }
})

app.post('/questions/:questionId/answers', (req, res) => {
  if (!req.body.answer) {
    res.status(406).send({ msg: 'Please provide answer' })
  } else if (!req.body.answer.author) {
    res.status(406).send({ msg: 'Please provide answer author' })
  } else if (!req.body.answer.summary) {
    res.status(406).send({ msg: 'Please provide answer summary' })
  } else {
    const answer = {
      id: generateUUV4Id(),
      author: req.body.answer.author,
      summary: req.body.answer.summary
    }
    req.repositories.questionRepo
      .addAnswer(req.params.questionId, answer)
      .then(() => {
        res.send(200)
      })
  }
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(
    req.params.questionId,
    req.params.answerId
  )
  if (answer) {
    res.json(answer)
  } else {
    res
      .status(404)
      .send({ msg: `Answer with id ${req.params.answerId} not found` })
  }
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
