import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findOrCreateUser = async(uid: string, email?: string) =>{
    let user = await prisma.user.findUnique({where: {id: uid}});
    if(!user) {
        user = await prisma.user.create({
            data: {
                id: uid,
                email: email || `user+${uid}@example.com`,
            }
        })
    }
    return user;
}