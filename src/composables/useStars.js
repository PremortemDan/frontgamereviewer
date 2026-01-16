import { ref, computed } from 'vue'

export const useStars = () => {
  const renderStars = (score) => {
    const starCount = 5
    const filledStars = Math.round((score / 100) * starCount)
    
    let starsHTML = ''
    for (let i = 0; i < starCount; i++) {
      starsHTML += i < filledStars
        ? '<i class="fas fa-star"></i>'
        : '<i class="far fa-star"></i>'
    }
    return starsHTML
  }

  const getStarArray = (score) => {
    const starCount = 5
    const filledStars = Math.round((score / 100) * starCount)
    
    const stars = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        filled: i < filledStars,
        index: i
      })
    }
    return stars
  }

  return {
    renderStars,
    getStarArray
  }
}
