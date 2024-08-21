import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PasswordReset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    token: string;

    @Column()
    expiredAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => User, (user) => user.passwordReset)
    @JoinColumn()
    user: User;
}