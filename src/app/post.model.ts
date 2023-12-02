export class Post {
  constructor(
    public id: string, // Add this line
    public title: string,
    public imgPath: string,
    public description: string,
    public author: string,
    public authorEmail: string,
    public date: Date,
    public numberoflikes: number,
    public likes: string[] = [], // Add this line
    public comments: { userId: string, email: string, comment: string, timestamp: Date }[],
    public userId: string
  ) {}
}
