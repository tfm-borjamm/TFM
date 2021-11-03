export class User {
  id: string;
  email: string;
  name: string;
  street: string;
  cp: string;
  telephone: string;
  province: string;
  role: string;
  // idPublications?: { [id: string]: { id: string; type: string; province: string; filter: string }[] };
  // idFavorites?: { [id: string]: { id: string; type: string; province: string; filter: string }[] };
  // myPublications?: { [id: string]: { id: string; type: string; province: string; filter: string }[] };
  // myFavorites?: { [id: string]: { id: string; type: string; province: string; filter: string }[] };
  // myHistory?: { [id: string]: { id: string; type: string; province: string; filter: string }[] };
  myPublications?: { [id: string]: { id: string }[] };
  myFavorites?: { [id: string]: { id: string }[] };
  myHistory?: { [id: string]: { id: string }[] };
}
