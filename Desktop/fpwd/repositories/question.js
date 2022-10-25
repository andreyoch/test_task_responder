const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async (questions, questionId) => {
    const searchedQuestionById = questions.find(q => q.id === questionId)

    return searchedQuestionById
  }
  const addQuestion = async newQuestion => {
    const questions = await getQuestions()
    questions.push(newQuestion)

    return writeFile(fileName, JSON.stringify(questions), { encoding: 'utf-8' })
  }
  const getAnswers = async questionId => {}
  const getAnswer = async (questionId, answerId) => {}
  const addAnswer = async (questionId, answer) => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
