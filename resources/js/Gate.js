export default class Gate{

    constructor(user){
        this.user = user;
    }


    admin(){
        return this.user.type === 'admin';
    }

    user(){
        return this.user.type === 'user';
    }
    adminOrAuthor(){
        if(this.user.type === 'admin' || this.user.type === 'author'){
            return true;
        }

    }
    authorOrUser(){
        if(this.user.type === 'user' || this.user.type === 'author'){
            return true;
        }

    }



}