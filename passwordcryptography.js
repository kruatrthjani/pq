const express= require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app =express()
let hashed
let pass 
let passi
async function encrypt (pass){
	try{
		let plainPassword=pass;
		const hash = await bcrypt.hash(plainPassword, saltRounds);
		if(!hash){
			throw new Error("not hashed")
		}
        hashed = hash;
        console.log('Hashed password:', hash);
        console.log('Hashed password after: ', hashed);
        return hashed;
    } catch (e) {
        console.log("incorrect", e);
        throw new Error("invalid");
    }
}
 



async function decrypt(passi,hash){
	try{		
		const unhash= await bcrypt.compare(passi,hash)						
		if(!unhash){
			throw new Error("not hashed")
		}        
        console.log('Hashed password:', hash);        
		console.log("correctly matched")		
        return unhash;		
    } catch (e) {
        console.log("incorrect", e);
        throw new Error("invalid");
    }
}

module.exports={encrypt,decrypt}