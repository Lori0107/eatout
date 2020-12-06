import Rating from './ratingInterface'
import Position from './gmapPositionInterface'

export default interface Restaurant {
  id: number,
  restaurantName: string,
  address: string,
  ratings: Rating[],
  lat: number,
  long: number,
  position? : Position,
  averageRating? : number,
  totalRatings? : number
}