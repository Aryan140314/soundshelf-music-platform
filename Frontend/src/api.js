import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export const register = (data) => client.post('/auth/register', data)
export const login = (data) => client.post('/auth/login', data)
export const logout = () => client.post('/auth/logout')

export const getMusics = () => client.get('/music')
export const getAlbums = () => client.get('/music/albums')
export const getAlbumById = (id) => client.get(`/music/albums/${id}`)

export const uploadMusic = (formData) => client.post('/music/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const createAlbum = (data) => client.post('/music/album', data)

export default client
