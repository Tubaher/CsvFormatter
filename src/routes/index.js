const express = require('express')
const router = express.Router()
const axios = require('axios').default
const csvParser = require('csv-string')

axios.defaults.baseURL = 'https://echo-serv.tbxnet.com/v1/secret'
axios.defaults.headers.common.Authorization = 'Bearer aSuperSecretKey'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const isNumber = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str))
}

const regex = /[0-9A-Fa-f]{32}/g
const isHex = (number) => { return number.match(regex) }

const checkErrors = (value) => {
  if (value.text === undefined || value.text === '') {
    return null
  } else if (value.number === undefined || value.number === '' || !isNumber(value.number)) {
    return null
  } else if (value.hex === undefined || value.hex === '' || !isHex(value.hex)) {
    return null
  } else {
    return value
  }
}

const parseLines = (csvData) => {
  return csvData.reduce((previusLine, currentLine) => {
    const noErrorsLine = checkErrors(currentLine)
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
    const processedData = csvData !== [] ? parseLines(csvData) : []
    const processedFile = {
      file: fileName,
      lines: processedData
    }
    return processedFile
  } catch (error) {
    return {}
  }
}

const getFiles = async () => {
  try {
    const response = await axios.get('/files')
    return response.data.files
  } catch (error) {
    return []
  }
}

const parseFiles = async () => {
  const files = await getFiles()
  const parsedFiles = await files.reduce(async (previousFilePromise, currentFile) => {
    const previousFile = await previousFilePromise
    const parsedFile = await getSingleFile(currentFile)
    return Object.keys(parsedFile).length !== 0 ? [...previousFile, parsedFile] : previousFile
  }, [])

  return parsedFiles
}

router.get('/files/data', async function (req, res, next) {
  res.type('application/json')
  res.status(200).send(
    await parseFiles()
  )
})

module.exports = router
