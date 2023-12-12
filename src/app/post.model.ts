export class Post {
  constructor(
    public id: string = '',
    public title: string = '',
    public imgPath: string = '',
    public description: string = '',
    public author: string = '',
    public authorEmail: string = '',
    public date: Date = new Date(),
    public order: number = 0,
    public numberoflikes: number = 0,
    public likes: string[] = [],
    public comments: { userId: string, email: string, comment: string, timestamp: Date }[] = [],
    public userId: string = '',
    public likedByUsers: string[] = [],
    public notifications: { type: string, userId: string, recipientId: string, timestamp: Date }[] = [],
    public sharedBy?: string
  ) {}
}
