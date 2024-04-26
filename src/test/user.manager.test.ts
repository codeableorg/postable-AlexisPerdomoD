import {assert, assertType, describe, test} from "vitest"
import {User, UserInfo, UserUpdates} from "../models/schemas.model"
import DAO from '../dao/factory';
import { Err } from "../models/general.model";






describe("test to UserManager", ()=>{
    const um = DAO.um()
     test("create user test", async()=>{
         const t:UserInfo = {
             firstName:"Alexis",
             lastName:"Perdomo",
             username:"tercero",
             password:"Pooloc3s*",
             email:undefined,
             createdAt: new Date(),
             updatedAt: new Date(),
             role:"user"
         }
         const response = await um.createUser(t)
         assertType<User | Err>(response)
         if ("error" in response){
             assert.fail("error in response")
         }else{
             assert.strictEqual(response.firstName, "Alexis")
         }
     })
    
    test("get users test", async()=>{
        const response = await um.getUser("tercero")
        if("username" in response){
            assert.strictEqual(response.username, "tercero")
        }else{
            assert.fail("there was a problem getting an existing user")
        }
    })
    test("update user test", async()=>{
        const updates:UserUpdates ={
            firstName:"cambiado",
            email:"valido@hotmail"
        }
        const response = await um.updateUser("tercero", updates)
        if("error" in response){
            console.error(response)
            assert.fail()
        }
        assert.strictEqual(response.firstName, "cambiado")
        assert.strictEqual(response.email, "valido@hotmail")
    })
    test("delete users test", async()=>{
        const response = await um.deleteUser("tercero")
        if ("error" in response){
            console.error(response)
            assert.fail("there were something wrong with deleting thew id")
        }
    })
})

