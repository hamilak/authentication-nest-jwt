import { Role } from "src/enums/role.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PasswordReset } from "./password.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    role: Role;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToOne(() => PasswordReset)
    passwordReset: PasswordReset
}
