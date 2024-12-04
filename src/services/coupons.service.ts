import { Service } from "typedi";
import { Types } from "mongoose";

import { UserModel, CouponModel } from "@models";
import { Coupon, Status } from "@models/coupons.model";
import { User } from "@models/users.model";
import { CreateCouponInput, UpdateCouponInput } from "@schemas/coupons.schema";
import { DocumentType } from "@typegoose/typegoose";

@Service()
export class CouponService {
  public async findAllCoupons(): Promise<Coupon[]> {
    const coupons: Coupon[] = await CouponModel.find();

    return coupons;
  }

  public async findCouponByCode(code: string): Promise<Coupon> {
    const coupon: Coupon = await CouponModel.findOne({ code });

    return coupon;
  }

  public async createNewCoupon(couponData: CreateCouponInput): Promise<Coupon> {
    const findCoupon: Coupon = await CouponModel.findOne({
      code: couponData.code,
    });

    if (findCoupon) {
      throw new Error(`Coupon with code ${couponData.code} already exists`);
    }

    const findUser: User = await UserModel.findById(couponData.owner);

    if (!findUser) {
      throw new Error("Owner not found");
    }

    const newCoupon: Coupon = await CouponModel.create({
      ...couponData,
    });

    return newCoupon;
  }

  public async validateOneCoupon(couponCode: string): Promise<Coupon> {
    const findCoupon: DocumentType<Coupon> = await CouponModel.findOne({
      code: couponCode,
    });

    if (!findCoupon) {
      throw new Error("Coupon not found");
    }

    if (findCoupon.status !== Status.ACTIVE) {
      throw new Error("Coupon is not active");
    }

    if (findCoupon.expirationDate && findCoupon.expirationDate < new Date()) {
      findCoupon.status = Status.EXPIRED;
      await findCoupon.save();
      throw new Error("Coupon has expired");
    }

    if (findCoupon.limit && findCoupon.limit <= 0) {
      findCoupon.status = Status.REDEEMED_OUT;
      await findCoupon.save();
      throw new Error("Coupon has been redeemed out");
    }

    // Decrease the coupon limit by 1
    findCoupon.limit -= 1;

    if (findCoupon.limit <= 0) {
      findCoupon.status = Status.REDEEMED_OUT;
    }

    await findCoupon.save();

    return findCoupon;
  }

  public async updateOneCoupon(
    couponId: Types.ObjectId,
    couponData: UpdateCouponInput
  ): Promise<Coupon> {
    const updatedCoupon: Coupon = await CouponModel.findByIdAndUpdate(
      couponId,
      { ...couponData },
      { new: true }
    );

    if (!updatedCoupon) {
      throw new Error("Coupon not found");
    }

    return updatedCoupon;
  }

  public async deleteOneCoupon(couponId: Types.ObjectId): Promise<Coupon> {
    const deletedCoupon: Coupon = await CouponModel.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      throw new Error("Coupon not found");
    }

    return deletedCoupon;
  }
}
