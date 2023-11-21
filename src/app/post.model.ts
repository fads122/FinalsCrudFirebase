export class Post {
    constructor(
        public id: string,
        public title: string,
        public imgPath: string,
        public description: string,
        public author: string,
        public dateCreated: Date,
        public numberoflikes: number,
        public comments: string[] = [],
        public userId: string // Add this line
    ) {}
}

        {

        }


