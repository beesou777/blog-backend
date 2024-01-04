interface User {
    name: string;
    email: string;
    phone: string;
    gender: string;
    profile: string;
    password: string;
    isAdmin: boolean;
    role:String;
    viewedBy:String[];
    followers:String[];
    following:String[];
    postCount:Number;
    active:Boolean;
    posts:String[];
}