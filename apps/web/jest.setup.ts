import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

// React Testing Library ud655uc7a5 ub9e4ucc98 uc124uc815
import '@testing-library/jest-dom'

// uae00ub85cubc8c fetch ubaa8ud0b9 uc124uc815
global.fetch = jest.fn()

// uae30ubcf8 ud0c0uc784uc544uc6c3 uc124uc815
jest.setTimeout(10000)