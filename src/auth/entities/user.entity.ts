import { Task } from "src/tasks/entities/task.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        select: false, // Quiere decir que para cualquier metodo find* no selecciona el password para retornarlo
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @CreateDateColumn()
    createdAt: Date;

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
