const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })
  test('should return question with specific id', async () => {
    const question = {
      id: '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    }
    await questionRepo.addQuestion(question)

    expect(
      await questionRepo.getQuestionById('50f9e662-fa0e-4ec7-b53b-7845e8f821c3')
    ).toEqual({
      id: '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
      summary: 'What is my name?',
      author: 'Jack London',
      answers: []
    })
  })
  test('Should add new question to existing questions', async () => {
    const question = {
      id: faker.datatype.uuid(),
      summary: 'How to exit from VIM?',
      author: 'Tim Doods',
      answers: []
    }
    const questionsBeforeAdd = await questionRepo.getQuestions()
    await questionRepo.addQuestion(question)
    const questionsAfterAdd = await questionRepo.getQuestions()

    expect(questionsAfterAdd.length).toBeGreaterThan(questionsBeforeAdd.length)
  })
  test('should return a list of answers for question with specific id', async () => {
    const question = {
      id: faker.datatype.uuid(),
      author: 'John Stockton',
      summary: 'What is the shape of the Earth?',
      answers: [
        {
          id: faker.datatype.uuid(),
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        },
        {
          id: faker.datatype.uuid(),
          author: 'Dr Strange',
          summary: 'It is egg-shaped.'
        }
      ]
    }
    await questionRepo.addQuestion(question)
    expect(await questionRepo.getAnswers(question.id)).toHaveLength(2)
  })
  test('should return answer with specific id', async () => {
    const question = {
      id: faker.datatype.uuid(),
      author: 'John Stockton',
      summary: 'What is the shape of the Earth?',
      answers: [
        {
          id: faker.datatype.uuid(),
          author: 'Brian McKenzie',
          summary: 'The Earth is flat.'
        },
        {
          id: faker.datatype.uuid(),
          author: 'Dr Strange',
          summary: 'It is egg-shaped.'
        }
      ]
    }
    await questionRepo.addQuestion(question)
    expect(
      await questionRepo.getAnswer(question.id, question.answers[0].id)
    ).toEqual(question.answers[0])
  })
})
