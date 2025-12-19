import { renderHook, waitFor } from '@testing-library/react'
import { useNutrition } from './use-nutrition'

global.fetch = jest.fn()

describe('useNutrition', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should analyze food successfully', async () => {
    const mockData = {
      name: 'Apple',
      calories: 95,
      macros: {
        protein: 0.5,
        carbs: 25,
        fats: 0.3,
        fiber: 4.4,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => useNutrition())

    await result.current.analyzeFood('Apple', '100g')

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle errors', async () => {
    const mockError = new Error('API Error')
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useNutrition())

    await result.current.analyzeFood('Apple', '100g')

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to analyze food. Please try again.')
      expect(result.current.loading).toBe(false)
    })
  })
})
