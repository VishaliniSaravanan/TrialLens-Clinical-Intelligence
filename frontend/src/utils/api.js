import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 600000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
})

export const analyzePaper = (file, paperId, diseaseArea, onProgress) => {
  const form = new FormData()
  form.append('file', file)
  form.append('paper_id', paperId)
  form.append('disease_area', diseaseArea)
  return api.post('/analyze', form, {
    onUploadProgress: e => onProgress && e.total && onProgress(Math.round(e.loaded / e.total * 100))
  }).then(r => r.data)
}

export const queryPaper    = (question, paperId, section) =>
  api.post('/query', { question, paper_id: paperId, section }).then(r => r.data)

export const getInflation  = (paperId) =>
  api.get(`/inflation/${encodeURIComponent(paperId)}`).then(r => r.data)

export const getComparison = (paperId) =>
  api.get(`/compare/${encodeURIComponent(paperId)}`).then(r => r.data)

export const getPapers     = () =>
  api.get('/papers').then(r => r.data)

export const getPaperText  = (paperId) =>
  api.get(`/paper_text/${encodeURIComponent(paperId)}`).then(r => r.data)

export const getLibrary    = () =>
  api.get('/library').then(r => r.data)

export const analyzeLibrary = (filename, diseaseArea) =>
  api.post('/library/analyze', { filename, disease_area: diseaseArea }).then(r => r.data)

export const fetchPaper    = (url) =>
  fetch(`/api/fetch_paper?url=${encodeURIComponent(url)}`)

export const healthCheck   = () =>
  api.get('/health').then(r => r.data)
