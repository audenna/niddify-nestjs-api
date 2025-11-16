import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  UserTypesAllowed,
  UserTypesGuard,
} from '../../../common/guards/user-types.guard';
import { UserService } from '../services';
import { FilterCustomerDto } from '../dto/filter-customer-dto';
import { UserTypes } from '../../../common/enums/user.types';
import { AuthUserService } from '../../auth-user/auth.user.service';

@UseGuards(JwtAuthGuard, UserTypesGuard)
@UserTypesAllowed(UserTypes.NIDDIFY_ADMIN)
@Controller('customers')
export class AdminCustomerController {
  constructor(
    private readonly userService: UserService,
    private readonly authUserService: AuthUserService,
  ) {}
  //
  // @Get()
  // async fetchAllCustomers(@Query() filter: FilterCustomerDto): Promise<any> {
  //   return await this.userService.fetchAllCustomers(filter);
  // }
  //
  // @Get('/:authUserId')
  // async findCustomerById(
  //   @Param('authUserId') authUserId: number,
  // ): Promise<any> {
  //   return await this.userService.findCustomerById(authUserId);
  // }
  //
  // @Put('/:authUserId/toggleAccountSuspension')
  // async toggleAccountSuspension(
  //   @Param('authUserId') authUserId: number,
  // ): Promise<any> {
  //   return await this.authUserService.toggleAccountSuspension(authUserId);
  // }
  //
  // @Get('/:authUserId/reservations')
  // async fetchCustomerReservations(
  //   @Param('authUserId') authUserId: number,
  //   @Query() query: FilterCustomerReservationDto,
  // ): Promise<any> {
  //   return await this.reservationService.fetchCustomerReservations(
  //     authUserId,
  //     query,
  //   );
  // }
}
