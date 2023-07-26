export class CreateCallStaffDto {
  constructor(
    public readonly table: string,
    public readonly customer_name: string,
  ) {}
}
