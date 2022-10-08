import { User } from "@modules/users/entities/User";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

export enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@Entity("statements")
export class Statement {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("uuid")
  user_id: string;

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("uuid")
  receiver_id?: string;

  @Column("uuid")
  sender_id?: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column({ type: "enum", enum: OperationType })
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
