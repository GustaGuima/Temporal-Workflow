import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('credit')
export class CreditEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    application_id: string;

    @Column()
    pre_approval: boolean;

    @Column()
    credit_score: number;

    @Column()
    mortgage: number;
}
