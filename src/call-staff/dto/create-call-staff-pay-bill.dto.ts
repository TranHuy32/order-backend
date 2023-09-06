export class CreateCallStaffPayBillDto {
  constructor(
    public readonly table: string,
    public readonly customer_name: string,
    public readonly totalBill: number,
  ) {}
}
