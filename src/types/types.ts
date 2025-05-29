export type Game = {
   _id: string,
   title: string,
   description: string,
   imageURL: string,
   price: number,
   rating: number,
   platform: string,
   genre: string,
   releaseDate: string,
   _createdBy: string,
}

export type NewGame = Omit<Game, '_id' | '_createdBy'> & { _createdBy?: string } // Omit the _id and _createdBy fields (createdBy is required) then add the _createdBy field back as an optional field

export type User = {
   _id: string,
   name: string,
   email: string,
   password: string,
   registerDate: string
}