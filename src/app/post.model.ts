export class Post {
  constructor(
    public title: string,
    public imgPath: string,
    public description: string,
    public author: string,
    public authorEmail: string,
    public date: Date,
    public numberoflikes: number,
    public comments: { userId: string, comment: string }[],
    public userId: string,

  ) {}
  }



