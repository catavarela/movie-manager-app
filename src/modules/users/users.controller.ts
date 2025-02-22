import { Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Roles } from "./decorators/roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "./guards/roles.guard";

@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post(':uuid/promote')
  @ApiOperation({ summary: 'Promote users to admin. Only the ROOT user can perform this action.' })
  @ApiOkResponse({ description: 'Returns the user promoted to admin.'})
  @ApiNotFoundResponse({ description: ERROR_MSG_USERS.USER_NOT_FOUND })
  @Roles(Role.ROOT)
  async promoteToAdmin(@Param('uuid') uuid: string) {
    return await this.users.promoteToAdmin(uuid);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by email. Only the ROOT user can perform this action.' })
  @ApiOkResponse({ description: 'Returns the user that matches the email provided.'})
  @ApiNotFoundResponse({ description: ERROR_MSG_USERS.USER_NOT_FOUND })
  @Roles(Role.ROOT)
  async searchUserByEmail(@Query('email') email: string) {
    const user = await this.users.findOneByEmail(email);

    if(!user) {
      throw new NotFoundException(ERROR_MSG_USERS.USER_NOT_FOUND)
    }

    return user;
  }
}