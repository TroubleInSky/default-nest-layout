import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AutoMap } from "@automapper/classes";
import {Role} from "../common/interfaces/user/role.enum";


@Entity("user")
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({ type: "varchar", length: 300 })
  @AutoMap()
  public email: string;

  @Column({ type: "varchar", length: 128 })
  public password: string;

  @Column({ type: "varchar", length: 64 })
  @AutoMap()
  public firstName: string;

  @Column({ type: "varchar", length: 64 })
  @AutoMap()
  public lastName: string;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP"
  })
  public created: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  @AutoMap()
  public role: Role

}
