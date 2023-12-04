export class Post {
  constructor(
    public id: string,
    public title: string,
    public imgPath: string,
    public description: string,
    public author: string,
    public authorEmail: string,
    public date: Date,
    public numberoflikes: number,
    public likes: string[] = [],
    public comments: { userId: string, email: string, comment: string, timestamp: Date }[] = [],
    public userId: string,
    public likedByUsers: string[] = [],
    public notifications: { type: string, userId: string, recipientId: string, timestamp: Date }[] = []
  ) {}
}
