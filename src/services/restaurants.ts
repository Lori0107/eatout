import Restaurant from '../interfaces/restaurantInterface'
import Rating from '../interfaces/ratingInterface'

export const asyncForEach = async (array: any, callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index);
  }
}

const sumRatings = (ratings: Rating[]) => {
  const ratingValues = ratings.map(rating => rating.stars);
  return ratingValues.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
}

export const getAverageRating = (ratings: Rating[]) => {
  const sumRatingsValues: number = sumRatings(ratings);
  const averageRating = sumRatingsValues / ratings.length; 
  return averageRating.toFixed(0);
}

export const getFilteredRestaurants = (restaurants: Restaurant[], minFilter: Number, maxFilter: Number) => {
  return restaurants.filter((restaurant: Restaurant) => restaurant.averageRating >= minFilter && restaurant.averageRating <= maxFilter);
}

export const setIdToNewRestaurant = (restaurants: Restaurant[], newRestaurant: Restaurant) => { newRestaurant.id = restaurants.length + 1 };

export const setPositionToNewRestaurant = (position: any, newRestaurant: Restaurant) => { 
  newRestaurant.lat = position.lat;
  newRestaurant.long = position.long;
}

export const formatGplaceRestaurant = (gplaceRestaurant: any) => {
  return {
    id: gplaceRestaurant.place_id,
    restaurantName: gplaceRestaurant.name,
    address: gplaceRestaurant.vicinity,
    lat: gplaceRestaurant.geometry.location.lat,
    long: gplaceRestaurant.geometry.location.lng,
    ratings: gplaceRestaurant.ratings,
    position: {
      lat: gplaceRestaurant.geometry.location.lat, 
      lng: gplaceRestaurant.geometry.location.lng
    },
    averageRating: getAverageRating(gplaceRestaurant.ratings)
  }
}

export const checkIfIdExist = (restaurants: Restaurant[], gplaceRestaurantId: String) => {
  return restaurants.some(restaurant => restaurant.id.toString() === gplaceRestaurantId)
}