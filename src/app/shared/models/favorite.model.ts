export class Favorite {
  [id: string]: {
    id: [id: string];
    users: {
      [userId: string]: [userId: string][];
    };
  };
}
