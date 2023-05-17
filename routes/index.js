const express = require('express')
const router = express.Router()
const axios = require('axios').default
const csvParser = require('csv-string')

axios.defaults.baseURL = 'https://echo-serv.tbxnet.com/v1/secret'
axios.defaults.headers.common.Authorization = 'Bearer aSuperSecretKey'
axios.defaults.headers.post['Content-Type'] = 'application/json'

async function getFiles () {
  try {
    const response = await axios.get('/files')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const checkUndefined = (value) => {
  if (value.text === undefined) {
    return null
  } else if (value.number === undefined) {
    return null
  } else if (value.hex === undefined) {
    return null
  } else {
    return value
  }
}

const parseLines = (csvData) => {
  return csvData.reduce((previusLine, currentLine) => {
    const noErrorsLine = checkUndefined(currentLine)
    if (noErrorsLine) {
      return [...previusLine, { text: noErrorsLine.text, number: noErrorsLine.number, hex: noErrorsLine.hex }]
    } else {
      return previusLine
    }
  }, [])
}

async function getSingleFile (fileName) {
  try {
    const response = await axios.get('/file/' + fileName)
    const csvData = csvParser.parse(response.data, { output: 'objects' })
    const processedFile = parseLines(csvData)
    console.log(processedFile)
    console.log(typeof processedFile)
    return processedFile
  } catch (error) {
    console.error(error)
  }
}

router.get('/files/data', async function (req, res, next) {
  res.type('application/json')
  res.status(200).send(
    await getSingleFile('test2.csv')
  )
  console.log('works')
})

module.exports = router
