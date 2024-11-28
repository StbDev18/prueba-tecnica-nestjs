import { User } from "../../auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EnumTaskStatus } from "../interfaces/task-status.enum.interface";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'tasks' })
export class Task {

    @ApiProperty({
        example: 'e0df74ef-481f-46d4-a790-320dc2ffd576',
        description: 'Task Id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Realizar compras',
        description: 'Task Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 'Comprar alimentos, implementos de aseo.',
        description: 'Task description',
        nullable: true
    })
    @Column({
        type: 'text',
        nullable: true // Opcional
    })
    description: string;

    @ApiProperty({
        example: 'pending',
        description: 'Task status',
    })
    @Column({
        type: 'text',
        default: EnumTaskStatus.PENDING
    })
    status: EnumTaskStatus;

    @ApiProperty()
    @ManyToOne(
        () => User,
        (user) => user.task,
        { eager: true }
    )
    @JoinColumn({ name: 'userId' })
    user: User

    @Column()
    userId: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

}
