interface Comment {
    name: string;
    comment: string;
    user: any;
  }
  
  interface Like {
    name: string;
    user: any;
  }
  
  interface Blog {
    title: string;
    description: string;
    body: string;
    slug: string;
    category: string;
    writer: string;
    image: string;
    numOfLikes: number;
    numOfComments: number;
    comments: Comment[];
    likes: Like[];
  }
  