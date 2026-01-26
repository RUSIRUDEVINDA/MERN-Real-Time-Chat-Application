import express from 'express';

const signup = (req, res) => {
    const {email, fullname,password} = req.body;
    try{
        
    }catch(error){

    }
};

const login = (req, res) => {
    res.send("login route")
}

const logout = (req, res) => {
    res.send("logout route")
};

export { signup, login, logout };