import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Types } from "mongoose";

import { CouponService } from "@services/coupons.service";
import { Coupon } from "@models/coupons.model";
import { CreateCouponInput, UpdateCouponInput } from "@schemas/coupons.schema";
import { Inject, Service } from "typedi";

@Service()
@Resolver((_of) => Coupon)
export class CouponResolver {
  constructor(
    @Inject()
    private readonly couponService: CouponService
  ) {}

  @Query(() => [Coupon])
  public async getCoupons(): Promise<Coupon[]> {
    const coupons: Coupon[] = await this.couponService.findAllCoupons();

    return coupons;
  }

  @Query(() => Coupon)
  public async getCouponByCode(@Arg("code") code: string): Promise<Coupon> {
    const coupon: Coupon = await this.couponService.findCouponByCode(code);

    return coupon;
  }

  @Authorized("admin")
  @Mutation(() => Coupon)
  public async createCoupon(
    @Arg("couponData") couponData: CreateCouponInput
  ): Promise<Coupon> {
    const coupon: Coupon = await this.couponService.createNewCoupon(couponData);

    return coupon;
  }

  @Authorized()
  @Query(() => Coupon)
  public async validateCoupon(
    @Arg("couponCode") couponCode: string
  ): Promise<Coupon> {
    const coupon: Coupon = await this.couponService.validateOneCoupon(
      couponCode
    );

    return coupon;
  }

  @Authorized("admin")
  @Mutation(() => Coupon)
  public async updateCoupon(
    @Arg("couponId") couponId: Types.ObjectId,
    @Arg("couponData") couponData: UpdateCouponInput
  ): Promise<Coupon> {
    const coupon: Coupon = await this.couponService.updateOneCoupon(
      couponId,
      couponData
    );

    return coupon;
  }

  @Authorized("admin")
  @Mutation(() => Coupon)
  public async deleteCoupon(
    @Arg("couponId") couponId: Types.ObjectId
  ): Promise<Coupon> {
    const coupon: Coupon = await this.couponService.deleteOneCoupon(couponId);

    return coupon;
  }
}
