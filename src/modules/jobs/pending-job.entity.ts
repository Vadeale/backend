import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pending_jobs' })
export class PendingJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token!: string;

  @Column({ name: 'payment_id', type: 'varchar', length: 64, nullable: true, unique: true })
  paymentId!: string | null;

  @Column({ type: 'text' })
  text!: string;

  @Column({ name: 'employer_email', type: 'varchar', length: 255 })
  employerEmail!: string;

  @Column({ name: 'public_contacts', type: 'varchar', length: 255 })
  publicContacts!: string;

  @Column({ type: 'varchar', length: 32, default: 'other' })
  category!: string;

  @Column({ type: 'varchar', length: 32, default: 'pending' })
  status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
