import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export interface RevenueRecordAttributes {
  id: number;
  themeName: string;
  sessionTime: Date;
  income: number;
  expense: number;
  actualAttendance: number;
  reservationCount: number;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RevenueRecordCreationAttributes
  extends Optional<RevenueRecordAttributes, "id" | "createdAt" | "updatedAt"> {}

export class RevenueRecord
  extends Model<RevenueRecordAttributes, RevenueRecordCreationAttributes>
  implements RevenueRecordAttributes
{
  public id!: number;
  public themeName!: string;
  public sessionTime!: Date;
  public income!: number;
  public expense!: number;
  public actualAttendance!: number;
  public reservationCount!: number;
  public remark?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RevenueRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    themeName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "theme_name",
    },
    sessionTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "session_time",
    },
    income: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    expense: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    actualAttendance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "actual_attendance",
    },
    reservationCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "reservation_count",
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "revenue_records",
    timestamps: true,
    underscored: true,
  }
);
