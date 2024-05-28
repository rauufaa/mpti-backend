import {web} from "../src/application/web.js"
import supertest from "supertest"
import bcrypt from "bcrypt"


describe("POST /users", function() {
    it("Should can login", async ()=>{
        const result = await supertest(web)
            .post("/users")
            .send({
                username: "ABCDE",
                password: "123456"
            })
        
        expect(result.status).toBe(200)
        expect(result.token).toBeDefined()
    })
})