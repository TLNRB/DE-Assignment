export type Game = {
   id: string,
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

export type NewGame = Omit<Game, 'id' | '_createdBy'> & { _createdBy: string } // Omit the id and _createdBy fields (createdBy is required) then add the _createdBy field back as an optional field

export type User = {
   id: string,
   name: string,
   email: string,
   password: string,
   registerDate: string
}