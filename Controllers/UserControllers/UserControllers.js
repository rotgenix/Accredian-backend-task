import { databseConfiguration } from "../../Database/Database.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const loginCheck = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        res.json({
            success: true,
            message: "User is Logged in",
        })
    }
    else {
        res.json({
            success: false,
            message: "User is not Logged in",
        })
    }
}

export const userRegisterController = async (req, res) => {
    const {
        name,
        username,
        email,
        password,
    } = req.body;

    //Checking Email
    var emailQuery = 'SELECT email from userData where email = ?';
    databseConfiguration.query(emailQuery, [email], async (error, result) => {
        if (error) {
            return res.json({
                success: false,
                message: "Server error while registerring."
            })
        }
        //Email exists
        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Email already exists! Please login."
            })
        }
        else {
            var userNameQuery = 'SELECT username from userData where username = ?';
            databseConfiguration.query(userNameQuery, [username], async (error, result) => {
                //Error in DB
                if (error) {
                    return res.json({
                        success: false,
                        message: "Server error while registerring."
                    })
                }
                //Username exists
                if (result.length > 0) {
                    return res.json({
                        success: false,
                        message: "Username taken. Please choose another."
                    })
                }
                else {
                    //Registering User
                    var userQuery = 'INSERT INTO userData(name, username, email, password) VALUES(?,?,?,?)';
                    const hashedPassword = await bcrypt.hash(password, 10);
                    databseConfiguration.query(userQuery, [name, username, email, hashedPassword], (error, result) => {
                        //Error in DB
                        if (error) {
                            return res.json({
                                success: false,
                                message: "Server error while Registering."
                            })
                        }
                        return res.json({
                            success: true,
                            message: "User Registered Successfully!. Please Login",
                            result
                        })
                    });
                }
            });
        }
    });
}

export const userLoginController = async (req, res) => {
    const {
        email,
        password,
    } = req.body;
    //Checking Email
    var emailQuery = 'SELECT * from userData where email = ?';
    databseConfiguration.query(emailQuery, [email], async (error, result) => {
        //Error in DB
        if (error) {
            return res.json({
                success: false,
                message: "Server error while registerring."
            })
        }
        //Email exists
        if (result.length == 0) {
            return res.json({
                success: false,
                message: "Email Not registered. PLease Register."
            })
        }
        else {
            const isMatch = await bcrypt.compare(password, result[0].password);
            const userData = {
                name: result[0].name,
                username: result[0].username,
                email: result[0].email,
            };
            //Password mmatch condition
            if (isMatch) {
                const userID = result[0].userID;
                const token = jwt.sign(userID, process.env.JWT_SECRET);
                return res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                    sameSite: "none",
                    secure: true,
                }).json({
                    success: true,
                    message: "User Logged In Successfully",
                    userData
                })
            }
            else {
                return res.json({
                    success: false,
                    message: "Invalid Credentials"
                })
            }
        }
    });
}

export const userLogoutController = async (req, res) => {
    const { token } = req.cookies;
    // console.log(token)
    if (token) {
        res.status(201).cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now()),
            sameSite: "none",
            secure: true,
        }).json({
            success: 'true',
            messsage: "You are Logged out Successfully",
            // userLogin
        })
    }
    else {
        res.json({
            success: false,
            messsage: "Please Login first",
            // userLogin
        })
    }
}

