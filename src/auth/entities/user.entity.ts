import { ApiProperty } from "@nestjs/swagger";
import { Task } from "../../tasks/entities/task.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'example@example.com',
        description: 'Auth email',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'Password123',
        description: 'Auth password'
    })
    @Column({
        type: 'text',
        select: false, // Quiere decir que para cualquier metodo find* no selecciona el password para retornarlo
    })
    password: string;

    @ApiProperty({
        example: 'User ...',
        description: 'Auth fullaname'
    })
    @Column({
        type: 'text'
    })
    fullName: string;

    @ApiProperty({
        example: true,
        description: 'Auth active or inactive'
    })
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: ['super-admin', 'admin', 'user'],
        description: 'Auth roles user'
    })
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        example: new Date(Date.now()),
        description: 'Auth date created'
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        example: new Date(Date.now()),
        description: 'Auth date updated'
    })
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(
        () => Task,
        (task) => task.user,
        // {cascade: true} 
    )
    task: Task;

    /**
     * * Garantiza que el correo se entandarice en cuanto a mayusculas y minusculas antes de insertar
     */
    @BeforeInsert()
    checkEmailInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkEmailUpdate(){
        this.checkEmailInsert();
    }
}
