import { Injectable } from '@nestjs/common'
import { PrismaService } from '@modules/prisma/prisma.service'
import {
  User,
  Prisma,
  Role,
} from '@prisma/client'

export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })
    if (user) return user

    return this.prisma.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where })

    /* return if not found */
    if (!user) return null

    /* delete sessions */
    await this.prisma.session.deleteMany({ where: { userId: user.id } })

    /* finally delete user*/
    return this.prisma.user.delete({
      where,
    })
  }

  async upsetUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserCreateInput
  }): Promise<User> {
    const { where, data } = params

    return this.prisma.user.upsert({
      where,
      update: { ...data },
      create: { ...data },
    })
  }

  async updateRole(id: string, role: Role): Promise<User | null> {
    const where = { id }
    const data = { role }
    return this.prisma.user.update({
      where,
      data,
    })
  }
}
