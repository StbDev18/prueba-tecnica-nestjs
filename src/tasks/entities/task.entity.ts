import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EnumTaskStatus } from "../interfaces/task-status.enum.interface";

@Entity({name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true // Opcional
    })
    description: string;

    @Column({
        type: 'text',
        default: EnumTaskStatus.PENDING
    })
    status: EnumTaskStatus;

    @ManyToOne(
        () => User,
        (user) => user.task,
        {eager: true}
    )
    user: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
