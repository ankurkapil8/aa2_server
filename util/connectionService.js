const Connection = {

    // data property
    connectionObj: {},
    
    // accessor property(getter)
     getConnection:()=> {
        return this.connectionObj;
    },
    setConnection:(connection)=> {
        this.connectionObj = connection;
    }

};
module.exports  = Connection